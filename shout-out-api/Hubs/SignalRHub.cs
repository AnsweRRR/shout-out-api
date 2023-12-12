using Microsoft.AspNetCore.SignalR;
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

        public override async Task OnConnectedAsync()
        {
            var cancellationToken = Context.ConnectionAborted;

            Console.WriteLine("Client connected to the hub. Welcome :)");
            Console.WriteLine(cancellationToken);

            await base.OnConnectedAsync();
        }
    }
}
