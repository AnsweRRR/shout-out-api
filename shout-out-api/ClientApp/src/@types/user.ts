
export enum Roles {
  Admin = 0,
  User = 1,
}

export type IUserAccountGeneral = {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  userName: string | null;
  email: string;
  company: string | null;
  isVerified: boolean;
  role: string;
  pointsToGive?: number;
  pointsToHave?: number;
  birthDay?: Date | null;
  startAtCompany?: Date | null;
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
