from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import pandas as pd
from apscheduler.schedulers.background import BackgroundScheduler

data = pd.DataFrame()  # Khởi tạo rỗng ban đầu
scheduler = BackgroundScheduler()

def load_data():
    global data
    uri = "mongodb+srv://lap:12345@cluster0.89utstf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client['mining']
    collection = db['paper_mining']
    cursor = collection.find()
    raw_data = list(cursor)

    for d in raw_data:
        d.pop('_id', None)

    data = pd.DataFrame(raw_data)
    print("[INFO] Dữ liệu đã được tải lại từ MongoDB.")

def detailed_analysis_each_topic_by_month(top_percent=0.05, month_A=10, month_B=12):
    local_data = data.copy()
    local_data['Ngày bắt đầu khảo sát'] = pd.to_datetime(
        local_data['Ngày bắt đầu khảo sát'] + '/2024', format='%d/%m/%Y', errors='coerce'
    )

    filtered_data = local_data.dropna(subset=['Ngày bắt đầu khảo sát'])
    filtered_data = filtered_data[filtered_data['topic'] != 'Nhiễu']
    filtered_data = filtered_data[filtered_data['Ngày bắt đầu khảo sát'].dt.month.isin(range(month_A, month_B + 1))]
    grouped_data = filtered_data.groupby('topic')

    def get_top_xx_percent(group, top_percent):
        group = group.sort_values(by='Số lượng tìm kiếm', ascending=False)
        top_xx = max(1, int(len(group) * top_percent))
        return group.head(top_xx)
    
    top_xx_percent_items = grouped_data.apply(lambda g: get_top_xx_percent(g, top_percent)).reset_index(drop=True)

    topic_groups = top_xx_percent_items.groupby('topic')
    analysis_data = topic_groups.agg(
        total_searchs=('Số lượng tìm kiếm', 'sum'),
    ).reset_index()
    analysis_data = analysis_data.sort_values(by='total_searchs', ascending=False)
    
    return analysis_data.to_dict(orient='records')

def detailed_analysis_each_topic():
    local_data = data.copy()
    filtered_data = local_data[local_data['topic'] != 'Nhiễu']
    analysis_data = filtered_data.groupby('topic').agg(
        total_searchs=('Số lượng tìm kiếm', 'sum')
    ).reset_index()
    analysis_data = analysis_data.sort_values(by='total_searchs', ascending=False)

    return analysis_data.to_dict(orient='records')

def get_records_by_topic(topic_name):
    local_data = data.copy()
    local_data = local_data.drop(columns=['Ngày bắt đầu khảo sát', 'Ngày kết thúc khảo sát', 'Chủ đề', 'Tiêu đề', 'Vùng địa lý', 'fixed_title'], errors='ignore')
    return local_data[local_data['topic'] == topic_name].reset_index(drop=True).to_dict(orient='records')

def get_list_topic():
    local_data = data.copy()
    topics = local_data['topic'].unique().tolist()
    return [{'topic': topic} for topic in topics]

# Gọi khi module được import (vd: từ Flask app)
load_data()
scheduler.add_job(load_data, 'cron', hour=3, minute=0)
scheduler.start()

# Khi chạy trực tiếp, giữ tiến trình sống để test riêng
if __name__ == "__main__":
    try:
        print("[INFO] Chạy mining.py trực tiếp...")
        while True:
            import time
            time.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
