import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { IUserAccountGeneral } from 'src/@types/user';
import { getUserDataAsync } from 'src/api/userClient';
import { PATH_APP } from '../../routes/paths';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import UserNewEditForm from '../../sections/user/UserNewEditForm';



// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [userToEdit, setUserToEdit] = useState<IUserAccountGeneral | null>(null);

  useEffect(() => {
    if (user) {
      const getUserData = async () => {
        const result = await getUserDataAsync(id as unknown as number, user?.accessToken, navigate);
        const userData = result.data;

        const userDto: IUserAccountGeneral = {
          id: userData.id,
          avatarUrl: userData.avatar,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
          email: userData.email,
          isVerified: userData.verified,
          isActive: userData.isActive,
          role: userData.role,
          birthDay: userData.birthday ? new Date(userData.birthday) : null,
          startAtCompany: userData.startAtCompany ? new Date(userData.startAtCompany) : null,
        };

        setUserToEdit(userDto);
      };
  
      getUserData();
    }
  }, [id, user, navigate]);

  return (
    <>
      <Helmet>
        <title> User: Edit user | Minimal UI</title>
      </Helmet>

      {userToEdit &&
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Edit user"
            links={[
              {
                name: 'Dashboard',
                href: PATH_APP.root,
              },
              {
                name: 'User',
                href: PATH_APP.user.list,
              },
              { name: `${userToEdit?.firstName  } ${  userToEdit?.lastName}` },
            ]}
          />

          <UserNewEditForm isEdit currentUser={userToEdit} />
        </Container>
      }
    </>
  );
}
