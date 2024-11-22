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

        public DbSet<LinkHelperEntity> LinkHelpers { get; set; } = null!;
        public DbSet<UserRefreshTokenEntity> UserRefreshTokens { get; set; } = null!;
        public new DbSet<UserTokenEntity> UserTokens { get; set; } = null!;
        public DbSet<MessageEntity> Messages { get; set; } = null!;
        public DbSet<NotificationEntity> Notifications { get; set; } = null!;
        public DbSet<PlaceEntity> Places { get; set; } = null!;
        public DbSet<ItineraryDetailEntity> ItineraryDetails { get; set; } = null!;
        public DbSet<ItineraryEntity> Itineraries { get; set; } = null!;
        public DbSet<ProvinceEntity> Provinces { get; set; } = null!;
        public DbSet<BusinessEntity> Businesses { get; set; } = null!;
        public DbSet<BusinessAnalyticEntity> BusinessAnalytics { get; set; } = null!;
        public DbSet<ReviewPlaceEntity> ReviewPlaces { get; set; } = null!;
        public DbSet<ArticleEntity> Articles { get; set; } = null!;

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

            builder.Entity<MessageEntity>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<MessageEntity>()
                .HasOne(m => m.Receiver)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ReviewPlaceEntity>()
                .HasOne(r => r.User)
                .WithMany(u => u.ReviewPlaces)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ReviewPlaceEntity>()
                .HasOne(r => r.Place)
                .WithMany(p => p.ReviewPlaces)
                .HasForeignKey(r => r.PlaceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ItineraryDetailEntity>()
                .HasOne(id => id.Itinerary)
                .WithMany(i => i.ItineraryDetails)
                .HasForeignKey(id => id.ItineraryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ItineraryDetailEntity>()
                .HasOne(id => id.Place)
                .WithMany(p => p.ItineraryDetails)
                .HasForeignKey(id => id.PlaceId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}