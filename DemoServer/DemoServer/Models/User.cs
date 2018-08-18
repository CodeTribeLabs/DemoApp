using System.ComponentModel.DataAnnotations;

namespace DemoServer.Models
{
    public partial class User
    {
        [Key]
        public int AcctId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AuthToken { get; set; }
        public int GameCredits { get; set; }
        public int GameCurrency { get; set; }
        public int TotalBoards { get; set; }
        public int TotalComments { get; set; }
        public int Status { get; set; }
    }
}
