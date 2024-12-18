using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace HoTroDuLichAI.API
{
    [Authorize]
    public class ChatHub : Hub
    {
        public async Task SendMessage(string userId, string message)
        {
            // Gửi tin nhắn đến tất cả client đã kết nối
            await Clients.All.SendAsync("ReceiveMessage", userId, message);
        }

        public async Task SendMessageToUser(string receiverId, string message, string senderId)
        {
            // Gửi tin nhắn đến người dùng cụ thể
            await Clients.User(receiverId).SendAsync("ReceivePrivateMessage", senderId, message);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = RuntimeContext.CurrentUserId;
            if (userId.HasValue)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId.Value.ToString());
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = RuntimeContext.CurrentUserId;
            if (userId.HasValue)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId.Value.ToString());
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}