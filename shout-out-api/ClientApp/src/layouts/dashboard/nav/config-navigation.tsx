// routes
import { PATH_APP } from '../../../routes/paths';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
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