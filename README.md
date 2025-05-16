# 🔐 Fullstack Auth System – NestJS + React + JWT + GCS

This is a secure and scalable fullstack authentication system using:

- 🛠 **Backend**: NestJS + PostgreSQL + JWT + AES Encryption
- 🌐 **Frontend**: React
- ☁️ **Cloud**: Google Cloud Storage for user images
- 🐳 **Environment**: Docker (API + DB)

---

## 🔧 Backend Overview (NestJS)

### 🔐 Authentication Flow

1. **Login API** accepts `username` and `password`.
2. Backend decrypts password (AES-256) and compares.
3. On success:
   - Returns JWT token
   - Returns user info (name, position, image URL)

4. Protected routes (e.g., `/auth/profile`) use a **custom JWT Auth Guard**.

5. JWT expires in **1 hour**.

### 📁 Entity: `users` table

| Field           | Type       |
|----------------|------------|
| username       | string     |
| password       | AES-256 encrypted string |
| myname         | string     |
| myposition     | string     |
| picture        | string (GCS image URL) |
| ...            | ...        |

---

### ☁️ GCS Image Integration

- Admin manually uploads user image to GCS.
- Public access must be enabled for the image file.
- The image URL is stored in the `picture` field.

---

## ⚙️ Running the Backend (via Docker)

```bash
git clone https://github.com/your-username/your-repo.git
cd MyAuthenSystem-BasicPy
git checkout backend-nest

docker-compose up --build