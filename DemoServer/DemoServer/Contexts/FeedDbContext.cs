using Microsoft.EntityFrameworkCore;

namespace DemoServer.Contexts
{
    public class FeedDbContext : DbContext
    {
        public FeedDbContext(DbContextOptions<FeedDbContext> options) : base(options) { }

        public DbSet<Models.Feed> Feeds { get; set; }
    }
}
