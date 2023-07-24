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
    }
}
