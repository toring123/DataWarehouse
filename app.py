from flask import Flask, request, jsonify
from dataWarehouse import get_result

app = Flask(__name__)

@app.route('/dw', methods=['GET'])
def process_request():
    fact = request.args.get('fact')
    dimensions = request.args.getlist('dimensions')
    filters = request.args.getlist('filters')

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