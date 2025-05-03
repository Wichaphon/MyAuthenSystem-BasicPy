from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
import hashlib

SECRET_KEY = 'my_super_secret_key_1234567890abcd'  #ปรับเป็นkeyลับ

def get_cipher_key():
    return hashlib.sha256(SECRET_KEY.encode()).digest()

def encrypt_password(raw_password):
    key = get_cipher_key()
    cipher = AES.new(key, AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(raw_password.encode(), AES.block_size))
    iv = base64.b64encode(cipher.iv).decode('utf-8')
    ct = base64.b64encode(ct_bytes).decode('utf-8')
    return iv + ":" + ct

def decrypt_password(enc_password):
    key = get_cipher_key()
    iv, ct = enc_password.split(":")
    iv = base64.b64decode(iv)
    ct = base64.b64decode(ct)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    pt = unpad(cipher.decrypt(ct), AES.block_size)
    return pt.decode('utf-8')
