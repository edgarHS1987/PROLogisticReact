import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import {ImagesUpload} from '../modals/ImagesUpload';

import {FileViewer} from '../drivers/Test';
import {useForm} from '../../hooks/useForm';
import {isValidForm} from '../../helpers/validForm';
import Toast from '../../components/Toast';
import {driverDocumentsSave,driverDocumentsId} from  '../../services/drivers'

import { Form,DatePicker, Button,Grid, Row, Col,Badge  } from 'rsuite';
import '../../assets/css/steps.css';

import { useFetchFiles } from '../../hooks/useFetchFiles';


export const DocsDriverForm = ({idDriver,loader}) => {

  const {id} = useParams();
  const [numFilesINE,setNumFilesINE] = useState(false);
  const [numFilesSAT,setNumFilesSAT] = useState(false);
  const [numFilesLicencia,setNumFilesLicencia] = useState(false);
  const [numFilesComprobante,setNumFilesComprobante] = useState(false);

  const [textButton,setTextButton] = useState("Guardar");
  const [INEVigencia,setINEVigencia] =useState(null);
  const [licenciaVigencia,setLicenciaVigencia] =useState(null);
  const [tipo,setTipo] = useState('');

  

  const handleCountFilesINE = ( num ) =>{
    setNumFilesINE( num>0 ? num : false );
  }
  const handleCountFilesSAT = ( num ) =>{
    setNumFilesSAT( num>0 ? num : false );
  }
  const handleCountFilesComprobante = ( num ) =>{
    setNumFilesComprobante( num>0 ? num : false );
  }
  const handleCountFilesLic = ( num ) =>{
    setNumFilesLicencia( num>0 ? num : false );
  }

  const handleChangeINE = (date) =>{
    setINEVigencia(date);
  }

  const handleChangeLic = (date) =>{
    console.log(date);
    setLicenciaVigencia(date);
  }

  const modalRef = useRef(null);

  const handleModal = (tipoDocument) => {
    setTipo(tipoDocument);
    modalRef.current.handleOpen( tipoDocument );
  };

  const handleSubmit = () => {
    if ( numFilesINE !== false && INEVigencia === null) {
      Toast.fire({icon:'error', title:'Error', text:'Datos Incompletos', timer:4500})
    }else if ( numFilesLicencia !== false && licenciaVigencia === null) {
      Toast.fire({icon:'error', title:'Error', text:'Datos Incompletos', timer:4500})
    }else if( numFilesINE===false && INEVigencia !== null) {
      Toast.fire({icon:'error', title:'Error', text:'Datos Incompletos', timer:4500})
    }else if ( numFilesLicencia===false && licenciaVigencia !== null) {
      Toast.fire({icon:'error', title:'Error', text:'Datos Incompletos', timer:4500})
    }else if ( numFilesSAT === false ){
      Toast.fire({icon:'error', title:'Error', text:'Datos Incompletos', timer:4500})
    }else if ( numFilesComprobante === false ){
      Toast.fire({icon:'error', title:'Error', text:'Datos Incompletos', timer:4500})
    }else{
      prepareToSave();
      //return;
    }    
  };

  const prepareToSave = async() =>{
    console.log("idDriver que se guardara " + idDriver);

    let fecha;
    let fINE;
    let fLic;
    
    fecha = new Date(INEVigencia);
    fINE = fecha.toISOString().split('T')[0];

    fecha = new Date(licenciaVigencia);
    fLic = fecha.toISOString().split('T')[0];

    const obj={
      drivers_id: idDriver,
      expirationIdenti: fINE,
      expirationLicenc: fLic,
    }
    
    let response;
    if ( textButton === "Actualizar" ) {
      response = await driverDocumentsSave(obj);
      //const response = await driverDocumentsUpdate(obj,idDriver);
    }else if( textButton === "Guardar" ) {
      response = await driverDocumentsSave(obj);
    }
    
    console.log(response);
    if(response){

      if( response[0].error !== undefined ){
          if(response[0].error === false){
            Toast.fire({icon:'success', title:'Datos Almacenados Correctamente', text:response[0].message});
            setTextButton("Actualizar");
              
          }else if(response[0].error === true){
            Toast.fire({icon:'error', title:'Error', text: response[0].message, timer:4500})
          }
      }
      
    }
  };

  const getData = async (idData)=>{

    //await loader.current.handleShow('Cargando...');
      // const response1 = await  driverDocumentGet(idData);
      // console.log(response1);

      const response = await  driverDocumentsId(idData);
      if (response) {
        setTextButton("Actualizar");  
      }
      
      response.forEach(function (documentDriver) {
        if (documentDriver.type == 'INE') {
          const fecha = new Date(documentDriver.expiration_date);
          setINEVigencia(fecha);
        }
        if (documentDriver.type == 'Licencia') {
          const fecha = new Date(documentDriver.expiration_date);
          setLicenciaVigencia(fecha);
        }
      }); 
    //await loader.current.handleClose();

  }


  useEffect(() => {
    console.log("id driver " + idDriver);
    // if ( id ) {
    //   getData( id );
    // }
    if ( idDriver != 0) {
      getData( idDriver );  
    }
    
  },[idDriver]);

  return (
    <>
    
      <ImagesUpload ref={modalRef} info={{title: tipo,driver: idDriver}} 
        handleCountFilesINE={handleCountFilesINE} 
        handleCountFilesLic = { handleCountFilesLic }
        handleCountFilesComprobante = { handleCountFilesComprobante }
        handleCountFilesSAT = { handleCountFilesSAT }
        loader={loader}
      />
      
      <br />
      <Form className={"docsDriver"}>

      <Row className="show-grid">
        <Col xs={6}>
          <Form.ControlLabel>Identificacion Oficial</Form.ControlLabel>
        </Col>
        <Col xs={4}>
          <Badge content={numFilesINE} color="red">
            <Button color="cyan" appearance="default" size="xs" onClick={() => handleModal('Identificacion Oficial')}>
              Agregar Archivos
            </Button>
          </Badge>
        </Col>
        <Col xs={7}>
          <Form.Group controlId="INE">
            <DatePicker size="xs" placeholder="Vigencia" style={{width:150}} 
            placement="rightStart"
            name='INEVigencia'
            onChange={handleChangeINE}
            value={INEVigencia}
            required
          />
          </Form.Group>
          
        </Col>
        
        
      </Row>

      <br />

      <Row className="show-grid">
        <Col xs={6}>
          <Form.ControlLabel>Constancia Situacion Fiscal</Form.ControlLabel>
        </Col>
        <Col xs={4}>
          <Form.Group controlId="SAT">
            <Badge content={numFilesSAT} color="red">
              <Button color="cyan" appearance="default" size="xs" onClick={() => handleModal('Constancia Situacion Fiscal')}>
                Agregar Archivos
              </Button>
              </Badge>
          </Form.Group>
          
        </Col>       
      </Row>

      <br />

      <Row className="show-grid">
        <Col xs={6}>
          <Form.ControlLabel>Licencia Conducir</Form.ControlLabel>
        </Col>
        <Col xs={4}>
          <Badge content={numFilesLicencia} color="red">
            <Button color="cyan" appearance="default" size="xs" onClick={() => handleModal('Licencia Conducir')}>
              Agregar Archivos
            </Button>
          </Badge>
        </Col>
        <Col xs={7}>
          <Form.Group controlId="licencia">
            <DatePicker size="xs" placeholder="Vigencia" style={{width:150}} placement="rightStart"
              name='licenciaVigencia'
              onChange={handleChangeLic}
              value={licenciaVigencia}
              required
            />
          </Form.Group>
          
        </Col>
        
        
      </Row>

      <br />

      <Row className="show-grid">
        <Col xs={6}>
          <Form.ControlLabel>Comprobante de Domicilio</Form.ControlLabel>
        </Col>
        <Col xs={4}>
          <Badge content={numFilesComprobante} color="red">
            <Button color="cyan" appearance="default" size="xs" onClick={() => handleModal('Comprobante Domicilio')}>
                Agregar Archivos
            </Button>
          </Badge>
        </Col>
        
      </Row>

      <br />

      
      <Button color="blue" appearance="primary" type="submit" size="sm" onClick={handleSubmit}> {textButton} </Button>
      </Form>
    </>
  )
}

export default DocsDriverForm
