// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_APP = '';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: (verificationToken: string) => path(ROOTS_AUTH, `/register/${verificationToken}`),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  page403: '/403',
  page404: '/404',
  page500: '/500'
};

export const PATH_APP = {
  root: ROOTS_APP,
  feed: {
    root: path(ROOTS_APP, '/feed'),
    receivedPoints: path(ROOTS_APP, '/feed/receivedPoints'),
    givenPoints: path(ROOTS_APP, '/feed/givenPoints'),
  },
  reward: path(ROOTS_APP, '/reward'),
  permissionDenied: path(ROOTS_APP, '/permission-denied'),
  user: {
    root: path(ROOTS_APP, '/user'),
    new: path(ROOTS_APP, '/user/new'),
    list: path(ROOTS_APP, '/user/list'),
    account: path(ROOTS_APP, '/user/account'),
    edit: (id: number) => path(ROOTS_APP, `/user/${id}/edit`),
  }
};