from flask import Flask, request, jsonify
from flask_cors import CORS
from dataWarehouse import get_result

app = Flask(__name__)
CORS(app)

@app.route('/dw', methods=['POST'])
def process_request():
    data = request.get_json()
    fact = data.get('fact')
    dimensions = data.get('dimensions')
    filters = data.get('filters')
    print("Received data:", data) 
    print(f"{fact} - {dimensions} - {filters}")
    
    try:
        result = get_result(fact, dimensions, filters)
        print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
        

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)