import React, { useEffect, useRef, useState } from 'react'
import { Form, Button } from 'rsuite';
import {useForm} from '../../hooks/useForm';
import { useParams } from 'react-router-dom';
import {driverFiscalDataSave,driversAddressId} from '../../services/drivers'
import Toast from '../../components/Toast';

export const FiscalDataDriver = ({handleId,idDriver}) => {

  const {id} = useParams();
  const [textButton,setTextButton] = useState("Guardar");

  const {formState,onInputChange,updateForm} = useForm(
    {
      RFC: '',
      Street:'',
      ExtNumber:'',
      IntNumber: '',
      zip: '',
      colony: '',
      state:'',
      municipaly:'',
    }
  );

  const handleChange = (e,event) =>{
    onInputChange(event);
  }

  const {RFC,Street,ExtNumber,IntNumber,municipaly,zip,colony,state} = formState;

  useEffect(() => {
    if (id) {
      setTextButton("Actualizar");     
      handleId(id);
      getData(); 
    }
    if ( idDriver != 0) {
      setTextButton("Actualizar");
      getData(idDriver);  
    }
  },[]);

  const getData = async (id)=>{

    //await loader.current.handleShow('Cargando...');
      const response = await  driversAddressId(id);

      const isEmpty = Object.keys(response).length === 0;
      if (isEmpty) {
      }else{
        
        updateForm({
          RFC: response.RFC === null ? '' : response.rfc,
          Street: response.street === null ? '' : response.street,
          ExtNumber: response.ext_number === null ? '' : response.ext_number,
          IntNumber: response.int_number === null || response.int_number === undefined ? '' : response.int_number,
          zip: response.zip === null ? '' : response.zip_code,
          colony: response.colony === null ? '' : response.colony,
          state: response.state === null ? '' : response.state,
          municipaly: response.municipaly === null ? '' : response.municipality,
        });

      }
        
    //await loader.current.handleClose();

  }

  const handleSubmit = () => {
    if (isValidForm('form.fiscales')) {
      prepareToSave();
      return;
    }else{
      Toast.fire({icon:'error', title:'Error', text:'Datos Incompletos', timer:4500})
    }
    
  };


  const isValidForm = (element)=>{
    var ctrls = [];
		const select = document.querySelector(element);

		if(select !== null){
			ctrls = select.querySelectorAll('input, select');

			let isFormValid = true;
			ctrls.forEach(ctrl => {

				if(ctrl.required){
					const isInputValid = showCtrlError(ctrl.id);

					if (!isInputValid) {
						isFormValid = false;
					}
				}
			});
		
			return isFormValid;
		}

		return true;  

	};

  const showCtrlError = (id)=>{
		var res = null;
		var control = document.getElementById(id);

		if(control !== null){
			if (control.value.trim() === "") {
				if(control !== null){
					control.classList.add('error');
				}
				res = false;
			} else{
				if(control !== null){
					if(control.required && control.className.includes('error')){
						control.classList.remove('error');
					}
				}
				res = true;
			}
		}

		return res;
	};


  const prepareToSave = async() =>{
    console.log("idDriver pasado " + idDriver);
    const obj={
      RFC: RFC,
      street: Street,
      ext_number: ExtNumber,
      int_number: IntNumber,
      zip_code: zip,
      colony: colony,
      state: state,
      municipality: municipaly,
      drivers_id: idDriver,
      isFiscal: '1',
    }

    
    const response = await driverFiscalDataSave(obj);
    console.log(response);
    if(response){

      if( response.error !== undefined ){
          if(response[0].message.indexOf('Error') !== -1){
              Toast.fire({icon:'error', title:'Error', text: response[0].message, timer:4500})
          }
      }else{

        if (response[0]?.data?.id !== undefined) {
          //handleId(response[0].data.id);
        } else {
            // El valor es undefined
        }
          Toast.fire({icon:'success', title:'Datos Almacenados Correctamente', text:response.mensaje});
          setTextButton("Actualizar");
          //navigate('/admin/roles/list');
      }
      
    }
  };


  return (
    <>
      
      <Form layout="inline" className={"fiscales"}>

      <Form.Group controlId="RFCLine">
        <Form.ControlLabel>RFC</Form.ControlLabel>
        <Form.Control name="RFC" style={{ width: 210 }} 
          size="sm"
          onChange={handleChange}
          value = {RFC}
          required/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <br />

      <Form.Group controlId="address1">
        <Form.ControlLabel>Calle</Form.ControlLabel>
        <Form.Control name="Street" style={{ width: 200 }} 
          size="sm" 
          onChange={handleChange}
          value = {Street}
          required/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="number1">
        <Form.ControlLabel>Numero Exterior</Form.ControlLabel>
        <Form.Control name="ExtNumber" style={{ width: 125 }} 
          size="sm" 
          onChange={handleChange}
          value = {ExtNumber}
          required/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="number2">
        <Form.ControlLabel>Numero Interior</Form.ControlLabel>
        <Form.Control name="IntNumber" style={{ width: 125 }} 
          size="sm" 
          value = {IntNumber}
          onChange={handleChange}/>
      </Form.Group>

      <br />

      <Form.Group controlId="CP">
        <Form.ControlLabel>Codigo Postal</Form.ControlLabel>
        <Form.Control name="zip" style={{ width: 130 }} 
          size="sm" 
          onChange={handleChange}
          value = {zip}
          required/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="Col">
        <Form.ControlLabel>Colonia</Form.ControlLabel>
        <Form.Control name="colony" style={{ width: 200 }} 
          size="sm" 
          value = {colony}
          onChange={handleChange}
          required/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="munD">
        <Form.ControlLabel>Municipio</Form.ControlLabel>
        <Form.Control name="municipaly" style={{ width: 180 }} 
          size="sm" 
          onChange={handleChange}
          value = {municipaly}
          required/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <br />

      <Form.Group controlId="stateD">
        <Form.ControlLabel>Estado</Form.ControlLabel>
        <Form.Control name="state" style={{ width: 185 }} 
          size="sm" 
          onChange={handleChange}
          value = {state}
          required/>
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <br />

      <Button color="blue" appearance="primary" type="submit" onClick={handleSubmit} > {textButton} </Button>
    </Form>
    </>
  )
}

export default FiscalDataDriver
