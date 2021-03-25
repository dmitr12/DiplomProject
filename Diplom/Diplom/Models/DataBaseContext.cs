using Diplom.Models.GenreModels;
using Diplom.Models.MusicModels;
using Diplom.Models.RatingModels;
using Diplom.Models.RoleModels;
using Diplom.Models.UserModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models
{
    public class DataBaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<MusicGenre> MusicGenres { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<MusicStarRating> MusicStarRatings { get; set; }

        public DataBaseContext(DbContextOptions<DataBaseContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MusicStarRating>().HasKey(um => new { um.MusicId, um.UserId });
        }
    }
}
