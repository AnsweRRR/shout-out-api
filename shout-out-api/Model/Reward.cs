using shout_out_api.Model.Interfaces;

namespace shout_out_api.Model
{
    public class Reward: IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Cost { get; set; }
        public byte[] Avatar { get; set; }
    }
}
