using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemoServer.Models
{
    public class Feed
    {
        public int Id { get; set; }
        public int BoardId { get; set; }
        public int AcctId { get; set; }
        public string DisplayName { get; set; }
        public string Content { get; set; }
        public string OwnerId { get; set; }
        public long TimeStamp { get; set; } // Unix TimeStamp
    }
}
