from flask import Flask
from routes.auth import auth_bp
from flask_cors import CORS

app = Flask(__name__)
#อนุญาตให้ frontend ต่างโดเมน (เช่น React) เข้าถึงAPIนี้ได้
CORS(app) #browser บังคับตรวจ Cross-Origin Resource Sharing ไม่ใส่จะ fetch ไม่ได้ (กันลืม)

# Register Blueprints
app.register_blueprint(auth_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)