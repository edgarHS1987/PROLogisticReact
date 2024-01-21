import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Col, Divider, IconButton, Modal } from "rsuite";
import Toast from "../../components/Toast";
import ServicesTable from "../services/ServicesTable";

const ModalServices = forwardRef(({
    loader,
    tableConfig,
    tableList,
    tableRef,
    onAssignService
}, ref)=>{
    const [open, setOpen] = useState(false);
    const handleShow = async ()=>{        
        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
    }

    useImperativeHandle(ref, ()=>({
        handleShow,
        handleClose
    }));

    return(
        <Modal size="xs" open={open} onClose={handleClose} backdrop={false}>
            <Modal.Header>
                <Modal.Title>Servicios</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid" style={{overflowY:'scroll', maxHeight:window.innerHeight - 400}}>
                    {tableList.map((list, i)=>
                        <Col key={i} xs={24} className="p-2 mb-2 shadow rounded" style={{fontSize:'0.65em'}}>
                            {Object.keys(list).map((l, j)=>
                                j > 0 ?
                                    tableConfig.columns[j - 1].show &&
                                        <div key={j}>
                                            <Col xs={j < 3 || j > 4 ? 12 : 24}>
                                                <div>
                                                    <label><b>{tableConfig.columns[j - 1].label}</b></label>
                                                </div>
                                                <div>
                                                    <span>{list[l]}</span>
                                                </div>
                                            </Col>
                                            {tableConfig.columns[j].label === '' && (
                                                <Col xs={12} className="flex justify-content-end">
                                                    {tableConfig.columns[j].selector(list)}
                                                </Col>
                                            )}
                                        </div>
                                : null
                            )}
                            
                        </Col>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="text-center">
                    <Col xs={12}>
                        <Button className="full-width" appearance="ghost" onClick={()=>handleClose()}>Cerrar</Button>
                    </Col>
                    <Col xs={12}>
                        <Button className="full-width" appearance="primary" onClick={()=>onAssignService()}>Asignar</Button>
                    </Col>
                </div>
            </Modal.Footer>
        </Modal>
    )
})

export default ModalServices;