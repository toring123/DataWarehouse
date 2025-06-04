from flask import Flask, request, jsonify
from flask_cors import CORS
from mining import detailed_analysis_each_topic_by_month, detailed_analysis_each_topic, get_records_by_topic, get_list_topic

app = Flask(__name__)
CORS(app)

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