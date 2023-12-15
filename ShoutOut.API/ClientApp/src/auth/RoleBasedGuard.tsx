import { m } from 'framer-motion';
import { Container, Typography } from '@mui/material';
import { Roles } from 'src/@types/user';
import { MotionContainer, varBounce } from '../components/animate';
import { ForbiddenIllustration } from '../assets/illustrations';
import { useAuthContext } from './useAuthContext';

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles?: Array<Roles>;
  children: React.ReactNode;
};

export default function RoleBasedGuard({ hasContent, roles, children }: RoleBasedGuardProp) {
  const { user } = useAuthContext();
  const currentRole = user?.role;

  if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Permission Denied
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
