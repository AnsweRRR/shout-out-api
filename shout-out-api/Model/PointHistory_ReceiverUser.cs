using shout_out_api.Model.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shout_out_api.Model
{
    public class PointHistory_ReceiverUser : IEntity
    {
        [Key]
        public int Id { get; set; }

        public int PointHistoryId { get; set; }

        [ForeignKey("PointHistoryId")]
        public PointHistory PointHistory { get; set; } = null!;

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}
