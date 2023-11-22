import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Navbar as NavContainer } from "rsuite";

import { FiMenu } from "react-icons/fi";
import { FaRegWindowClose } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";

import { logout } from "../services/auth";
import { decript } from "../libs/functions";

//const user = require('../assets/images/user-default.jpeg');

const Navbar = ({expanded, setExpanded, user, loader, reset, showSidebar})=>{
    const userName = user;
    const navigate = useNavigate();

    /**
     * Obtiene la hora actual
     * */
	const getTime = ()=>{		
		var hoy = new Date();
		var hora = 	(hoy.getHours() < 10 ? '0'+hoy.getHours() : hoy.getHours()) + ':' + 
					(hoy.getMinutes() < 10 ? '0'+hoy.getMinutes() : hoy.getMinutes()) + ':' + 
					(hoy.getSeconds() < 10 ? '0'+hoy.getSeconds() : hoy.getSeconds());
		
        setTime(hora);

        setTimeout(()=>{
            getTime();
        }, 1000);
	}
	
	const [time, setTime] = useState('');

    /**
     * Cierra la sesion y redirige a inicio de sesion
     * */
    const signout = async ()=>{
		let res = await logout();

		if(res !== undefined){
			sessionStorage.clear();
			
			navigate('/login');
		}
	}

    /**
     * Carga ventana emergente para el cambio de contraseña
     * */
    const onReset = ()=>{
        let id = decript('user_id');
        reset.current.handleShow(id);        
    }

	useEffect(()=>{
       getTime();  
	}, []);

    return(
        <NavContainer appearance="subtle">
            <Nav>
                <Nav.Item onClick={()=>setExpanded(!expanded)} className="p-0">                    
                    <FiMenu />                    
                </Nav.Item>
                
            </Nav>
            <Nav pullRight>
                <Nav.Item>
                    {time}
                </Nav.Item>
                <Nav.Menu title={showSidebar ? userName : ''} 
                    icon={<FaRegUser />} 
                    placement="bottomEnd"
                >
                    {!showSidebar && (
                        <Nav.Item>{userName}</Nav.Item>
                    )}
                    
                    <Nav.Item onClick={()=>onReset()}>Cambiar contraseña</Nav.Item>
                    <Nav.Item onClick={()=>signout()}>Salir</Nav.Item>
                </Nav.Menu>
            </Nav>
        </NavContainer>
    )
}

export default Navbar;