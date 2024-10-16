using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class HoTroDuLichAIDbContext : IdentityDbContext<UserEntity, RoleEntity, Guid>
    {
        public HoTroDuLichAIDbContext(DbContextOptions<HoTroDuLichAIDbContext> options) : base(options)
        {
        }

        public DbSet<LinkHelperEntity> LinkHelpers { get; set; }
        public DbSet<UserRefreshTokenEntity> UserRefreshTokens { get; set; }
        public new DbSet<UserTokenEntity> UserTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Ignore Identity tables to exclude them from migrations
            builder.Ignore<IdentityUserToken<Guid>>();
            builder.Ignore<IdentityUserLogin<Guid>>();
            builder.Ignore<IdentityRoleClaim<Guid>>();
            builder.Ignore<IdentityUserClaim<Guid>>();

            // Rename AspNet tables
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                if (entityType.GetTableName()!.StartsWith("AspNet"))
                {
                    entityType.SetTableName($"Admin_{entityType.GetTableName()?.Substring(6).TrimEnd('s')}");
                }
            }
        }
    }
}