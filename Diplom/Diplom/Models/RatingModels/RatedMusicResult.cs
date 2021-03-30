using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.RatingModels
{
    public class RatedMusicResult
    {
        public bool RatedMusic { get; set; }
        public double Rating { get; set; }
        public int CountRatings { get; set; }
    }
}
