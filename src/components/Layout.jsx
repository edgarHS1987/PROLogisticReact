import {useState, useEffect, useContext} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import {Col, Grid, Drawer} from 'rsuite';

import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import MemberIcon from '@rsuite/icons/Member';
import DetailIcon from '@rsuite/icons/Detail';
import { FaMapLocationDot } from "react-icons/fa6";

import Sidebar from './Sidebar';
import Navbar from './Navbar';

import {decript} from '../libs/functions';
import SystemContext from '../context/SystemContext';
import { FaUser } from 'react-icons/fa';

const Layout = ({loader, reset})=>{
    const navigate = useNavigate();
	const userName = decript('user_name');
    const {getPermission} = useContext(SystemContext);

	const [showSidebar, setShowSidebar] = useState(true);
	const [expandMenu, setExpandMenu] = useState(false);
	const [sidebarMenu, setSidebarMenu] = useState([
		/**
		 * Estructura de menu 
		 * {title:string, submenu:array, show:boolean, active:boolean, url:string, icon:null | componentn icon}
		 *
		 * title: nombre de menu
		 * submenu: arreglo de submenus con misma estructura que menu
		 * show: bandera que muestra u oculta el menu en base a permiso
		 * active: si el menu esta activo o seleccionado
		 * url: ruta a la que dirige
		 * icon: icono de menu o submenu
		 *
		 * */
		{title:'Dashboard', submenu:[], show:true, open:false, active:true, url:'/', icon:<DashboardIcon />},        
        {title:'Clientes', submenu:[], show:true, open:false, active:true, url:'/clients/list', icon:<FaUser />},
        {title:'Servicios', show:true, active:false, open:false, icon:<FaMapLocationDot className='icon-menu' />, submenu:[
            {title:'Estados', show:true, active:false, url:'/services/states/list'},
			{title:'Zonas', show:true, active:false, url:'/services/zones/list'},
            {title:'Servicios', show:true, active:false, url:'/services/list'}
		]},		
        {title:'Drivers', submenu:[], show:true, open:false, active:true, url:'/drivers/list', icon:<MemberIcon />},
        {title:'Reportes', show:getPermission('admin_menu'), active:false, open:false, icon:<DetailIcon />, submenu:[
			{title:'Dias Activos Drivers', show:getPermission('admin_permissions'), active:false, url:'/reports/drivers/workingDays'},
            {title:'Servicios Asginados', show:getPermission('admin_permissions'), active:false, url:'/reports/services/assigned'},
            {title:'Estatus Servicios', show:getPermission('admin_permissions'), active:false, url:'/reports/services/status'},
            {title:'Usuarios', show:getPermission('admin_users'), active:false, url:'/admin/users/list'},
            {title:'Configuración', show:getPermission('admin_users'), active:false, url:'/admin/configuration/list'},
		]},
        {title:'Admin', show:getPermission('admin_menu'), active:false, open:false, icon:<GearCircleIcon />, submenu:[
			{title:'Permisos', show:getPermission('admin_permissions'), active:false, url:'/admin/permissions/list'},
            {title:'Roles', show:getPermission('admin_roles'), active:false, url:'/admin/roles/list'},
            {title:'Usuarios', show:getPermission('admin_users'), active:false, url:'/admin/users/list'}
		]},
	]);

	/**
	 * Actualiza el menu y verifica si debe de abrirse cuando conteiene submenu
	 * @param {bool | open} variable que viene del menu seleccionado
	 * @param {integer | i} posicion de elemento de menu
	 * 
	 * */
	 const onChangeMenu = (open, i)=>{
        let menus = sidebarMenu.map((m, index)=>{
            if(index === i){
                m.open = open
            }else{
                m.open = false;
            }

            return m;
        });

        setSidebarMenu(menus);

        updateMenu();
        
    }


    /**
     * Redirige a ruta del menu seleccionado
     * @param {string | url} direccion de la ruta
     * */
    const onSelectMenu = (url)=>{
        navigate(url);
    }

    /**
     * Muestra u oculta el menu dependiendo de la medidad de la pantalla
     * si la pantalla es menor de 800 pts se oculta el menu y solo se mostrara al presionar
     * el icono de  menu
     * */
    const resizeWindow = ()=>{        
        let width = window.innerWidth;
        if(width <= 980){
            setShowSidebar(false);
            setExpandMenu(false);
        }else{
            setShowSidebar(true);
            setExpandMenu(true);
        }
    }

    /**
     * Detecta cuando la pantalla cambia de tamaño
     * */
    window.addEventListener('resize', ()=>{
        resizeWindow();   
    });

    /**
     * Marca como activo el menu seleccionado
     * */
    const updateMenu = ()=>{
        let menus = sidebarMenu.map((m)=>{
            if(m.submenu.length === 0){
                if(m.url === location.pathname){
                    m.active = true;
                }else{
                    m.active = false;
                }
            }else{
                m.submenu.forEach((s)=>{
                    if(s.url === location.pathname){
                        
                        s.active = true;
                    }else{
                        s.active = false;
                    }
                });
            }
            

            return m;
        });

        setSidebarMenu(menus);
    }

    useEffect(()=>{
        
        resizeWindow();    
        updateMenu();

        // eslint-disable-next-line
    },[])

	return(
		<Grid fluid className="p-0 m-0">
			{showSidebar ? // muuestra menu lateral				
				<Col xsHidden smHidden mdHidden lg={expandMenu ? 3 : 1} className="border p-0 m-0">
					<Sidebar 
						expanded={expandMenu}
						menu={sidebarMenu}
						onChangeMenu={onChangeMenu}
						onSelectMenu={onSelectMenu}
					/>
				</Col>
			: 
				<Drawer placement="left" open={expandMenu} onClose={()=>setExpandMenu(false)} size={'xs'}>
					<Sidebar 
						expanded={true}
						menu={sidebarMenu}
						onChangeMenu={onChangeMenu}
						onSelectMenu={onSelectMenu}
					/>
				</Drawer>
			}

			<Col xs={24} lg={expandMenu ? 21 : 23} className="full-height p-0 m-0">
				 <Grid fluid className="border p-0 m-0">
                    <Navbar 
                    	user={userName} 
                    	expanded={expandMenu} 
                    	setExpanded={setExpandMenu} 
                    	loader={loader} 
                    	reset={reset} 
                    	showSidebar={showSidebar}
                    />
                </Grid>
				<Outlet />
			</Col>
		</Grid>
	);
}

export default Layout;