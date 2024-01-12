import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import {ImagesUpload} from '../modals/ImagesUpload';

import {useForm} from '../../hooks/useForm';
import {isValidForm} from '../../helpers/validForm';
import Toast from '../../components/Toast';
import { driverVehicleSave,driverVehicleId,driverVehicleUpdate } from  '../../services/drivers'

import { Form,Button,Grid, Row, Col,
  IconButton,Stack,InputGroup,ButtonToolbar,Divider  } from 'rsuite';
import '../../assets/css/steps.css';
import AttachmentIcon from '@rsuite/icons/legacy/Attachment';
import {VisorDocuments} from '../modals/VisorDocuments';


export const DocsVehicle = ({idDriver,loader}) => {

  const [textButton,setTextButton] = useState("Guardar");
  const [tipo,setTipo] = useState('');

  const modalRef = useRef(null);
  const visorRef = useRef(null);

  const {formState,onInputChange,updateForm} = useForm(
    {
      marca: '',
      modelo:'',
      year: '',
      placas: '',
      color: '',
    }
  );

  const {marca,modelo,year,placas,color} = formState;

  const handleChange = (e,event) =>{
    onInputChange(event);
  }

  //Modal para agregar archivos
  const handleModal = (tipoDocument) => {
    setTipo(tipoDocument);
    modalRef.current.handleOpen( tipoDocument );
  };


  //Modal para visor de Archivos
  const handleVisor = (tipoDocument) => {
    setTipo(tipoDocument);
    visorRef.current.handleOpen( tipoDocument );
  };

  const handleSubmit = () => {

    if (isValidForm('form.datosVehicle')) {
      prepareToSave();
      return;
    }else{
      Toast.fire({icon:'error', title:'Error', text:'Datos Incompletos', timer:4500})
    }

  };

  const prepareToSave = async() =>{
    console.log("idDriver que se guardara " + idDriver);

    const obj={
      drivers_id: idDriver,
      marca: marca,
      modelo: modelo,
      color: color,
      placas: placas,
      year: year
    }
    
    let response;
    if ( textButton === "Actualizar" ) {
      response = await driverVehicleUpdate(obj);
    }else if( textButton === "Guardar" ) {
      response = await driverVehicleSave(obj);
    }
    
    console.log(response);

    if(response){

      if( response.error !== undefined ){
          if(response.error === false){
            Toast.fire({icon:'success', title:'Datos Almacenados Correctamente', text:response.message});
            setTextButton("Actualizar");
              
          }else if(response.error === true){
            Toast.fire({icon:'error', title:'Error', text: response.message, timer:4500})
          }
      }
      
    }
  };

  const getData = async (idData)=>{

    await loader.current.handleShow('Cargando...');

      const response = await  driverVehicleId(idData);

      const isEmpty = Object.keys(response).length === 0;
      if (isEmpty) {
      }else{
        
        setTextButton( "Actualizar" );
        updateForm({
          marca: response.brand === null ? '' : response.brand,
          modelo: response.model === null ? '' : response.model ,
          year: response.year === null ? '' : response.year,
          placas: response.plate === null ? '' : response.plate,
          color: response.color === null ? '' : response.color,
        });

      }

    await loader.current.handleClose();

  }


  useEffect(() => {

    if ( idDriver != 0) {
      getData( idDriver );  
    }
    
  },[idDriver]);

  return (
    <>
      <ImagesUpload ref={modalRef} info={{title: tipo,driver: idDriver}} 
        // handleCountFilesINE={handleCountFilesINE} 
        // handleCountFilesLic = { handleCountFilesLic }
        // handleCountFilesComprobante = { handleCountFilesComprobante }
        // handleCountFilesSAT = { handleCountFilesSAT }
        loader={loader}
      />
      
      <VisorDocuments ref={visorRef} info={{title: tipo,driver: idDriver}}
        loader={loader}

      />
      
      <br />
      <Form >

      <Row className="show-grid">
      <Col xs={6}>
        <Stack spacing={30}>
            <IconButton color="cyan" icon={<AttachmentIcon />} appearance="default" size='sm' onClick={() => handleModal('Fotos del Auto')}>
              Agregar Fotos del Auto
            </IconButton>

            <Button color="cyan" appearance="default" size='sm'
              onClick={() => handleVisor('Fotos del Auto')}>
              Ver Fotos del Auto
            </Button>

        </Stack>
        </Col>
      </Row>
      
      <Divider />
      <Row className="show-grid">
      <Col xs={6}>
        <Stack spacing={6}>
            <Form.ControlLabel>Seguro del Auto:</Form.ControlLabel>
        </Stack>
      </Col>
      </Row>

      <Row className="show-grid">
        <Col xs={24}>
          <Form layout="inline" className={"datosVehicle"}>
            <Form.Group controlId="marcaCtrl">
              <Form.ControlLabel>Marca</Form.ControlLabel>
              <Form.Control placeholder="Marca" 
              name="marca" 
              value = {marca}
              onChange={handleChange}
              size='sm'
              required/>
            </Form.Group>

            <Form.Group controlId="modeloCtrl">
              <Form.ControlLabel>Modelo</Form.ControlLabel>
              <Form.Control placeholder="Modelo" 
              name="modelo" 
              value = {modelo}
              onChange={handleChange}
              size='sm' 
              required/>
            </Form.Group>

            <Form.Group controlId="yearCtrl">
              <Form.ControlLabel>Año</Form.ControlLabel>
              <Form.Control placeholder="Año" 
              name="year" 
              value = {year}
              onChange={handleChange}
              size='sm' 
              required/>
            </Form.Group>

            <Form.Group controlId="placaCtrl">
              <Form.ControlLabel>Placas</Form.ControlLabel>
              <Form.Control placeholder="Placas" 
              name="placas" 
              value = {placas}
              onChange={handleChange}
              size='sm' 
              required/>
            </Form.Group>

            <Form.Group controlId="colorCtrl">
              <Form.ControlLabel>Color</Form.ControlLabel>
              <Form.Control placeholder="Color" 
              name="color" 
              value = {color}
              onChange={handleChange}
              size='sm' 
              required/>
            </Form.Group>

            <Form.Group controlId="seguroCtrl">
              <Form.ControlLabel>Archivos del Seguro</Form.ControlLabel>
                <Stack spacing={20}>
                  <IconButton icon={<AttachmentIcon />} appearance="default" size='sm' onClick={() => handleModal('Seguro Auto')}>
                    Click para agregar
                  </IconButton>
                  <Button appearance="default" size='sm' onClick={() => handleVisor('Seguro Auto')}>
                    Ver Archivos
                  </Button>
                </Stack>
            </Form.Group>

          </Form>
        </Col>

      </Row>

      <br />

      
      <Button color="blue" appearance="primary" type="submit" size="sm" onClick={handleSubmit}> {textButton} </Button>
      </Form>
    </>
  )
}

export default DocsVehicle
