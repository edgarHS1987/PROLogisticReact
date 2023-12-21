import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "rsuite";
import { permissionsAssigned, permissionsToAssign, permissionsToDesign } from "../../services/permissions";


const ModalPermissions = forwardRef(({loader}, ref)=>{
    const [open, setOpen] = useState(false);
    const [assigned, setAssigned] = useState([]);
    const [availables, setAvailable] = useState([]);
    const [rol_id, setRolId] = useState('');

    const handleShow = async (id)=>{
        await loader.current.handleShow('Cargando');
        let response = await permissionsAssigned(id);
        if(response){
            setAvailable(response.availables);
            setAssigned(response.assigned);
            setRolId(id);
        }
        
        setOpen(true);

        await loader.current.handleClose();
       
    }

    const handleClose = ()=>{
        setOpen(false);
        setAssigned([]);
        setAvailable([]);
    }

    const assignPermissions = (id, index)=>{
        let auxAssigned = assigned;
        let auxAvailables = []
        availables.forEach(async (a, i)=>{
            if(i === index){
                auxAssigned.push(a);     
                await permissionsToAssign({rol_id: rol_id, permission_name: a.name});                
            }else{
                auxAvailables.push(a);
            }            
        });
        setAssigned(auxAssigned);
        setAvailable(auxAvailables);        
    }

    const designPermissions = (id, index)=>{
        let auxAssigned = [];
        let auxAvailables = availables
        assigned.forEach(async (a, i)=>{
            if(i === index){
                auxAvailables.push(a);  
                await permissionsToDesign({rol_id:rol_id, permission_name: a.name});              
            }else{
                auxAssigned.push(a);
            }            
        });

        setAssigned(auxAssigned);
        setAvailable(auxAvailables);        
    }

    useImperativeHandle(ref, ()=>({
        handleShow
    }));


    return(
        <Modal open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Asignar/Quitar Permisos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container-fluid">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6 text-center">
                                <label style={{fontWeight:'bold'}}>Permisos no asignados</label>
                                <div className="container-fluid text-start">
                                    <ul className="permissions-container">
                                        {availables.map((a, i)=>
                                            <li key={i} onClick={()=>assignPermissions(a.id, i)} >{a.display_name}</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-6 text-center">
                                <label style={{fontWeight:'bold'}}>Permisos asignados</label>
                                <div className="container-fluid text-start">
                                    <ul className="permissions-container">
                                        {assigned.map((a, i)=>
                                            <li key={i} onClick={()=>designPermissions(a.id, i)} >{a.display_name}</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
})

export default ModalPermissions;