from flask import Flask, request, jsonify
from flask_cors import CORS
from dataWarehouse import get_result_cube_3d, get_ds
from mining import detailed_analysis_each_topic_by_month, detailed_analysis_each_topic, get_records_by_topic, get_list_topic

app = Flask(__name__)
CORS(app)

# Data Warehouse
@app.route('/dw', methods=['POST'])
def process_request():
    data = request.get_json()
    cube = data.get('cube')
    dimensions = data.get('dimensions')
    filters = data.get('filters')
    print("Received data:", data) 
    print(f"{cube} - {dimensions} - {filters}")
    
    try:
        if "3d" in cube:
            result = get_result_cube_3d(cube, dimensions, filters)
        elif cube == "":
            result = ""
        return result
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
        
@app.route('/loaikhachhang', methods=['GET'])
def loaikhachhang():
    result = get_ds("Loại Khách Hàng", "banHang_3d")
    return result

@app.route('/mathang', methods=['GET'])
def mathang():
    result = get_ds("Mặt Hàng", "banHang_3d")
    return result

@app.route('/thanhpho', methods=['GET'])
def thanhpho():
    result = get_ds("Thành Phố", "banHang_3d")
    return result

@app.route('/bang', methods=['GET'])
def bang():
    result = get_ds("Bang", "banHang_3d")
    return result

@app.route('/cuahang', methods=['GET'])
def cuahang():
    result = get_ds("Cửa Hàng", "kho_3d")
    return result

@app.route('/thang', methods=['GET'])
def thang():
    result = get_ds("Tháng", "banHang_3d")
    return result

@app.route('/quy', methods=['GET'])
def quy():
    result = get_ds("Quý", "banHang_3d")
    return result

@app.route('/nam', methods=['GET'])
def nam():
    result = get_ds("Năm", "banHang_3d")
    return result


# Mining
@app.route('/topPaperPerTopic', methods=['POST'])
def topPaperPerTopic():
    data = request.get_json()
    top_percent = data.get('top_percent')
    month_A = data.get('month_A')
    month_B = data.get('month_B')
    print("Received data:", data) 
    print(f"{top_percent} - {month_A} - {month_B}")
    
    try:
        result = detailed_analysis_each_topic_by_month(top_percent=top_percent, month_A=month_A, month_B=month_B)
        print(result)
        return result
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
        
@app.route('/paperPerTopic', methods=['GET'])
def paperPerTopic():
    try:
        result = detailed_analysis_each_topic()
        print(result)
        return result
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
        
@app.route('/detailPaperPerTopic', methods=['POST'])
def detailPaperPerTopic():
    data = request.get_json()
    topic = data.get('topic')
    try:
        result = get_records_by_topic(topic)
        print(result)
        return result
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
        
@app.route('/topic', methods=['GET'])
def topic():
    try:
        result = get_list_topic()
        print(result)
        return result
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)