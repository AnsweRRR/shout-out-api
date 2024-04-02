import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Container, Tab, Tabs, Box } from '@mui/material';
import { useLocales } from 'src/locales';
import { PATH_APP } from '../../routes/paths';
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { AccountGeneral, AccountNotifications, AccountChangePassword } from '../../sections/user/account';

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const [currentTab, setCurrentTab] = useState('general');

  const TABS = [
    {
      value: 'general',
      label: `${translate('SideMenu.General')}`,
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral />,
    },
    // {
    //   value: 'notifications',
    //   label: `${translate('SideMenu.Notifications')}`,
    //   icon: <Iconify icon="eva:bell-fill" />,
    //   component: <AccountNotifications />,
    // },
    {
      value: 'change_password',
      label: `${translate('SideMenu.ChangePassword')}`,
      icon: <Iconify icon="ic:round-vpn-key" />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${translate('SideMenu.User')} - ${translate('SideMenu.Account')}`}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: `${translate('SideMenu.User')}`, href: PATH_APP.user.root },
            { name: `${translate('SideMenu.Account')}` },
          ]}
        />

        <Tabs value={currentTab} onChange={(_event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
