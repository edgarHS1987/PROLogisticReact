import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FlexboxGrid, Grid, Col, Panel, Button } from "rsuite";

import { encript } from "../libs/functions";
import { login } from "../services/auth";
import Toast from "../components/Toast";



const Login = ({loader})=>{
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const onEnter = async ()=>{
        let error = '';
        if(user === '' || password === ''){
            error = 'Usuario y/o contraseña incorrecto';
        }

        if(error === ''){
            let obj = {
                email:user,
                password:password
            };

            await loader.current.handleShow('Iniciando...');

            let response = await login(obj);
            if(response){
                encript('token', response.access_token);
                encript('user_name', response.user.name);
                encript('user_id', response.user.id.toString());
                //encript('permissions', JSON.stringify(response.permissions));
                //sessionStorage.setItem('reset', response.user.reset);

                navigate('/');
                
            }else{
                Toast.fire({icon:'error', title:'Error', text:'Contraseña y/o usuario incorrecto'});
            }

            await loader.current.handleClose();
        }else{
            Toast.fire({icon:'error', title:'Error', text:error});
        }
    }

    return(
        <Grid fluid>
            <FlexboxGrid justify="center" align="middle"  className="full-height">                
                <Col xs={22} md={16} lg={12}>
                    <Panel shaded>
                        <Grid fluid>
                            <Col xs={24} className="text-center">
                                <h1 className="login-title"></h1>
                            </Col>
                        </Grid>
                        <Grid fluid>
                            <Col xs={24} mdOffset={3} md={18} lgOffset={5} lg={14} >
                                <div>
                                    <span>Usuario</span>
                                    <input className="form-control form-control-sm border-rounded" value={user} onChange={(e)=>setUser(e.target.value)} />
                                </div>
                                <div>
                                    <span>Contraseña</span>
                                    <input type="password" className="form-control form-control-sm border-rounded" value={password} onKeyUp={(e)=>e.code === 'Enter' && onEnter()} 
                                        onChange={(e)=>setPassword(e.target.value)} />
                                </div>
                            </Col>
                        </Grid>
                        <Grid fluid className="mt-3">
                            <Col xs={24} md={9} mdOffset={12} lg={7} lgOffset={12}>
                                <Button appearance="primary" className="full-width" onClick={()=>onEnter()}>Accesar</Button>
                            </Col>
                        </Grid>
                    </Panel>
                </Col>
            </FlexboxGrid>            
        </Grid>
    )
};

export default Login;