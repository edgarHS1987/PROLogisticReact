import { useContext } from 'react';
import SystemContext from './context/SystemContext';
import { Col, Grid } from 'rsuite';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { isAuth } from './libs/functions';

import Layout from './components/Layout';

import Login from './pages/Login';
import Home from './pages/Home';

import DriversList from './pages/drivers/List';
import NewDriver from './pages/drivers/NewDriver';
import WorkingDays from './pages/reports/WorkingDays';

import PermissionsList from './pages/admin/permissions/List';
import RolesList from './pages/admin/roles/List';
import RolesForm from './pages/admin/roles/Form';

import ClientsList from './pages/clients/List';

import UsersList from './pages/admin/users/List';
import UsersForm from './pages/admin/users/Form';

import ZonesList from './pages/services/zones/List';
import StatesList from './pages/services/states/List';

import ServicesList from './pages/services/List';
import ServicesForm from './pages/services/Form';


//verifica si se ha iniciado sesion
const ProtectedRoute = ()=>{
	let auth = isAuth();

	if(!auth){
		return <Navigate to="login" replace />;
	}

	return <Outlet />;
}

const NotFound = ()=>{
	return(
		<Grid>
			<Col xs={24}>
				<h3>Pagina no encontrada</h3>
			</Col>
		</Grid>
	)
}

const AppRoutes = (props)=>{
	const {getPermission} = useContext(SystemContext);

	return (
		<Routes>
			<Route path={'/login'} exact element={<Login {...props} />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<Layout {...props} />}>
					<Route path={'/'} exact element={<Home {...props} />} />

					<Route path={'/drivers/list'} exact element={<DriversList {...props} />} />
					<Route path={'/drivers/new'} exact element={<NewDriver {...props} />} />
					<Route path={'/drivers/edit/:id'} exact element={<NewDriver {...props} />} />
					<Route path={'/reports/drivers/workingDays'} exact element={<WorkingDays {...props} />} />

					{/** PERMISOS */}
					{getPermission('admin_permissions') && (
						<Route path={'/admin/permissions/list'} exact element={<PermissionsList {...props} />} />
					)}
					
					{/** ROLES */}
					{getPermission('admin_roles') && (
						<Route path={'/admin/roles/list'} exact element={<RolesList {...props} />} />
					)}
					{getPermission('admin_roles_create') && (
						<Route path={'/admin/roles/new'} exact element={<RolesForm {...props} />} />
					)}
					{getPermission('admin_roles_update') && (
						<Route path={'/admin/roles/edit/:id'} exact element={<RolesForm {...props} />} />
					)}
					
					{/** USUARIOS */}
					{getPermission('admin_roles_update') && (
						<Route path={'/admin/users/list'} exact element={<UsersList {...props} />} />
					)}
					{getPermission('admin_roles_update') && (
						<Route path={'/admin/users/new'} exact element={<UsersForm {...props} />} />
					)}
					{getPermission('admin_roles_update') && (
						<Route path={'/admin/users/edit/:id'} exact element={<UsersForm {...props} />} />
					)}

					{/** CLIENTES */}
					<Route path={'/clients/list'} exact element={<ClientsList {...props} />} />

					{/** ZONAS */}
					<Route path={'/services/zones/list'} exact element={<ZonesList {...props} />} />

					{/** ESTADOS */}
					<Route path={'/services/states/list'} exact element={<StatesList {...props} />} />


					{/** SERVICIOS */}
					<Route path='/services/list' exact element={<ServicesList {...props} />} />
					<Route path='/services/new' exact element={<ServicesForm {...props} />} />

					<Route path={'/*'} element={<NotFound />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default AppRoutes;

