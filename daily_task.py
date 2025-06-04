from apscheduler.schedulers.blocking import BlockingScheduler
from datetime import datetime
from mining_data import main

def job():
    print(f"[{datetime.now()}] Running clustering job...")
    main()

scheduler = BlockingScheduler()

job()

# Lên lịch chạy lúc 01:00 mỗi ngày
scheduler.add_job(job, 'cron', hour=1, minute=0)

print("Scheduler started. Waiting for 1:00 AM to run the job daily... Press Ctrl+C to exit.")

try:
    scheduler.start()
except (KeyboardInterrupt, SystemExit):
    print("\nScheduler stopped manually.")