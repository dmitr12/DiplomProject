using Diplom.Models.CommentModels;
using Diplom.Models.ComplaintModels;
using Diplom.Models.FollowerModels;
using Diplom.Models.GenreModels;
using Diplom.Models.MusicModels;
using Diplom.Models.NotificationModels;
using Diplom.Models.PlaylistModels;
using Diplom.Models.PlaylistsMusicsModels;
using Diplom.Models.RatingModels;
using Diplom.Models.RoleModels;
using Diplom.Models.UserModels;
using Diplom.Models.UsersNotifications;
using Microsoft.EntityFrameworkCore;

namespace Diplom.Models
{
    public class DataBaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<MusicGenre> MusicGenres { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UsersMusic> UsersMusics { get; set; }
        public DbSet<MusicComment> MusicComments { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<PlaylistsMusic> PlaylistsMusics { get; set; }
        public DbSet<Follower> Followers { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<UsersNotification> UsersNotifications { get; set; }
        public DbSet<Complaint> Complaints { get; set; }

        public DataBaseContext(DbContextOptions<DataBaseContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UsersMusic>().HasKey(r => new { r.UserId, r.MusicId});
            modelBuilder.Entity<PlaylistsMusic>().HasKey(p => new { p.PlaylistId, p.MusicId });
            modelBuilder.Entity<Follower>().HasKey(f => new { f.UserId, f.FollowedUserId });
            modelBuilder.Entity<MusicComment>().HasKey(c => c.IdComment);
            modelBuilder.Entity<UsersNotification>().HasKey(un => new { un.UserId, un.NotificationId });
        }
    }
}
