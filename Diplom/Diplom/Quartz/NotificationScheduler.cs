using Quartz;
using Quartz.Impl;
using System;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Quartz
{
    public class NotificationScheduler
    {
        public static async void Start(IServiceProvider serviceProvider)
        {
            IScheduler scheduler = await StdSchedulerFactory.GetDefaultScheduler();
            scheduler.JobFactory = serviceProvider.GetService<JobFactory>();
            await scheduler.Start();

            IJobDetail jobDetail = JobBuilder.Create<NotificationCleaner>().Build();
            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("NotificationTrigger", "default")
                .WithDailyTimeIntervalSchedule(s =>
                s.WithIntervalInHours(24)
                .OnEveryDay()
                .StartingDailyAt(TimeOfDay.HourAndMinuteOfDay(23, 59))
                )
                .Build();

            await scheduler.ScheduleJob(jobDetail, trigger);
        }
    }
}
