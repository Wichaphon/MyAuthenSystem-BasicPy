import jwt 
import datetime
from dotenv import load_dotenv
import os

load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET_KEY")

#เอาไว้สร้าง jwt token 
def generate_token(username):
    payload = {
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  #หมดอายุใน1ชม.
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    
    if isinstance(token, bytes): #ไว้แปลง token เป็น string 
        token = token.decode('utf-8')   #PyJWT บางverคืนเป็น byte แล้วตัว jsonify ต้องใช้ str ไม่งั้น error 
    
    return token

#ไว้ถอด JWT token
def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None  #Token หมดอายุ
    except jwt.InvalidTokenError:
        return None  #Token ไม่ถูก