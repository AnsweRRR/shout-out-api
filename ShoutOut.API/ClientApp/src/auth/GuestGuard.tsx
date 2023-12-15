import { Navigate } from 'react-router-dom';
import { PATH_AFTER_LOGIN } from '../config-global';
import LoadingScreen from '../components/loading-screen';
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={PATH_AFTER_LOGIN} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
