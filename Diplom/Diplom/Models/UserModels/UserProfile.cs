using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.UserModels
{
    public class UserProfile
    {
        public int UserId { get; set; }
        public string Login { get; set; }
        public string Avatar { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public int CountMusics { get; set; }
        public int CountComments { get; set; }
        public int SummaryMusicRating{ get; set; }
    }
}
