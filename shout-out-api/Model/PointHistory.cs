using shout_out_api.Model.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace shout_out_api.Model
{
    public class PointHistory : IEntity
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public int SenderId { get; set; }

        [ForeignKey("SenderId")]
        public User SenderUser { get; set; }
        public DateTimeOffset EventDate { get; set; }
        public string? Description { get; set; }
    }
}
