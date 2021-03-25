using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.RatingModels
{
    public class MusicStarRating
    {
        public int MusicId { get; set; }
        public int UserId { get; set; }

        [Required(ErrorMessage = "Не указано значение оценки")]
        [Range(1,5)]
        public int Rating { get; set; }
    }
}
