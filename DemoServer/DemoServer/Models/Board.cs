using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemoServer.Models
{
    public class Board
    {
        public int Id { get; set; }
        public int AcctId { get; set; }
        public string DisplayName { get; set; }
        public string Title { get; set; }
        public string OwnerId { get; set; }
        public long TimeStamp { get; set; } // Unix TimeStamp
    }
}
