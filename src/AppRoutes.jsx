import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';

import Login from './pages/Login';
import Home from './pages/Home';

import PermissionsList from './pages/admin/permissions/List';
import RolesList from './pages/admin/roles/List';
import RolesForm from './pages/admin/roles/Form';

import { isAuth } from './libs/functions';

//verifica si se ha iniciado sesion
const ProtectedRoute = ()=>{
	let auth = isAuth();

	if(!auth){
		return <Navigate to="login" replace />;
	}

	return <Outlet />;
}

const AppRoutes = (props)=>{
	return (
		<Routes>
			<Route path={'/login'} exact element={<Login {...props} />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<Layout {...props} />}>
					<Route path={'/'} exact element={<Home {...props} />} />

					<Route path={'/admin/permissions/list'} exact element={<PermissionsList {...props} />} />

					<Route path={'/admin/roles/list'} exact element={<RolesList {...props} />} />
					<Route path={'/admin/roles/new'} exact element={<RolesForm {...props} />} />
					<Route path={'/admin/roles/edit/:id'} exact element={<RolesForm {...props} />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default AppRoutes;

