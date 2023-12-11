using Microsoft.AspNetCore.SignalR;
using shout_out_api.Dto.PointSystem;
using shout_out_api.Interfaces;

namespace shout_out_api.Hubs
{
    public class SignalRHub: Hub
    {
        private readonly IPointSystemService _pointSystemService;
        public SignalRHub(IPointSystemService pointSystemService)
        {
            _pointSystemService = pointSystemService;
        }
    }
}
