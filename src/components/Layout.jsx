import {useState} from 'react';
import { Outlet } from 'react-router-dom';

import {Col, Grid, Drawer} from 'rsuite';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

import {decript} from '../libs/functions';

const Layout = ({loader, reset})=>{
	const userName = decript('user_name');

	const [showSidebar, setShowSidebar] = useState(true);
	const [expandMenu, setExpandMenu] = useState(true);
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
		{title:'Dashboard', submenu:[], show:true, active:true, url:'/', icon:''}
	]);

	return(
		<Grid fluid className="p-0 m-0">
			{showSidebar ? // muuestra menu lateral				
				<Col xsHidden smHidden mdHidden lg={expandMenu ? 4 : 1} className="border p-0 m-0" style={{border:'1px solid'}}>
					<Sidebar 
						expanded={expandMenu}
						menu={sidebarMenu}
						onChangeMenu={()=>{}}
						onSelectMenu={()=>{}}
					/>
				</Col>
			: null}

			<Col xs={24} lg={expandMenu ? 20 : 23} className="full-height p-0 m-0" style={{border:'1px solid'}}>
				 <Grid fluid className="border p-0 m-0">
                    <Navbar user={userName} expanded={expandMenu} setExpanded={setExpandMenu} loader={loader} reset={reset} />
                </Grid>
				<Outlet />
			</Col>
		</Grid>
	);
}

export default Layout;