import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Message, Modal } from "rsuite";

import Toast from "../../components/Toast";

const ModalConfigureZones = forwardRef(({loader}, ref)=>{
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleShow = async ()=>{        
        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
    }

    
    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return(
        <Modal size="xs" open={open} onClose={message === '' ? handleClose : ()=>{}} backdrop={message === '' ? false : 'static'} keyboard={message === ''} >
            <Modal.Header>
                <Modal.Title>Configuración de zonas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid">
                  
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    {message === '' &&
                        <Button appearance="ghost" onClick={()=>handleClose()}>Cancelar</Button>
                    }
                    
                    <Button appearance="primary" onClick={()=>onUpdate()}>Actualizar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalConfigureZones;