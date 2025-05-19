from flask import Flask, request, jsonify
from flask_cors import CORS
from dataWarehouse import get_result_cube_3d, get_ds

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)