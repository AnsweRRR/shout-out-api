import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Roles } from 'src/@types/user';
import { PATH_PAGE } from 'src/routes/paths';
import LoadingScreen from '../components/loading-screen';
import Login from '../pages/auth/LoginPage';
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
  requiredRoles?: Array<Roles>
};

export default function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const { isAuthenticated, isInitialized, user } = useAuthContext();
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requiredRoles && !requiredRoles?.includes(user?.role)) {
    return <Navigate to={PATH_PAGE.page403} />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <> {children} </>;
}
