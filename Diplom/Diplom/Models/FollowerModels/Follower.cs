using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.FollowerModels
{
    public class Follower
    {
        public int UserId { get; set; }
        public int FollowedUserId { get; set; }
    }
}
