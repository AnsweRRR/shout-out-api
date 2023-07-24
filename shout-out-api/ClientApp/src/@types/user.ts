
export enum Roles {
  Admin = 0,
  User = 1,
};

export const RolesToDisplay: { [index: number]: string } = {
  [Roles.Admin]: "Admin",
  [Roles.User]: "User",
};

export type IUserAccountGeneral = {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  userName: string | null;
  email: string;
  company: string | null;
  isVerified: boolean;
  role: Roles;
  pointsToGive?: number;
  pointsToHave?: number;
  birthDay?: Date | null;
  startAtCompany?: Date | null;
  accessToken?: string | null;
  refreshToken?: string | null;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

// ----------------------------------------------------------------------

export type IUserAccountNotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};

export type InviteRequestDto = {
  email: string,
  role: Roles,
  firstName: string,
  lastName: string
};