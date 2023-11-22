import React, {useContext, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Grid, Divider, Button } from 'rsuite';
import Title from '../../../components/Title';
import Toast from '../../../components/Toast';
import { isValidForm, showCtrlError } from '../../../libs/functions';
import { usersId, usersSave, usersUpdate } from '../../../services/user';
import { roles } from '../../../services/roles';

const UsersForm = ({loader})=>{
    const navigate = useNavigate();
    const {id} = useParams();

    const [user, setUser] = useState({
        names:'',
        lastname1:'',
        lastname2:'',
        role:'',
        email:'',
        password:''
    });
    const [confirmPassword, setConfirm] = useState('');
    const [rolesList, setRoles] = useState([]);

    const handleChange = (e)=>{
        let name = e.target.name;
        let value = e.target.value;

        let form = user;
        form = {
            ...form,
            [name]: value
        };

        setUser(form);

        if(value !== ''){
            showCtrlError(name);
        }
    }

    const onSubmit = async ()=>{
        let response;

        if(isValidForm('form')){            
            await loader.current.handleShow('Guardando...');

            if(id){                
                response = await usersUpdate(id, user);
            }else{
                response = await usersSave(user);            
            }           
            
            if(response){
                if(response.error){
                    if(response.error.indexOf('Duplicate entry') !== -1){
                        Toast.fire({icon:'error', title:'Error', text:'El nombre que intenta guardar ya se encuentra registrado, intente con un nombre diferente', timer:4500})
                    }
                }else{
                    Toast.fire({icon:'success', title:'Correcto', text:response.message});
                    navigate('/admin/users/list');
                }                
            }

                await loader.current.handleClose();
            
        }else{           

            Toast.fire({icon:'error', title:'Error', text:'Campos incompletos'});
        }
        
    }

    const getData = async (id)=>{
        await loader.current.handleShow('Cargando...');
        
        let response = await roles();
        if(response){
            setRoles(response);
        }

        if(id){
            response = await usersId(id);
            if(response){
                setUser(response);
            }            
        }

        await loader.current.handleClose();
    }

    useEffect(()=>{        
        getData(id);
        
    // eslint-disable-next-line
    },[]);

    return(
        <Grid fluid className='content'>
            <Grid fluid>
                <Col xs={24} className="mb-2">
                    <Title screen="Usuarios" action={id ? 'Edición' : "Registro"} />
                </Col>
            </Grid>            
            <Divider style={{marginTop:0}} />
            <Grid fluid>                
                <Col xs={24}>
                    <div className='p-4 shadow rounded form-content'>
                        <div className='p-2 border row justify-content-center'>
                            <div className='p-2 col-12 col-sm-10 col-md-12 col-lg-10'>
                                <form>
                                    <div className='row'>
                                        <div className='pb-2 col-12 col-sm-12 col-md-6 col-lg-4'>
                                            <span>Nombres</span>
                                            <input className='form-control form-control-sm' name="names" id="names" value={user.names} onChange={(e)=>handleChange(e)} required />
                                        </div>
                                        <div className='pb-2 col-12 col-sm-12 col-md-6 col-lg-4'>
                                            <span>Apellido paterno</span>
                                            <input className='form-control form-control-sm' name="lastname1" id="lastname1" value={user.lastname1} onChange={(e)=>handleChange(e)} required />
                                        </div>
                                        <div className='pb-2 col-12 col-sm-12 col-md-6 col-lg-4'>
                                            <span>Apellido materno</span>
                                            <input className='form-control form-control-sm' name="lastname2" id="lastname2" value={user.lastname2 || ""} onChange={(e)=>handleChange(e)} />
                                        </div>
                                        <Divider />
                                        
                                        <div className='pb-2 col-12 col-sm-12 col-md-6 col-lg-4'>
                                            <span>Rol</span>
                                            <select className='form-control form-control-sm' name="role" id="role" value={user.role} onChange={(e)=>handleChange(e)} required>
                                                <option value="">Seleccione</option>
                                                {rolesList.map((r, i)=>
                                                    <option key={i} value={r.name}>{r.display_name}</option>
                                                )}
                                            </select>
                                        </div>
                                        
                                       
                                        <div className='pb-2 col-12 col-sm-12 col-md-6 col-lg-4'>
                                            <span>Email</span>
                                            <input type="email" className='form-control form-control-sm' name="email" id="email" value={user.email} onChange={(e)=>handleChange(e)} required disabled={id !== undefined} />
                                        </div>
                                        {id === undefined &&
                                            <>
                                                <div className='pb-2 col-12 col-sm-12 col-md-6 col-lg-4'>
                                                    <span>Contraseña</span>
                                                    <input type="password" className='form-control form-control-sm' name="password" id="password" value={user.password} onChange={(e)=>handleChange(e)} required />
                                                </div>
                                                <div className='pb-2 col-12 col-sm-12 col-md-6 col-lg-4'>
                                                    <span>Confirmar contraseña</span>
                                                    <input type="password" className='form-control form-control-sm' name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={(e)=>setConfirm(e.target.value)} />
                                                </div>    
                                            </>
                                        }
                                        
                                    </div>
                                    
                                    
                                    <div className='pt-2 col-12 text-center'>
                                        <Button appearance='ghost' className='me-3' onClick={()=>navigate('/admin/users/list')}>Cancelar</Button>
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

export default UsersForm;