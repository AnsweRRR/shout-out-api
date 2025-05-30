﻿using Microsoft.EntityFrameworkCore;
using ShoutOut.Enums;
using ShoutOut.Model;

namespace ShoutOut.DataAccess
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options) { }

        public DbSet<User> Users { set; get; }
        public DbSet<Reward> Rewards { set; get; }
        public DbSet<PointHistory> PointHistories { set; get; }
        public DbSet<PointHistory_ReceiverUser> PointHistory_ReceiverUsers { set; get; }
        public DbSet<Notification> Notifications { set; get; }
        public DbSet<Like> Likes { set; get; }
        public DbSet<Comment> Comments { set; get; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity => { entity.HasIndex(e => e.Email).IsUnique(); });

            modelBuilder.Entity<PointHistory_ReceiverUser>()
                .HasOne(phru => phru.PointHistory)
                .WithMany()
                .HasForeignKey(phru => phru.PointHistoryId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<PointHistory_ReceiverUser>()
                .HasOne(phru => phru.User)
                .WithMany()
                .HasForeignKey(phru => phru.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<User>()
                .HasData(
                    new User {
                        Id = 1,
                        Email = "admin@admin.hu",
                        FirstName = "admin",
                        LastName = "user",
                        VerifiedAt = new DateTime(1999, 09, 23, 12, 12, 12, 485, DateTimeKind.Utc),
                        IsActive = true,
                        UserName = "Admin User",
                        Role = Role.Admin,
                        PointsToGive = 100,
                        PointToHave = 0,
                        PasswordHash = "$2a$11$s4fJC1smXEopJu7Bll5MgOVc.gWLp3rLqnkHgXAlPbtxV8UGDIIdq" // Abcd1
                    });
        }
    }
}
