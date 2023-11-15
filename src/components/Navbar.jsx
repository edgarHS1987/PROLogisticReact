import React, { useEffect, useState } from "react";
import { Nav, Navbar as NavContainer } from "rsuite";
//import {chevronLeft} from 'react-icons-kit/fa/chevronLeft'
//import Icon from "react-icons-kit";
//import {chevronRight} from 'react-icons-kit/fa/chevronRight';
//import {userO} from 'react-icons-kit/fa/userO'
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { decript } from "../libs/functions";

//const user = require('../assets/images/user-default.jpeg');

const Navbar = ({expanded, setExpanded, user, loader, reset})=>{
    const userName = user;
    const navigate = useNavigate();

	const getTime = ()=>{		
		var hoy = new Date();
		var hora = 	(hoy.getHours() < 10 ? '0'+hoy.getHours() : hoy.getHours()) + ':' + 
					(hoy.getMinutes() < 10 ? '0'+hoy.getMinutes() : hoy.getMinutes()) + ':' + 
					(hoy.getSeconds() < 10 ? '0'+hoy.getSeconds() : hoy.getSeconds());
		return hora;
	}

	var timer = getTime();
	const [time, setTime] = useState(timer);

    const signout = async ()=>{
		let res = await logout();

		if(res !== undefined){
			sessionStorage.clear();
			
			navigate('/login');
		}
	}

    const onReset = ()=>{
        let id = decript('user_id');
        reset.current.handleShow(id);        
    }

	useEffect(()=>{
		setInterval(async ()=>{
			var timer = getTime();
			setTime(timer);
		}, 1000);        
	}, []);

    return(
        <NavContainer appearance="subtle">
            <Nav>
                <Nav.Item onClick={()=>setExpanded(!expanded)} className="p-0">
                    {/*expanded ? 
                        <Icon icon={chevronLeft} />
                    : 
                        <Icon icon={chevronRight} />
                    */}
                </Nav.Item>
                
            </Nav>
            <Nav pullRight>
                <Nav.Item>
                    {time}
                </Nav.Item>
                <Nav.Menu title={userName} 
                    //icon={<Icon icon={userO} />} 
                    placement="bottomEnd"
                >
                    <Nav.Item onClick={()=>onReset()}>Cambiar contraseña</Nav.Item>
                    <Nav.Item onClick={()=>signout()}>Salir</Nav.Item>
                </Nav.Menu>
            </Nav>
        </NavContainer>
    )
}

export default Navbar;