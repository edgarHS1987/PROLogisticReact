import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Col, Grid, Message, Modal, Uploader } from "rsuite";

import Toast from "../../components/Toast";
import { statesStore, statesVerify } from "../../services/states";

const ModalStates = forwardRef(({loader, getData}, ref)=>{
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);

    const handleShow = async ()=>{        
        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
        setMessage('');
        setFiles([]);
    }

    const onUploadFile = ()=>{
        let file = files[0].blobFile;

        if(file){
            const reader = new FileReader();
            //reader.readAsText(file, 'UTF-8');
            reader.readAsText(file, 'ISO-8859-1');
            reader.onload = async (e)=>{
                const content = e.target.result;                
                const lines = content.split('\n');

                let states = [];
                lines.forEach((line, i)=>{
                    if(i > 0){                        
                        let data = line.split('|');

                        if(data[0] !== ''){
                            if(data[4] === 'San Luis Potosí'){
                                let indexState = states.findIndex(obj => obj.name === data[4]);

                                if(indexState === -1){
                                    states.push({
                                        name: data[4],
                                        municipalities:[{
                                            name: data[3],
                                            zip_codes:[{
                                                zip_code: data[0],
                                                colonies:[{name:data[1], type:data[2]}]
                                            }]
                                        }]
                                    });
                                }else{
                                    let indexMunicipality = states[indexState].municipalities.findIndex(obj => obj.name === data[3]);
                                    if(indexMunicipality === -1){
                                        states[indexState].municipalities.push({
                                            name: data[3],
                                            zip_codes:[{
                                                zip_code: data[0],
                                                colonies:[{name:data[1], type:data[2]}]
                                            }]
                                        });
                                    }else{
                                        let indexZipCode = states[indexState].municipalities[indexMunicipality].zip_codes.findIndex(obj => obj.zip_code === data[0]);
                                        if(indexZipCode === -1){
                                            states[indexState].municipalities[indexMunicipality].zip_codes.push({
                                                zip_code: data[0], 
                                                colonies:[{name:data[1], type:data[2]}]
                                            })
                                        }else{
                                            states[indexState].municipalities[indexMunicipality].zip_codes[indexZipCode].colonies.push({
                                                name:data[1], 
                                                type:data[2]
                                            })
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                });
                
                let registered = await verifyStatesRegistered(states);
                if(!registered){
                    onSaveData(states);
                }
                
            };
        }
        
    }
    /**
     * Verifica registro de estados
     */
    const verifyStatesRegistered = async (data)=>{
        let registered = true;
        let dataStates = data.map((d)=>{
            let item = {
                name: d.name
            };

            return item;
        });

        let response = await statesVerify(dataStates);
        if(response){
            if(response.error){
                setMessage(response.error);
            }else{
                registered = false;
            }
        }

        return registered;
    }

    /**
     * Guarda los estados en la base de datos
     * @param {*} data 
     */
    const onSaveData = async (data)=>{
        await loader.current.handleShow('Cargando datos...');

        let totalData = data.length;
        let registeredData = 0;
        let errroRegister = '';
        data.forEach(async (obj)=>{
            let response = await statesStore(obj);
            if(response){
                if(response.error){
                    console.log('error')
                    errroRegister = response.error;
                }else{
                    registeredData++;
                }
            }
        })
        console.log(errroRegister, totalData, registeredData)
        if(totalData === registeredData){
            Toast.fire('Correcto', 'Los estados se registraron correctamente', 'success');
            handleClose();
        }

        if(errroRegister !== ''){
            Toast.fire('Error', 'Ocurrio un error al cargar los datos', 'error');
        }
        

        await loader.current.handleClose();
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    

    return(
        <Modal size="sm" open={open} onClose={message === '' ? handleClose : ()=>{}} backdrop={message === '' ? false : 'static'} keyboard={message === ''} >
            <Modal.Header>
                <Modal.Title>Registrar datos de estado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid">
                    <Grid fluid>
                        <Col xs={24}>
                            <Uploader 
                                action=""
                                fileList={files} 
                                multiple={false}
                                autoUpload={false} 
                                onChange={setFiles} 
                                className="uploader"
                            />
                        </Col>
                    </Grid>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    {message === '' &&
                        <Button appearance="ghost" onClick={()=>handleClose()}>Cancelar</Button>
                    }
                    
                    <Button appearance="primary" onClick={()=>onUploadFile()}>Cargar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalStates;