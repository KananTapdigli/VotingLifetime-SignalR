using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalR
{
    public class ChatHub : Hub
    {
        static List<Vote> votes = new List<Vote>();
        public async Task SendVote(string GroupName)
        {
            var vote = votes.FirstOrDefault(v => v.Key == GroupName);

            if (vote != null)
            {
                vote.Value++;
            }
            else
            {
                var newVote = new Vote() { Key = GroupName, Value = 1 };
                votes.Add(newVote);
            }

            await Clients.All.SendAsync("ReceiveVote", votes);
        }
    }

    class Vote
    {
        public string Key { get; set; }
        public int Value { get; set; }
    }
}
