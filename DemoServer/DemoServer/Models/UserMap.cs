using System.ComponentModel.DataAnnotations;

namespace DemoServer.Models
{
    public partial class UserMap
    {
        [Key]
        public string Email { get; set; }
        public int AcctId { get; set; }
    }
}
