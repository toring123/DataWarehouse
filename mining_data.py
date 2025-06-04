# importing libraries
print("Đang tải thư viện")
import hdbscan
import random
import torch
import pandas as pd
import re
from tqdm import tqdm
from sklearn.preprocessing import StandardScaler
import numpy as np
import random
import umap
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from openai import OpenAI
from sentence_transformers import SentenceTransformer

# Load the model
model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')

def read_data():
    print("Bắt đầu đọc dữ liệu")
    """# Data Preprocessing"""
    # Đọc tất cả dữ liệu từ mongodb
    uri = "mongodb+srv://***:*****@cluster0.89utstf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client['mining']
    collection = db['paper']
    cursor = collection.find()
    data = list(cursor)
    for d in data:
        d.pop('_id', None)
    df = pd.DataFrame(data)
    print("Đọc dữ liệu từ MongoDB thành công!")
    return df

def preprocess_data(df):
    print("Bắt đầu tiền xử lý dữ liệu")
    """# SBERT for Embedder"""
    random_seed = 42
    random.seed(random_seed)

    # Set a random seed for PyTorch (for GPU as well)
    torch.manual_seed(random_seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(random_seed)

    def reformat_spacing(sentence):
        words = sentence.split()
        # Ghép các từ lại với nhau bằng một khoảng trắng duy nhất
        formatted_sentence = ' '.join(words)  # Đảm bảo khoảng cách giữa các từ nhất quán
        return formatted_sentence

    def remove_words_containing_substring(sentence, substring):
        # Định nghĩa mẫu regex để tìm các từ chứa chuỗi con được chỉ định
        pattern = r'\b\w*' + re.escape(substring) + r'\w*\b'  # Khớp bất kỳ từ nào chứa chuỗi con
        # Thay thế các từ khớp bằng một chuỗi rỗng
        result = re.sub(pattern, '', sentence)  # Loại bỏ tất cả các từ chứa chuỗi con
        # Loại bỏ khoảng trắng thừa có thể còn lại
        result = re.sub(r'\s+', ' ', result).strip()
        return result

    i = 0
    # Chuyển đổi cột 'Tiêu đề bài báo' thành danh sách để xử lý
    t_list = df['Tiêu đề bài báo'].tolist()
    pt_list = []  # Khởi tạo danh sách rỗng để lưu các tiêu đề đã xử lý

    for t in t_list:  # Lặp qua từng tiêu đề trong danh sách
        re_list = [
            "vs", "và", "của", "bị", "với", "ở", "về", "thành"  # Danh sách các chuỗi cần loại bỏ khỏi tiêu đề
        ]

        # Chuyển tiêu đề thành chữ thường để xử lý
        tmp = t.lower()
        for r in re_list:  # Lặp qua từng chuỗi trong danh sách loại bỏ
            tmp = remove_words_containing_substring(tmp, r)  # Loại bỏ các từ chứa chuỗi con
        tmp = tmp.strip()  # Loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
        if tmp[-1] == ",":  # Kiểm tra nếu ký tự cuối cùng là dấu phẩy
            tmp = tmp[:-1]
        tmp = tmp.strip()  # Loại bỏ khoảng trắng thừa một lần nữa
        tmp = reformat_spacing(tmp)  # Định dạng lại khoảng cách giữa các từ
        pt_list.append(tmp)  # Thêm tiêu đề đã xử lý vào danh sách mới

    # Gán danh sách tiêu đề đã xử lý vào cột mới 'fixed_title'
    df['fixed_title'] = pt_list

    # Xử lý tiếp với danh sách tiêu đề đã sửa
    t_list = pt_list
    t_list = list(set(t_list))  # Loại bỏ các tiêu đề trùng lặp

    def process_search_volume(volume_str):
        if isinstance(volume_str, str):
            volume_str = volume_str.strip().lower()
            if 'tr+' in volume_str:
                return int(float(volume_str.replace('tr+', '')) * 1_000_000)
            elif 'n+' in volume_str:
                return int(float(volume_str.replace('n+', '')) * 1_000)
            elif '+' in volume_str:
                return int(volume_str.replace('+', ''))
        try:
            return int(volume_str)
        except (ValueError, TypeError):
            return 0 # Or handle as appropriate, e.g., np.nan

    df['Số lượng tìm kiếm'] = df['Số lượng tìm kiếm'].apply(process_search_volume)
    df[['Ngày bắt đầu khảo sát', 'Ngày kết thúc khảo sát']] = df['Thời gian khảo sát'].str.split(' - ', expand=True)

    def reformat_spacing(sentence):
        words = sentence.split()
        # Ghép các từ lại với nhau bằng một khoảng trắng duy nhất
        formatted_sentence = ' '.join(words)  # Đảm bảo khoảng cách giữa các từ nhất quán
        return formatted_sentence

    def remove_words_containing_substring(sentence, substring):
        # Định nghĩa mẫu regex để tìm các từ chứa chuỗi con được chỉ định
        pattern = r'\b\w*' + re.escape(substring) + r'\w*\b'  # Khớp bất kỳ từ nào chứa chuỗi con
        # Thay thế các từ khớp bằng một chuỗi rỗng
        result = re.sub(pattern, '', sentence)  # Loại bỏ tất cả các từ chứa chuỗi con
        # Loại bỏ khoảng trắng thừa có thể còn lại
        result = re.sub(r'\s+', ' ', result).strip()
        return result

    i = 0
    # Chuyển đổi cột 'Tiêu đề bài báo' thành danh sách để xử lý
    t_list = df['Tiêu đề bài báo'].tolist()
    pt_list = []  # Khởi tạo danh sách rỗng để lưu các tiêu đề đã xử lý

    #---------------------------------------------------------------------------------------------------------------
    for t in t_list:  # Lặp qua từng tiêu đề trong danh sách
        re_list = [
            "vs", "và", "của", "bị", "với", "ở", "về", "thành"  # Danh sách các chuỗi cần loại bỏ khỏi tiêu đề
        ]
    #---------------------------------------------------------------------------------------------------------------

        # Chuyển tiêu đề thành chữ thường để xử lý
        tmp = t.lower()
        for r in re_list:  # Lặp qua từng chuỗi trong danh sách loại bỏ
            tmp = remove_words_containing_substring(tmp, r)  # Loại bỏ các từ chứa chuỗi con
        tmp = tmp.strip()  # Loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
        if tmp[-1] == ",":  # Kiểm tra nếu ký tự cuối cùng là dấu phẩy
            tmp = tmp[:-1]
        tmp = tmp.strip()  # Loại bỏ khoảng trắng thừa một lần nữa
        tmp = reformat_spacing(tmp)  # Định dạng lại khoảng cách giữa các từ
        pt_list.append(tmp)  # Thêm tiêu đề đã xử lý vào danh sách mới

    # Gán danh sách tiêu đề đã xử lý vào cột mới 'fixed_title'
    df['fixed_title'] = pt_list

    # Xử lý tiếp với danh sách tiêu đề đã sửa
    t_list = pt_list
    t_list = list(set(t_list))  # Loại bỏ các tiêu đề trùng lặp

    e_list = []
    for t in tqdm(t_list):
        with torch.no_grad():
            word_embeddings = model.encode(t)

        e_list.append(word_embeddings)


    """# Scale and reduce data dimensions"""
    #Tiền xử lý + giảm dữ liệu xuống dạng 2 chiều
    print("Scaling data...")
    scalar = StandardScaler()
    scaled_data = pd.DataFrame(scalar.fit_transform(e_list))
    # scaled_data = pd.DataFrame(e_list)
    print("Done!")

    print("Applying UMAP to reduce dimensions to 2...")
    umap_reducer = umap.UMAP(n_components=2, n_neighbors=15, min_dist=0.1, random_state=0)
    umap_data = umap_reducer.fit_transform(scaled_data)
    dt = pd.DataFrame(umap_data, columns=['UMAP1', 'UMAP2'])
    print("Done!")
    print("Chuẩn hóa dữ liệu thành công!")
    return (dt, t_list, df)

def clustering_data_and_creating_name(dt, t_list, df):
    print("Bắt đầu phân cụm và đặt tên cho cụm")
    """# Clustering Process for Data + Remove Noisy data"""
    # @title Get clustering results from HDBSCAN
    # Create sample data
    np.random.seed(0)
    labels = t_list

    X = dt.values
    clusterer = hdbscan.HDBSCAN(min_cluster_size=6, metric='euclidean')
    y_pred = clusterer.fit_predict(dt.values)
    core_samples_mask = np.zeros_like(y_pred, dtype=bool)
    core_samples_mask[clusterer.probabilities_ > 0.5] = True

    # Number of clusters in labels, ignoring noise if present.
    n_clusters_ = len(set(y_pred)) - (1 if -1 in y_pred else 0)

    dff = dt.rename(columns={'UMAP1': 'x', 'UMAP2': 'y'})
    dff['label'] = labels
    dff['cluster'] = y_pred

    print(f'Estimated number of clusters: {n_clusters_}')
    print(f"Estimated number of noisy examples: {dff['cluster'].value_counts()[-1]}")
    print("Phân cụm dữ liệu thành công!")

    # # @title Tiền xử lý cho Tạo Chủ Đề
    def string_generator(df, cluster_num):
        tmp = df[df['cluster'] == cluster_num]['label'].tolist()
        w_list = []
        for t in tmp:
            for key in t.split(","):
                w_list.append(key)

        w_list = list(set(w_list))

        w_list = random.sample(w_list, min(200, len(w_list)))
        w_str = ""
        for w in w_list[:-1]:
            w_str += w + ","

        w_str += w_list[-1]
        return w_str

    titles = dff['label'].tolist()
    clusters = dff['cluster'].tolist()

    mapping_t2c = {}
    for i in range(len(titles)):
        mapping_t2c[titles[i]] = clusters[i]

    # Thiết lập API key
    API_KEY = "************************"
    API_URL = "https://api.deepseek.com"

    client = OpenAI(
        base_url=API_URL,
        api_key=API_KEY,
    )

    mapping_c2t = {}
    used_topics = {}

    for i in range(n_clusters_):
        w_str = string_generator(dff, i)

        input_text = f"""
    Dưới đây là một danh sách tiêu đề bài báo. Hãy tóm tắt danh sách này thành một chủ đề chính mà bài báo đều liên quan đến:

    {w_str}
    """

        instruction = """
    ### Input:

    Dưới đây là một tiêu đề bài báo. Hãy tóm tắt danh sách này thành một chủ đề chính mà bài báo đều liên quan đến:
    giá vàng hôm nay 811 đảo chiều hồi phục giá vàng ngày 811 vàng miếng và vàng nhẫn đồng loạt tăng 1 triệu đồng/lượng ngay khi mở cửa sau ngày giảm sốc giá vàng hôm nay tăng 1 triệu đồng/lượng

    ### Response:

    Giá vàng
    """

        prompt = f"""
    Bạn sẽ được cung cấp một danh sách các tiêu đề bài báo có nội dung tương tự nhau. Hãy đọc kỹ và **tóm tắt toàn bộ danh sách thành đúng 1 chủ đề duy nhất** mà tất cả các bài báo này đều liên quan đến.

    **Yêu cầu:**
    - Trả lời ngắn gọn bằng 1–3 từ.
    - Chỉ được đưa ra duy nhất 1 câu trả lời (không liệt kê).
    - Tránh đưa nhiều chủ đề khác nhau.

    ### Hướng dẫn:
    {instruction}

    ### Đầu vào:
    {input_text}

    ### Câu trả lời:
    """

        try:
            response = client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "Bạn là một trợ lý AI giúp tạo ra tên chủ đề ngắn gọn."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=50
            )
            topic = response.choices[0].message.content.strip()
        except Exception as e:
            topic = "Lỗi"
            print(f"Cụm {i}: lỗi khi gọi OpenAI API - {e}")

        if topic in used_topics:
            used_topics[topic] += 1
            topic = f"{topic} #{used_topics[topic]}"
        else:
            used_topics[topic] = 1

        mapping_c2t[i] = topic
        print(f"Cụm {i}: {topic} - Số lượng trong cụm: {len(dff[dff['cluster'] == i])}")

    mapping_c2t[-1] = "Nhiễu"

    # @title Save Topic to Dataframe and Save CSV file
    df_topic = [mapping_c2t[mapping_t2c[ftitle]] for ftitle in df['fixed_title'].tolist()]
    df['topic'] = df_topic
    df = df.sort_values(by=['topic'])
    df = df[['Tiêu đề bài báo', 'topic'] + [c for c in df if c not in ['Tiêu đề bài báo', 'topic']]]
    print("Đặt tên cho từng cụm dữ liệu thành công!")
    return df

def save_data(df):
    print("Bắt đầu lưu dữ liệu")
    uri = "mongodb+srv://***:*****@cluster0.89utstf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(uri, server_api=ServerApi('1'))
    db_target = client['mining']
    collection_target = db_target['paper_mining1']

    result = collection_target.delete_many({})
    data = df.to_dict("records")
    collection_target.insert_many(data)
    print("Lưu dữ liệu được mining vào MongoDB thành công!")
    
def main():
    df = read_data()
    dt, t_list, df = preprocess_data(df)
    df = clustering_data_and_creating_name(dt, t_list, df)
    save_data(df)