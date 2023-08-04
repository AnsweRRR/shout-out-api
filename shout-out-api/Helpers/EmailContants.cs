namespace shout_out_api.Helpers
{
    public static class EmailContants
    {
        public static string NEW_USER_CONFIRM_EMAIL_SUBJECT()
        {
            return "Invited to ShoutOut";
        }

        public static string NEW_USER_CONFIRM_EMAIL_BODY(string confirmLink)
        {
            return $"<a href=\"{confirmLink}\" target=\"_blank\">Account confirmation</a>";
        }

        public static string PASSWORD_RESET_TOKEN_SUBJECT()
        {
            return "Forgot password";
        }

        public static string PASSWORD_RESET_TOKEN_BODY(string passwordResetToken)
        {
            return $"Code: {passwordResetToken}";
        }
    }
}
