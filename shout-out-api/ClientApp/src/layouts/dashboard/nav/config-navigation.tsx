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
        title: 'menu',
        path: PATH_APP.root,
        icon: ICONS.analytics,
        children: [
          { title: 'feed', path: PATH_APP.feed },
          { title: 'reward', path: PATH_APP.reward },
        ],
      }
    ]
  },
  {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: PATH_APP.user.root,
        icon: ICONS.user,
        children: [
          { title: 'list', path: PATH_APP.user.list },
          { title: 'create', path: PATH_APP.user.new },
          // { title: 'edit', path: PATH_APP.user.edit },
          { title: 'account', path: PATH_APP.user.account },
        ],
      }
    ],
  },
];

export default navConfig;