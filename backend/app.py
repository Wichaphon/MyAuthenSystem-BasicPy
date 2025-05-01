from flask import Flask , request , jsonify

app = Flask(__name__)

@app.route('/login' , methods=['POST'])

def login():
    data = request.json
    user = data.get("user")
    password = data.get("password")

    if user == "admin" and password == "1234":
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "fail"}), 401
    
if __name__== "__main__":
    app.run(host="0.0.0.0", port=5000)