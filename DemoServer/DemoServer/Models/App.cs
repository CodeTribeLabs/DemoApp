using System.ComponentModel.DataAnnotations;

namespace DemoServer.Models
{
    public partial class App
    {
        [Key]
        public int Id { get; set; }
        public string AppBundle { get; set; }
        public string AppName { get; set; }
        public int Category { get; set; }
        public string Genre { get; set; }
        public string GenreKeys { get; set; }
        public string ListingKeys { get; set; }
        public string UserRating { get; set; }
        public string ContentRating { get; set; }
        public string ContentCategory { get; set; }
        public string FullDescription { get; set; }
        public string ShortDescription { get; set; }
        public string Version { get; set; }
        public int PublisherId { get; set; }
        public string IconUrl { get; set; }
        public string Screenshot1Url { get; set; }
        public string Screenshot2Url { get; set; }
        public string Screenshot3Url { get; set; }
        public string Screenshot4Url { get; set; }
        public string Screenshot5Url { get; set; }
        public int Status { get; set; }
    }
}