using Diplom.Interfaces;
using Diplom.Managers;
using Diplom.Quartz;
using Diplom.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Utils
{
    public static class ServiceExtensions
    {
        public static void AddDependencies(this IServiceCollection services)
        {
            services.AddScoped<IGeneratorToken, TokenManager>();
            services.AddScoped<UserManager>();
            services.AddScoped<MusicManager>();
            services.AddScoped<CommentManager>();
            services.AddScoped<EmailManager>();
            services.AddScoped<PlaylistManager>();
            services.AddScoped<FollowerManager>();
            services.AddScoped<NotificationManager>();
            services.AddScoped<ComplaintManager>();
            services.AddSingleton<ICloudService, CloudService>();
            services.AddSingleton<IEmailService, EmailService>();
            services.AddScoped<JobFactory>();
            services.AddScoped<NotificationCleaner>();
        }
    }
}
