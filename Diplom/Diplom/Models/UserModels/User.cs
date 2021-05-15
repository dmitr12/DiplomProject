using Diplom.Models.MusicModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.UserModels
{
    public enum UserRoleEnum
    {
        User = 1,
        Admin = 2
    }

    public class User
    {
        public int UserId { get; set; }

        [Required]
        public int RoleId { get; set; }

        [Required]
        [StringLength(maximumLength: 50, MinimumLength = 3)]
        public string Login { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        public string Mail { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public string Avatar { get; set; }
        public string AvatarFile { get; set; }

        [StringLength(100, MinimumLength = 3)]
        public string Name { get; set; }

        [StringLength(100, MinimumLength = 3)]
        public string Surname { get; set; }

        public string Country { get; set; }

        public string City { get; set; }

        public bool IsMailConfirmed { get; set; }

        public Guid VerifyCode { get; set; }

        public List<Music> Musics { get; set; }
        
        public DateTime RegistrationDate { get; set; }
    }
}
