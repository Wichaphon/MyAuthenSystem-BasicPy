from flask import Blueprint, request, jsonify
from crypto import decrypt_password
from db import get_db_connection
from jwt_utils import generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT password, myname, myposition, picture FROM users WHERE username = %s", (username,))
        result = cur.fetchone() #ถ้าไม่เจอจะเป็น None

        cur.close()
        conn.close()


        if result is None:
            print('User not found')
            return jsonify({ "status": "fail", "message": "user not found" }), 401

        stored_password, myname, myposition, picture = result
        
        #ถอดรหัส
        try:
            decrypted_password = decrypt_password(stored_password)
            # print(f"Decrypted password: {decrypted_password}")
        except Exception as e:
            return jsonify({ "status": "fail", "message": "decryption failed" }), 500

        if str(password).strip() == str(decrypted_password).strip():
            token = generate_token(username) #loginเสร็จ สร้างtoken
            return jsonify({
                "status": "success",
                "token": token,
                "data": {
                    "myname": myname,
                    "myposition": myposition,
                    "picture": picture
                }
            })
        else:
            return jsonify({ "status": "fail", "message": "incorrect password" }), 401

    except Exception as e:
        return jsonify({ "status": "error", "message": str(e) }), 500
