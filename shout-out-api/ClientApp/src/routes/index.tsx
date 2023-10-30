import { Navigate, useRoutes } from 'react-router-dom';
import { Roles } from 'src/@types/user';
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
import { PATH_AFTER_LOGIN } from '../config-global';
import {
  FeedPage,
  RewardPage,

  LoginPage,
  RegisterPage,
  NewPasswordPage,
  ResetPasswordPage,

  UserListPage,
  UserEditPage,
  UserCreatePage,
  UserAccountPage,

  Page500,
  Page403,
  Page404
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register/:verificationToken',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
          ],
        },
      ],
    },
    {
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'feed', element: <FeedPage /> },
        { path: 'reward', element: <AuthGuard requiredRoles={[Roles.Admin]}> <RewardPage /> </AuthGuard> },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/user/account" replace />, index: true },
            { path: 'list', element: <AuthGuard requiredRoles={[Roles.Admin]}> <UserListPage /> </AuthGuard> },
            { path: 'new', element: <AuthGuard requiredRoles={[Roles.Admin]}> <UserCreatePage /> </AuthGuard> },
            { path: ':id/edit', element: <AuthGuard requiredRoles={[Roles.Admin]}> <UserEditPage /> </AuthGuard> },
            { path: 'account', element: <UserAccountPage /> },
          ],
        }
      ],
    },
    {
      element: <CompactLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
