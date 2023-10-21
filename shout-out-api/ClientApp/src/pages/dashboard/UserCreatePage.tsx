import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
import { useLocales } from 'src/locales';
import { PATH_APP } from '../../routes/paths';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import UserNewEditForm from '../../sections/user/UserNewEditForm';

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();

  return (
    <>
      <Helmet>
        <title>{`${translate('SideMenu.CreateNewUser')}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={`${translate('SideMenu.CreateNewUser')}`}
          links={[
            {
              name: `${translate('SideMenu.User')}`,
              href: PATH_APP.user.list,
            },
            { name: `${translate('SideMenu.CreateNewUser')}` },
          ]}
        />
        <UserNewEditForm />
      </Container>
    </>
  );
}
