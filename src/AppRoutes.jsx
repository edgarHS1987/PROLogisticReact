import { useContext } from 'react';
import SystemContext from './context/SystemContext';
import { Col, Grid } from 'rsuite';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { isAuth } from './libs/functions';

import Layout from './components/Layout';

import Login from './pages/Login';
import Home from './pages/Home';

import PermissionsList from './pages/admin/permissions/List';
import RolesList from './pages/admin/roles/List';
import RolesForm from './pages/admin/roles/Form';

import UsersList from './pages/admin/users/List';
import UsersForm from './pages/admin/users/Form';

import ZonesList from './pages/services/zones/List';
import StatesList from './pages/services/states/List';

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

					{/** ZONAS */}
					<Route path={'/services/zones/list'} exact element={<ZonesList {...props} />} />

					{/** ESTADOS */}
					<Route path={'/services/states/list'} exact element={<StatesList {...props} />} />



					<Route path={'/*'} element={<NotFound />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default AppRoutes;

