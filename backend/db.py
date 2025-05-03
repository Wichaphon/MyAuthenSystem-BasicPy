import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host="db",                   
        database="auth_db",
        user="admin_user",
        password="lborjgldo_9384kkfgp"
    )
    return conn
