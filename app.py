from flask import Flask, request, jsonify
from flask_cors import CORS
from dataWarehouse import get_result

app = Flask(__name__)
CORS(app)

@app.route('/dw', methods=['POST'])
def process_request():
    data = request.get_json()
    fact = data.get('factTable')
    dimensions = data.get('dimensions')
    filters = data.get('filters')
    print("Received data:", data) 
    

    if not fact or not dimensions or not filters:
        return jsonify({
            "status": "error",
            "message": "Thiếu tham số fact, dimensions hoặc filters"
        }), 400

    try:
        result = get_result(fact, dimensions, filters)
        
        return jsonify({
            "status": "success",
            "result": result
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)