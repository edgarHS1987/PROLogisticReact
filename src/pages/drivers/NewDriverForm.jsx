import React, { useEffect, useRef, useState } from 'react'
import { Form, Button } from 'rsuite';
import {useForm} from '../../hooks/useForm';
import { Schema } from 'rsuite'
import {driverSave,driversId} from '../../services/drivers'

import Title from '../../components/Title';
import Toast from '../../components/Toast';
import { useParams } from 'react-router-dom';

export const NewDriverForm = ({handleId,idDriver}) => {
  
  const {id} = useParams();
  const [textButton,setTextButton] = useState("Guardar");

  const {formState,onInputChange,updateForm} = useForm(
    {
      nameDriver: '',
      email:'',
      last1: '',
      last2: '',
      phone1: '',
      phone2: '',
    }
  );

  const {nameDriver,email,last1,last2,phone1,phone2} = formState;

  useEffect(() => {
    
    if (id) {
      setTextButton("Actualizar");
      handleId(id);
      getData(id); 
    }

    if ( idDriver != 0) {
      setTextButton("Actualizar");
      getData(idDriver);  
    }

  },[]);

  const getData = async (id)=>{

    //await loader.current.handleShow('Cargando...');
      const response = await  driversId(id);

      const isEmpty = Object.keys(response).length === 0;
      if (isEmpty) {
      }else{
        
        updateForm({
          nameDriver: response.names === null ? '' : response.names,
          email: response.email === null ? '' : response.email,
          last1: response.lastname1 === null ? '' : response.lastname1,
          last2: response.lastname2 === null ? '' : response.lastname2,
          phone1: '88',
          phone2: '89',
        });

      }
        
    //await loader.current.handleClose();

  }

  const handleChange = (e,event) =>{
    onInputChange(event);
  }

  const handleSubmit = () => {
    if (isValidForm('form.personales')) {
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
    console.log("idDriver pasadp " + idDriver);
    const obj={
      names: nameDriver,
      lastname1: last1,
      lastname2: last2,
      phone: phone1,
      status: 'activo',
      email: email,
      idDriver: idDriver,
    }

    const response = await driverSave(obj);

    if(response){
      
      console.log(response);
      if(response.error){
          if(response.message.indexOf('Error') !== -1){
              Toast.fire({icon:'error', title:'Error', text:'Email ya Existente', timer:4500})
          }
      }else{

        if (response[0]?.data?.id !== undefined) {
          handleId(response[0].data.id);
          console.log("se dio de alta el " + response[0].data.id);
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
      <Form layout="inline" className={"personales"}>
      <Form.Group controlId="namesDriver">
        <Form.ControlLabel>Nombre</Form.ControlLabel>
        <Form.Control 
          name = "nameDriver"
          style={{ width: 160 }} 
          value = {nameDriver}
          onChange={handleChange}
          size="sm"
          required
          />
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="lname1">
        <Form.ControlLabel>Apellido Paterno</Form.ControlLabel>
        <Form.Control 
          name="last1" 
          style={{ width: 150 }}
          value = {last1}
          onChange={handleChange}
          size="sm"
          required
        />
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="lname2">
        <Form.ControlLabel>Apellido Materno</Form.ControlLabel>
        <Form.Control 
          name="last2" 
          style={{ width: 150 }} 
          value = {last2}
          onChange={handleChange}
          size="sm"
        />
      </Form.Group>

      <br />

      <Form.Group controlId="MainPhone">
        <Form.ControlLabel>Telefono</Form.ControlLabel>
        <Form.Control 
          name="phone1" 
          style={{ width: 155 }}
          value = {phone1}
          onChange={handleChange}
          size="sm"
          required
        />
        <Form.HelpText tooltip>Obligatorio</Form.HelpText>
      </Form.Group>

      <Form.Group controlId="AditionalPhone">
        <Form.ControlLabel>Telefono Adicional</Form.ControlLabel>
        <Form.Control 
          name="phone2" 
          style={{ width: 150 }} 
          value = {phone2}
          onChange={handleChange}
          size="sm"
        />
      </Form.Group>

      <Form.Group controlId="emailControl">
        <Form.ControlLabel>Email</Form.ControlLabel>
        <Form.Control 
          name="email" 
          style={{ width: 150 }} 
          value = {email}
          onChange={handleChange}
          size="sm"
          required
        />
      </Form.Group>

      <br />

      <Button color="blue" appearance="primary" type="submit" onClick={handleSubmit}> {textButton} </Button>
    </Form>
    </>
  )
}

export default NewDriverForm;
