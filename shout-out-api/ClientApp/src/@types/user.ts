
export type IUserCard = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPosts: number;
  role: string;
};

// ----------------------------------------------------------------------

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
  // pointToGive: number | null;
  // pointToHave: number | null;
  // birthDay: Date | null;
  // startAtCompany: Date | null;
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
