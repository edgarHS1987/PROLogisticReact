import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Message, Modal } from "rsuite";
import { usersResetPassword } from "../../services/user";
import Toast from "../../components/Toast";

const ModalResetPassword = forwardRef(({loader}, ref)=>{
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');

    const handleShow = async (id, message = '')=>{        
        setOpen(true);
        setUserId(id);

        if(message !== ''){
            setMessage(message);
        }
    }

    const handleClose = ()=>{
        setOpen(false);
        setPassword('');
        setConfirm('');
        setError('');
        setUserId('');
    }

    
    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    const onUpdate = async ()=>{
        let error = '';
        if(password === '' || confirm === ''){
            error = 'Campos incompletos';

            if(password === ''){
                document.getElementById('password').classList.add('error');
            }else{
                document.getElementById('password').classList.remove('error');
            }

            if(confirm === ''){
                document.getElementById('confirm').classList.add('error');
            }else{
                document.getElementById('confirm').classList.remove('error');
            }
        } 

        if(password !== confirm) {
            error = 'Las contraseñas no counciden'
        }

        if(error === ''){
            let obj = {
                userId: userId,
                password: password
            };
            let response = await usersResetPassword(obj);
            if(response){
                //sessionStorage.removeItem('reset');
                handleClose();
                Toast.fire({icon:'success', title:'Correcto', text:'Se actualizo correctamente la contraseña'});
            }
        }else{
            setError(error);
        }
    }


    return(
        <Modal size="xs" open={open} onClose={message === '' ? handleClose : ()=>{}} backdrop={message === '' ? false : 'static'} keyboard={message === ''} >
            <Modal.Header>
                <Modal.Title>Restablecer contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid">
                    {error !== "" &&
                        <div className="col-12">
                            <Message type="error">{error}</Message>
                        </div>
                    }

                    {message !== '' &&
                        <div className="col-12">
                            <Message type="info">{message}</Message>
                        </div>
                    }
                    
                    <div className="col-12">
                        <div className="pb-2 col-12">
                            <span>Contraseña</span>
                            <input type="password" className="form-control form-control-sm" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                        </div> 
                        <div className="pb-2 col-12">
                            <span>Confirmar Contraseña</span>
                            <input type="password" className="form-control form-control-sm" id="confirm" value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
                        </div> 
                    </div>
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

export default ModalResetPassword;