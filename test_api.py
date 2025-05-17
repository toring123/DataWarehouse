import unittest
import json
from app import app

# Giả lập get_result để test
def mock_get_result(fact, dimensions, filters):
    return {
        "fact": fact,
        "dimensions": dimensions,
        "filters": filters,
        "data": [100, 200, 300]
    }

# Gán giả lập
import app
app.get_result = mock_get_result

class DataWarehouseApiTest(unittest.TestCase):

    def setUp(self):
        self.client = app.app.test_client()

    def test_success_case(self):
        payload = {
            "fact": "banHang",
            "dimensions": ["Thành Phố", "Bang", "Khách Hàng", "Tháng", "Mặt Hàng"],
            "filters": ["nam=2023"]
        }
        response = self.client.post('/dw',
                                    data=json.dumps(payload),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertEqual(json_data["status"], "success")
        self.assertIn("result", json_data)

    def test_missing_parameters(self):
        payload = {
            "fact": "doanh_thu",
            "dimensions": [],  # thiếu filters
        }
        response = self.client.post('/dw',
                                    data=json.dumps(payload),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)
        json_data = response.get_json()
        self.assertEqual(json_data["status"], "error")

if __name__ == '__main__':
    unittest.main()
