import { decodeToken } from 'react-jwt';
import { Navigate } from 'react-router-dom';
import type { RoleEnum } from '../shared/roles';


interface PrivateRoutesProps {
	children: JSX.Element;
	roles: RoleEnum[]; // Adjust the type if your roles are more specific
}

const PrivateRoutes = ({ children, roles }: PrivateRoutesProps) => {
	const authenticationToken = sessionStorage.getItem('accessToken');
	if (!authenticationToken) {
		// Correct declarative redirect
		return <Navigate to="/401" replace />;
	}

	// if (authenticationToken) {
	// 	const data: any = decodeToken(authenticationToken);
	// 	if (!data?.CustomerGuid || data?.expTokenTime) {
	// 		return <Navigate to="/" />;
	// 	}
	// }
	const userData: any = decodeToken(authenticationToken);

	const userHasRequiredRole = roles.includes(userData?.role);
	if (!userHasRequiredRole) {
		return <Navigate to="/403" replace />;
	}

	return children;
};

export default PrivateRoutes;
