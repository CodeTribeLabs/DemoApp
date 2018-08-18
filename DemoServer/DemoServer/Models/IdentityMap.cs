using System.ComponentModel.DataAnnotations;

namespace DemoServer.Models
{
    public partial class IdentityMap
    {
        [Key]
        public string IdentityId { get; set; }
        public int AcctId { get; set; }
    }
}
