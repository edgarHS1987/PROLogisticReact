import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Grid, Divider, Button } from 'rsuite';

import Title from '../../../components/Title';
import Toast from '../../../components/Toast';
import { rolesId, rolesSave, rolesUpdate } from '../../../services/roles';
import { isValidForm, showCtrlError } from '../../../libs/functions';

const RolesForm = ({loader})=>{
    const navigate = useNavigate();
    const {id} = useParams();

    const [rol, setRole] = useState({
        name:'',
        description:''
    });

    const handleChange = (e)=>{
        let name = e.target.name;
        let value = e.target.value;

        let form = rol;
        form = {
            ...form,
            [name]: value
        };

        setRole(form);

        if(value !== ''){
            showCtrlError(name);
        }
    }

    const onSubmit = async ()=>{
        let response;

        if(isValidForm('form')){
            let obj = {
                name: rol.name.replace(/ /g, '_').toLowerCase(),
                display_name: rol.name,
                description: rol.description
            }
            if(id){                
                response = await rolesUpdate(id, obj);
            }else{
                response = await rolesSave(obj);
            }

            
            if(response){
                if(response.error){
                    if(response.error.indexOf('Duplicate entry') !== -1){
                        Toast.fire({icon:'error', title:'Error', text:'El nombre que intenta guardar ya se encuentra registrado, intente con un nombre diferente', timer:4500})
                    }
                }else{
                    Toast.fire({icon:'success', title:'Correcto', text:response.mensaje});
                    navigate('/admin/roles/list');
                }
                
            }
        }else{
            Toast.fire({icon:'error', title:'Error', text:'Campos incompletos'});
        }
        
    }

    const getData = async (id)=>{
        await loader.current.handleShow('Cargando...');
        let response = await rolesId(id);
        if(response){
            setRole(response);
        }

        await loader.current.handleClose();
    }

    useEffect(()=>{
        if(id){
            getData(id);
        }
    // eslint-disable-next-line
    },[]);

    return(
        <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Roles" action={id ? "Edición" : "Registro"} />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>                
                <Col xs={24}>
                    <div className='p-4 shadow rounded form-content'>
                        <div className='p-2 border row justify-content-center'>
                            <div className='p-2 col-12 col-sm-10 col-md-8 col-lg-4'>
                                <form>
                                    <div className='pb-2 col-12'>
                                        <span>Nombre</span>
                                        <input className='form-control form-control-sm' name="name" id="name" value={rol.name} onChange={(e)=>handleChange(e)} required />
                                    </div>
                                    <div className='pb-2 col-12'>
                                        <span>Descripción</span>
                                        <input className='form-control form-control-sm' name="description" id="description" value={rol.description} onChange={(e)=>handleChange(e)} required />
                                    </div>
                                    <div className='pt-2 col-12 text-center'>
                                        
                                        <Button appearance='ghost' className='me-3' onClick={()=>navigate('/admin/roles/list')}>Cancelar</Button>
                                        <Button appearance='primary' onClick={()=>onSubmit()}>Guardar</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>                    
                </Col>
            </Grid>            
        </Grid>
    )
}

export default RolesForm;