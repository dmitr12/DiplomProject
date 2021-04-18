using Diplom.Models.CommentModels;
using Diplom.Models.GenreModels;
using Diplom.Models.MusicModels;
using Diplom.Models.PlaylistModels;
using Diplom.Models.PlaylistsMusicsModels;
using Diplom.Models.RatingModels;
using Diplom.Models.RoleModels;
using Diplom.Models.UserModels;
using Microsoft.EntityFrameworkCore;

namespace Diplom.Models
{
    public class DataBaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<MusicGenre> MusicGenres { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<MusicStarRating> MusicStarRatings { get; set; }
        public DbSet<MusicComment> MusicComments { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<PlaylistsMusic> PlaylistsMusics { get; set; }

        public DataBaseContext(DbContextOptions<DataBaseContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MusicStarRating>().HasKey(r => new { r.MusicId, r.UserId });
            modelBuilder.Entity<PlaylistsMusic>().HasKey(p => new { p.PlaylistId, p.MusicId });
            modelBuilder.Entity<MusicComment>().HasKey(c => c.IdComment);
        }
    }
}
