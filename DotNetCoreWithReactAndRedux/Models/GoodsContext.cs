using Microsoft.EntityFrameworkCore;

namespace DotNetCoreWithReactAndRedux.Models
{
    public class GoodsContext : DbContext
    {
        public GoodsContext(DbContextOptions<GoodsContext> options) : base(options)
        {
                
        }
        
        public DbSet<Goods> Goods { get; set; }
        public DbSet<Categories> Categories { get; set; }
    }
} 