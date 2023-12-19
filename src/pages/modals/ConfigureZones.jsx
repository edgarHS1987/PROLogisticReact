import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button, Col, Grid, Message, Modal } from "rsuite";

import Toast from "../../components/Toast";
import Input from "../../components/Input";
import { isValidForm, showCtrlError, swalAction } from "../../libs/functions";
import { clientsList } from "../../services/clients";
import Select from "../../components/Select";
import { zonesConfiguring, zonesVerify } from "../../services/zones";

const ModalConfigureZones = forwardRef(({loader, getData}, ref)=>{
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({
        clients_id:'',
        numberZones:''
    });
    const [clients, setClients] = useState([]);

    const handleShow = async ()=>{
        let response = await clientsList();
        if(response){
            await setClients(response);
        }
        await setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
        setData({clients_id:'', numberZones:''});        
    }

    const handleChange = (e)=>{
        let name = e.target.name;
        let value = e.target.value;
        
        setData({
            ...data,
            [name]:value
        });

        if(value !== ''){
            //showCtrlError(name);
        }
    }

    const onSubmit = async ()=>{      
        loader.current.handleShow('Verificando...');
        if(isValidForm('div.form-configure')){
            let obj = data;

            let response = await zonesVerify(obj.clients_id);
            if(response){
                if(response.error){
                    loader.current.handleClose();

                    swalAction({
                        title:'Alerta',
                        text: response.error,
                        icon:'warning',
                        textConfirm:'Si, Configurar',
                        fn:onConfigure,
                        values:obj
                    })
                }else{
                    onConfigure(obj);
                }
            }
        }else{
            Toast.fire('Error', 'Campos incompletos', 'error');
        }
        loader.current.handleClose();
    }

    const onConfigure = async (obj)=>{
        loader.current.handleShow('Generando...');

        let response = await zonesConfiguring(obj);
        if(response){
            if(response.error){
                loader.current.handleClose();
                Toast.fire('Error', 'Hubo un error al intentar configurar las zonas', 'error');                
            }else{
                Toast.fire('Correcto', response.message, 'success');
                handleClose();
                getData();
            }
        }

        loader.current.handleClose();

    }
    
    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal size="xs" open={open} onClose={handleClose} backdrop={false}>
            <Modal.Header>
                <Modal.Title>Configuración de zonas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid">
                    <Grid fluid className="form-configure">
                        <Col xs={24}>
                            <label>Cliente</label>
                            <Select
                                id={"clients_id"}
                                value={data.clients_id}
                                options={clients}
                                handleChange={(e)=>handleChange(e)}
                                required
                            />
                        </Col>
                        <Col xs={24}>
                            <label>Número de zonas</label>
                            <Input 
                                id="numberZones"
                                type="number"
                                value={data.numberZones}
                                handleChange={(e)=>handleChange(e)}
                                required
                            />
                        </Col>
                    </Grid>  
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Button appearance="ghost" onClick={()=>handleClose()}>Cancelar</Button>
                    <Button appearance="primary" onClick={()=>onSubmit()}>Configurar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalConfigureZones;