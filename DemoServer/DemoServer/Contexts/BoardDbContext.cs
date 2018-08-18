using Microsoft.EntityFrameworkCore;

namespace DemoServer.Contexts
{
    public class BoardDbContext : DbContext
    {
        public BoardDbContext(DbContextOptions<BoardDbContext> options) : base(options) { }

        public DbSet<Models.Board> Boards { get; set; }
    }
}
