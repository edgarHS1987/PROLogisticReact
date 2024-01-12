import React, { useState,useEffect } from 'react'
import { Modal, Button, ButtonToolbar, Placeholder,Uploader,Divider } from 'rsuite';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import {driversUploadDocument,driverClearFolder} from '../../services/drivers'
import { uploadFile } from '../../helpers/uploadDocument';

import { useFetchFiles } from '../../hooks/useFetchFiles';

export const ImagesUpload = forwardRef(function ImagesUpload( 
  {info,handleCountFilesINE,handleCountFilesLic,handleCountFilesComprobante,handleCountFilesSAT,loader}, ref ) {

  const [files, setFiles] = useState([]);
  const [open, setOpen] = React.useState(false);
  const {docs,isLoading} = useFetchFiles( info.title , info.driver,open );
  

  useImperativeHandle(ref, () => {
    return {
      handleOpen,
    };
  }, []);  

  const handleChange = async (fileArray) => {
    setFiles(fileArray);
  };

  const handleClose = () => {
    setOpen(false);
    
  }

  const handleOpen = async (tipoDoc) => {
    setOpen(true);
  }


  const prepareToSave = async () =>{

    const obj={
      idDriver: info.driver,
      tipo: info.title,
    }

    const resDelete = await driverClearFolder(obj); 

    files.forEach(function (elemento) {
      //console.log(elemento);
      let obj = uploadFile ( elemento,info.driver,info.title );
    });

    setOpen(false);
    

  };
  

  useEffect(() => {

    if ( info.title !== '' ) {

      if (isLoading === false) {

        setFiles(docs);
        loader.current.handleClose();

      }else if(isLoading === true){
        loader.current.handleShow('Cargando...');

      }
    }
      
  },[isLoading]);



  useEffect(() => {

    //if ( open === false ) {
      if ( info.title === 'Identificacion Oficial' ) {
        handleCountFilesINE( files.length );
      }else if( info.title === 'Licencia Conducir' ){
        handleCountFilesLic( files.length );
      }else if( info.title === 'Comprobante Domicilio' ){
        handleCountFilesComprobante( files.length );
      }else if( info.title === 'Constancia Situacion Fiscal' ){
        handleCountFilesSAT( files.length );
      }
      
    //}
        
    
  },[files]);




 

  return (
    <>
      {/* <form method="POST" encType="multipart/form-data" onSubmit={prepareToSave}> */}

        <Modal open={open} keyboard={false}>
          <Modal.Header closeButton={false}>
            <Modal.Title>Archivos - { info.title }</Modal.Title>
          </Modal.Header>
          <Divider />
          <Modal.Body>
            <Uploader 
                url=""
                accept="image/*,.pdf" 
                name = 'archivo'
                fileList={files}
                onChange={handleChange}
                autoUpload={false}
            >
                
            <Button appearance="default" active size='xs'>
              Seleccionar Archivo...
            </Button>
            </Uploader>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={prepareToSave} appearance="primary" size='xs'>
              Guardar Archivos
            </Button>
            <Button appearance="primary" size='xs' onClick={handleClose}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      {/* </form> */}
    </>
  );
});

export default ImagesUpload