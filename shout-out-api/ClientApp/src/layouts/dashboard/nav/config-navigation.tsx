import { Roles } from 'src/@types/user';
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
        title: 'SideMenu.Feed',
        path: PATH_APP.root,
        icon: ICONS.analytics,
        children: [
          { title: 'SideMenu.Feed', path: PATH_APP.feed.root},
          { title: 'SideMenu.ReceivedPoints', path: PATH_APP.feed.receivedPoints},
          { title: 'SideMenu.GivenPoints', path: PATH_APP.feed.givenPoints},
        ],
      }
    ]
  },

  {
    subheader: '',
    items: [
      {
        title: 'SideMenu.Reward',
        path: PATH_APP.reward,
        icon: ICONS.analytics
      }
    ]
  },
  {
    subheader: 'SideMenu.Management',
    items: [
      {
        title: 'SideMenu.User',
        path: PATH_APP.user.root,
        icon: ICONS.user,
        roles: [Roles.Admin],
        children: [
          { title: 'SideMenu.List', path: PATH_APP.user.list, roles: [Roles.Admin] },
          { title: 'SideMenu.CreateNewUser', path: PATH_APP.user.new, roles: [Roles.Admin] },
          { title: 'SideMenu.Account', path: PATH_APP.user.account },
        ],
      }
    ],
  },
];

export default navConfig;