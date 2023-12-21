import React, { useState,useEffect } from 'react'
import { Modal, Button, ButtonToolbar, Placeholder,Uploader } from 'rsuite';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import {driversUploadDocument} from '../../services/drivers'
import {uploadFile,getListDocuments} from '../../helpers/uploadDocument';

export const ImagesUpload = forwardRef(function ImagesUpload({info,handleFiles}, ref) {

  const [files, setFiles] = useState([]);
  console.log("rendizando");
  console.log(files);  

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

  const handleOpen = (tipoDoc) => {
    docsInitial( tipoDoc );
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

  const numFiles = () =>{
    let count = 0, numINE=0, numSAT=0, numLicencia=0, numComprobante=0 ;

    filesIdentificacion.forEach(function (elemento) {
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


  function docsInitial( tipoDoc ){

    let listaDeDocumentos= [];
    async function docsGetAll( tipoPar,idDriverPar ) {
      let listDocs = await getListDocuments( tipoPar,idDriverPar  );

      listaDeDocumentos = listDocs.docsDriver;
      if ( tipoPar === 'Identificacion Oficial' ) {
        // docsGetAll( tipoDoc,info.driver );
        console.log(listaDeDocumentos);
        setFilesIdentificacion( listaDeDocumentos );
      }
      // setFilesIdentificacion( listaDeDocumentos );
      // setFiles( listaDeDocumentos );
      console.log("recuperando datos");
    };

    docsGetAll( tipoDoc,info.driver );
    if ( tipoDoc === 'Identificacion Oficial' ) {
      // docsGetAll( tipoDoc,info.driver );
      // setFilesIdentificacion( listaDeDocumentos );
    }else if( tipoDoc === 'Licencia Conducir' ){
      docsGetAll( tipoDoc,info.driver );
      // setFiles(filesLicencia);
    }else if( tipoDoc === 'Comprobante Domicilio' ){
      docsGetAll( tipoDoc,info.driver ) ;
      // setFiles(filesComprobante)
    }else if( tipoDoc === 'Constancia Situacion Fiscal' ){
      docsGetAll( tipoDoc,info.driver );
      // setFiles(filesSAT)
    }
    
  }

  useEffect(() => {

    if ( open === true ) {
      console.log(info.title);
      setFiles( filesIdentificacion );
      console.log(files);
      numFiles();  
    }
    
    
  },[open]);

  


 

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