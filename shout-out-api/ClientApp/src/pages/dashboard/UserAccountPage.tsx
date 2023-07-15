import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Tab, Tabs, Box } from '@mui/material';
// routes
import { PATH_APP } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AccountGeneral,
  AccountNotifications,
  AccountChangePassword,
} from '../../sections/user/account';

// ----------------------------------------------------------------------

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const TABS = [
    {
      value: 'general',
      label: 'General',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral />,
    },
    {
      value: 'notifications',
      label: 'Notifications',
      icon: <Iconify icon="eva:bell-fill" />,
      component: <AccountNotifications />,
    },
    {
      value: 'change_password',
      label: 'Change password',
      icon: <Iconify icon="ic:round-vpn-key" />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <>
      <Helmet>
        <title> User: Account Settings | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_APP.root },
            { name: 'User', href: PATH_APP.user.root },
            { name: 'Account Settings' },
          ]}
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
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
