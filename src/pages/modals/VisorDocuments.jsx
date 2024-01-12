import React, { useState,useEffect } from 'react'
import { Modal, Button,Divider } from 'rsuite';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import {fetchFileToVisualize} from '../../services/drivers'
import { uploadFile } from '../../helpers/uploadDocument';

import { Tree } from 'rsuite';
import FolderFillIcon from '@rsuite/icons/FolderFill';
import PageIcon from '@rsuite/icons/Page';

import { useFetchDocs } from '../../hooks/useFetchDocs';

export const VisorDocuments = forwardRef(
  function ImagesUpload( 
      {info,loader}, ref ) {

  const [open, setOpen] = React.useState(false);
  const {docs,isLoading} = useFetchDocs( info.title , info.driver, open );
  const [data, setData] = useState([]);

  const [value, setValue] = useState([]);
  
  useImperativeHandle(ref, () => {
    return {
      handleOpen,
    };
  }, []);  


  const handleClose = () => {
    setOpen(false);
    setValue([]);
    
  }

  const handleOpen = async (tipoDoc) => {
    setOpen(true);
  }
  

  useEffect(() => {

    if ( info.title !== '' ) {

      if (isLoading === false) {
        setData(docs);
        loader.current.handleClose();

      }else if(isLoading === true){

        loader.current.handleShow('Cargando...');

      }
    }
        
    
  },[isLoading]);


  useEffect(() => {
    if ( value.length !== 0 && info.title !== undefined && info.title !== '') {
      openFile(value);
      
    }

  },[value]);


  const openFile = async (archivo) =>{
    let response = await fetchFileToVisualize( archivo,info.title,info.driver  );
  }


  return (
    <>

        <Modal open={open} keyboard={false}>
          <Modal.Header closeButton={false}>
            <Modal.Title>Visor Archivos - { info.title }</Modal.Title>
          </Modal.Header>
          <Divider />
          <Modal.Body>

          <Tree
            data={data}
            showIndentLine
            defaultExpandAll={true}
            onChange={value => setValue(value)}
            //getChildren={{label: 'test',
            value= {value}
            renderTreeNode={node => {
              return (
                <>
                  {node.children ? <FolderFillIcon /> : <PageIcon />} {node.label}
                </>
              );
            }}
          />

          </Modal.Body>
          <Modal.Footer>

            <Button appearance="primary" size='xs' onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  );
});

export default VisorDocuments