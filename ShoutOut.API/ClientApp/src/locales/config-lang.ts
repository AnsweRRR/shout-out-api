import { enUS, huHU } from '@mui/material/locale';

export const allLangs = [
  {
    label: 'Hungarian',
    value: 'hu',
    systemValue: huHU,
    icon: '/assets/icons/flags/ic_flag_hu.svg',
  },
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_en.svg',
  }
];

export const defaultLang = allLangs[0];