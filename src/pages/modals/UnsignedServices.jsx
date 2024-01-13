import { forwardRef, useImperativeHandle, useState } from "react";
import { Col, Grid, Modal } from "rsuite";
import Button from "../../components/Button";
import { CiCircleInfo } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { swalAction } from "../../libs/functions";

const ModalUnsignedService = forwardRef((props, ref)=>{
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [total, setTotal] = useState(0);

    const handleShow = (number)=>{        
        setTotal(number);
        setOpen(true);
    }

    const verifyDrivers = ()=>{
        
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));

    return (
        <Modal size="xs" open={open} onClose={()=>setOpen(false)}>
            <Modal.Title></Modal.Title>
            <Modal.Body>
                <Grid fluid>
                    <Col xs={24} className="flex justify-content-center">
                        <Col xs={24} md={18} className="text-center p-3">
                            <CiCircleInfo size={80} style={{color:'var(--bs-warning)'}}/>
                        </Col>
                    </Col>

                    <Col xs={24} className="text-center">
                        <h4>Alerta</h4>    
                        <label>
                            {'Existen ('+total+') servicios sin asignar, seleccione una de las opciones para continuar'}
                        </label>
                    </Col>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <Grid fluid>
                    <Col xs={24} className="flex justify-content-center gap-2">
                        <Col xs={24}>
                            <Col xs={12}>
                                <Button 
                                    title="Asignar"
                                    appearance="ghost"
                                    action={()=>verifyDrivers()}
                                    classes="full-width"
                                />
                            </Col>
                            <Col xs={12}>
                                <Button 
                                    title="Seguir registrando"
                                    appearance="ghost"
                                    action={()=>navigate('/services/new')}
                                    classes="full-width"
                                />
                            </Col>
                        </Col>
                    </Col>
                </Grid>
            </Modal.Footer>
        </Modal>
    )
});

export default ModalUnsignedService;