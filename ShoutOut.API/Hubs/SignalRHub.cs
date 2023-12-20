using Microsoft.AspNetCore.SignalR;

namespace ShoutOut.Hubs
{
    public class SignalRHub: Hub
    {
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
