using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace DemoServer.Hubs
{
    public class MessageHub : Hub
    {
        // Invoke this method from the client app
        public void SendMessage(string message)
        {
            // Configure the client app to listen for this
            Clients.All.SendAsync("ServerMessage", message);
        }
    }
}
