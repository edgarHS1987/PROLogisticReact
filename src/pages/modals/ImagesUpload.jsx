import React, { useState,useEffect } from 'react'
import { Modal, Button, ButtonToolbar, Placeholder,Uploader } from 'rsuite';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import {driversUploadDocument} from '../../services/drivers'
import {uploadFile} from '../../helpers/uploadDocument';

import { useFetchFiles } from '../../hooks/useFetchFiles';
import { useCountFiles } from '../../hooks/useCountFiles';
import { file } from 'jszip';

export const ImagesUpload = forwardRef(function ImagesUpload( 
  {info,handleCountFilesINE,handleCountFilesLic,handleCountFilesComprobante,handleCountFilesSAT,loader}, ref ) {

  const [files, setFiles] = useState([]);
  const {docs,isLoading} = useFetchFiles( info.title , info.driver );
  // const {counterFiles,counterReady} = useCountFiles( info.title,files );

  const [filesIdentificacion, setFilesIdentificacion] = useState([]);
  const [filesSAT, setFilesSAT] = useState([]);
  const [filesLicencia, setFilesLicencia] = useState([]);
  const [filesComprobante, setFilesComprobante] = useState([]);
  const [open, setOpen] = React.useState(false);

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


  const prepareToSave = () =>{
    console.log(files);
    if (info.title === 'Identificacion Oficial') {
      setFilesIdentificacion(files);
    }else if( info.title === 'Licencia Conducir' ){
      setFilesLicencia(files);
      console.log("cerrando " + filesLicencia);
    }else if( info.title === 'Comprobante Domicilio' ){
      setFilesComprobante(files)
    }else if( info.title === 'Constancia Situacion Fiscal' ){
      setFilesSAT(files)
    }

    files.forEach(function (elemento) {
      let obj = uploadFile ( elemento,info.driver,info.title );
    });

    setOpen(false);

  };

  const numberFiles = () =>{

    files.forEach(function (elemento) {
      count = count +1;
    });
    numINE = count;

    handleFiles( numINE,numSAT,numLicencia,numComprobante );

  }

  const numFiles = () =>{
    let count = 0, numINE=0, numSAT=0, numLicencia=0, numComprobante=0 ;

    filesIdentificacion.forEach(function (elemento) {
      console.log("here");
        count = count +1;
    });
    numINE = count;

    count=0;
    filesSAT.forEach(function (elemento) {
      count = count +1;
    });
    numSAT = count;

    count=0;
    filesLicencia.forEach(function (elemento) {
      count = count +1;
    });
    numLicencia = count;

    count=0;
    filesComprobante.forEach(function (elemento) {
      count = count +1;
    });
    numComprobante = count;

    handleFiles( numINE,numSAT,numLicencia,numComprobante );

  }


  

  useEffect(() => {

    if ( info.title !== '' ) {

      if (isLoading === false) {

        setFiles(docs);
        
        // numFiles();
        loader.current.handleClose();

      }else if(isLoading === true){

        setFiles([]);
        loader.current.handleShow('Cargando...');

      }

      // if ( counterReady ) {
      //   if ( info.title === 'Identificacion Oficial' ) {
      //     // handleFiles( counterFiles,0,0,0 );
      //   }else if( info.title === 'Licencia Conducir' ){
      //     // setFilesLicencia( counterFiles );
      //   }else if( info.title === 'Comprobante Domicilio' ){
      //     // setFilesComprobante( counterFiles );
      //   }else if( info.title === 'Constancia Situacion Fiscal' ){
      //     // setFilesSAT( counterFiles );
      //   }
      // }
      

    }

    if ( open === false ) {
      if ( info.title === 'Identificacion Oficial' ) {
        handleCountFilesINE( files.length );
      }else if( info.title === 'Licencia Conducir' ){
        handleCountFilesLic( files.length );
      }else if( info.title === 'Comprobante Domicilio' ){
        handleCountFilesComprobante( files.length );
      }else if( info.title === 'Constancia Situacion Fiscal' ){
        handleCountFilesSAT( files.length );
      }
    }
        
    
  },[isLoading,open]);




 

  return (
    <>
      {/* <form method="POST" encType="multipart/form-data" onSubmit={prepareToSave}> */}

        <Modal open={open} keyboard={false}>
          <Modal.Header closeButton={false}>
            <Modal.Title>Archivos - { info.title }</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Uploader 
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