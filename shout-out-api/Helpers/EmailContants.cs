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

        public static string NEW_ITEM_CLAIM_EVENT_SUBJECT()
        {
            return "Item claimed in ShoutOut";
        }

        public static string NEW_ITEM_CLAIM_EVENT_BODY(string userName, string itemName)
        {
            return $"{userName} claimed a '{itemName}' item";
        }

        public static string NEW_ITEM_CREATED_SUBJECT()
        {
            return "New item is available in ShoutOut";
        }

        public static string NEW_ITEM_CREATED_BODY(string itemName)
        {
            return $"New item '{itemName}' is available in ShoutOut. Go check it quickly!";
        }

        public static string GET_POINTS_SUBJECT()
        {
            return "You got some points in ShoutOut";
        }

        public static string GET_POINTS_BODY(string senderUserName, int pointAmount)
        {
            return $"You got {pointAmount} from {senderUserName}. Well done.";
        }
    }
}
