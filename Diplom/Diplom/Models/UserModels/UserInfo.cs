using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.UserModels
{
    public class UserInfo
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string Login { get; set; }
        public string Mail { get; set; }
        public string Avatar { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public bool IsMailConfirmed { get; set; }
    }
}
