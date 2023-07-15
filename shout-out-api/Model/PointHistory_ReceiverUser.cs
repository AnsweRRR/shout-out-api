using shout_out_api.Model.Interfaces;

namespace shout_out_api.Model
{
    public class PointHistory_ReceiverUser : IEntity
    {
        public int Id { get; set; }

        public int PointHistoryId { get; set; }
        public PointHistory PointHistory { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
