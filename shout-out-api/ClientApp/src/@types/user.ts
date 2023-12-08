import { SuggestionDataItem } from "react-mentions";
import { CustomFile } from "src/components/upload";

export enum Roles {
  Admin = 0,
  User = 1,
};

export const RolesToDisplay: { [index: number]: string } = {
  [Roles.Admin]: "Admin",
  [Roles.User]: "User",
};

export type IUserAccountGeneral = {
  id: number;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  userName: string | null;
  email: string;
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
  lastName: string,
  encodedUrl?: string | null
};

export type ResetPasswordDto = {
  email: string,
  sixDigitCode: string,
  newPassword: string,
  confirmNewPassword: string
};

export type ChangePasswordDto = {
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
};

export type EditUserDto = {
  firstName?: string,
  lastName?: string,
  userName?: string | null,
  avatar?: CustomFile | string | null,
  role?: Roles,
  birthday?: Date | string | null,
  startAtCompany?: Date | string | null
};

export type RegisterDto = {
  userName: string,
  password: string,
  confirmPassword: string,
  token: string
};

// ----------------------------------------------------------------------

export type UserDataToSelectDto = {
  id: number,
  userName: string | null,
  firstName: string,
  lastName: string,
  email: string,
  avatarUrl: string | null,
  display: string
}

export interface ExtendedSuggestionDataItem extends SuggestionDataItem {
  id: string | number;
  display?: string;
  avatar?: string;
}