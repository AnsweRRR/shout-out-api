import i18n from 'i18next';
import { PATH_APP } from '../../../routes/paths';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  folder: icon('ic_folder'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
  {
    subheader: '',
    items: [
      {
        title: i18n.t('SideMenu.Menu'),
        path: PATH_APP.root,
        icon: ICONS.analytics,
        children: [
          { title: i18n.t('SideMenu.Feed'), path: PATH_APP.feed },
          { title: i18n.t('SideMenu.Reward'), path: PATH_APP.reward },
        ],
      }
    ]
  },
  {
    subheader: i18n.t('SideMenu.Management'),
    items: [
      {
        title: i18n.t('SideMenu.User'),
        path: PATH_APP.user.root,
        icon: ICONS.user,
        children: [
          { title: i18n.t('SideMenu.List'), path: PATH_APP.user.list },
          { title: i18n.t('SideMenu.Create'), path: PATH_APP.user.new },
          { title: i18n.t('SideMenu.Account'), path: PATH_APP.user.account },
        ],
      }
    ],
  },
];

export default navConfig;