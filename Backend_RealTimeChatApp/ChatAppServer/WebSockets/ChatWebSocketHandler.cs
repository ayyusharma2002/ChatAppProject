using ChatAppServer.Data;
using ChatAppServer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace ChatAppServer.WebSockets
{
    public class ChatWebSocketHandler
    {
        private static readonly List<WebSocket> _clients = new List<WebSocket>();
        private readonly IServiceScopeFactory _scopeFactory;

        public ChatWebSocketHandler(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public async Task HandleWebSocketAsync(WebSocket webSocket)
        {
            _clients.Add(webSocket);
            var buffer = new byte[1024 * 4];

            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Close)
                {
                    _clients.Remove(webSocket);
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by client", CancellationToken.None);
                    break;
                }

                var messageText = Encoding.UTF8.GetString(buffer, 0, result.Count);
                await SaveMessageToDatabase(messageText);
                await BroadcastMessageAsync(messageText);
            }
        }

        private async Task SaveMessageToDatabase(string message)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var chatMessage = new ChatMessage
                {
                    SenderId = "Unknown", 
                    ReceiverId = "All",
                    Message = message,
                    Timestamp = DateTime.UtcNow
                };

                dbContext.ChatMessages.Add(chatMessage);
                await dbContext.SaveChangesAsync();
            }
        }

        private async Task BroadcastMessageAsync(string message)
        {
            var messageBuffer = Encoding.UTF8.GetBytes(message);
            var tasks = new List<Task>();

            foreach (var client in _clients)
            {
                if (client.State == WebSocketState.Open)
                {
                    tasks.Add(client.SendAsync(new ArraySegment<byte>(messageBuffer), WebSocketMessageType.Text, true, CancellationToken.None));
                }
            }

            await Task.WhenAll(tasks);
        }
    }
}
