import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_APP } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const currentUser = _userList.find((user) => paramCase(user.id) === id);

  return (
    <>
      <Helmet>
        <title> User: Edit user | Minimal UI</title>
      </Helmet>

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
            { name: `${currentUser?.firstName  } ${  currentUser?.lastName}` },
          ]}
        />

        <UserNewEditForm isEdit currentUser={currentUser} />
      </Container>
    </>
  );
}
