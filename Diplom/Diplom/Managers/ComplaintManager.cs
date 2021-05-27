using Diplom.Models;
using Diplom.Models.ComplaintModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Managers
{
    public class ComplaintManager
    {
        private readonly DataBaseContext db;

        public ComplaintManager(DataBaseContext db)
        {
            this.db = db;
        }

        public async Task<IActionResult> AddComplaint(AddComplaintModel model, int userId)
        {
            try
            {
                var user = await db.Users.FindAsync(userId);
                if (user == null)
                    return new NotFoundObjectResult(new { msg = "Пользователь, отправляющий жалобу, не найден" });
                var music = await db.Musics.FindAsync(model.MusicId);
                if (music == null)
                    return new NotFoundObjectResult(new { msg = "Музыка, на которую отправляется жалоба, не найдена" });
                var savedModel = await db.Complaints.Where(c => c.UserId == userId && c.MusicId == model.MusicId).FirstOrDefaultAsync();
                if (savedModel != null)
                    return new OkObjectResult(new { msg = "Вы уже оставили свою жалобу" });
                var complaint = new Complaint
                {
                    ComplaintType = model.ComplaintType,
                    UserId = userId,
                    MusicId = model.MusicId,
                    Message = model.Message,
                    IsChecked = false,
                    CreateDate = DateTime.Now
                };
                db.Complaints.Add(complaint);
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }

        public async Task<IActionResult> CheckComplaint(CheckComplaint model)
        {
            try
            {
                var complaint = await db.Complaints.FindAsync(model.Id);
                if (complaint == null)
                    return new NotFoundResult();
                complaint.IsChecked = true;
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }

        public async Task<List<Complaint>> GetAllComplaints()
        {
            return await db.Complaints.OrderByDescending(c=>c.CreateDate).ToListAsync();
        }

        public async Task<bool> IsUserComplained(int userId, int musicId)
        {
            var complaint = await db.Complaints.Where(c => c.UserId == userId && c.MusicId == musicId).FirstOrDefaultAsync();
            return complaint == null ? false : true;
        }
    }
}
