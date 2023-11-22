import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';

import Login from './pages/Login';
import Home from './pages/Home';

import PermissionsList from './pages/admin/permissions/PermissionsList';
import RolesList from './pages/admin/roles/RolesList';
import DriversList from './pages/drivers/DriversList';
import NewDriver from './pages/drivers/NewDriver';
import StepsForRegister from './pages/drivers/StepsForRegister';

import { isAuth } from './libs/functions';

//verifica si se ha iniciado sesion
const ProtectedRoute = ()=>{
	let auth = isAuth();

	if(!isAuth){
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

					<Route path={'/admin/permissions'} exact element={<PermissionsList {...props} />} />
					<Route path={'/admin/roles'} exact element={<RolesList {...props} />} />

					<Route path={'/drivers/ver'} exact element={<DriversList {...props} />} />
					<Route path={'/drivers/new'} exact element={<NewDriver {...props} />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default AppRoutes;

