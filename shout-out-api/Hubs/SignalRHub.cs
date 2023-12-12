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
            var connectionId = Context.ConnectionId;

            Console.WriteLine("-------------------");
            Console.WriteLine($"CancellationToken: ${cancellationToken}");
            Console.WriteLine($"ConnectionId: ${connectionId}");
            Console.WriteLine("Client connected to the hub. Welcome :)");
            Console.WriteLine("-------------------");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var cancellationToken = Context.ConnectionAborted;
            var connectionId = Context.ConnectionId;

            Console.WriteLine("-------------------");
            Console.WriteLine($"CancellationToken: ${cancellationToken}");
            Console.WriteLine($"ConnectionId: ${connectionId}");
            Console.WriteLine("$Client disconnected from the hub. Bye :(");
            Console.WriteLine("-------------------");

            await base.OnDisconnectedAsync(exception);
        }
    }
}
