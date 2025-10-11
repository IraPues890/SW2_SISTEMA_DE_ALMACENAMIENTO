# 📮 Pruebas Simples para Postman

## ⚙️ Configuración Base
- **Collection Name:** UlStorage Auth
- **Base URL:** `http://localhost:3000/auth`

---

## 1. **LOGIN ADMIN**
- **Method:** POST
- **URL:** `http://localhost:3000/auth/login`
- **Body (raw JSON):**
```json
{
  "email": "admin@interbank.pe",
  "password": "UlStorage2025!"
}
```

---

## 2. **LOGIN USER**
- **Method:** POST  
- **URL:** `http://localhost:3000/auth/login`
- **Body (raw JSON):**
```json
{
  "email": "sandra.vega@interbank.pe",
  "password": "UlStorage2025!"
}
```

---

## 3. **REGISTER USER**
- **Method:** POST
- **URL:** `http://localhost:3000/auth/register`
- **Body (raw JSON):**
```json
{
  "nombre": "Test User",
  "email": "test@example.com",
  "password": "Test123456!"
}
```

---

## 4. **GET PROFILE**
- **Method:** GET
- **URL:** `http://localhost:3000/auth/profile/1`

---

## 5. **UPDATE PROFILE**
- **Method:** PUT
- **URL:** `http://localhost:3000/auth/profile/1`
- **Body (raw JSON):**
```json
{
  "nombre": "Updated Name",
  "telefono": "+51999888777"
}
```

---

## 6. **DELETE USER**
- **Method:** DELETE
- **URL:** `http://localhost:3000/auth/profile/11`

---

## 7. **LOGOUT**
- **Method:** POST
- **URL:** `http://localhost:3000/auth/logout`

---

## 8. **GET ALL USERS**
- **Method:** GET
- **URL:** `http://localhost:3000/auth/users`

---

## 9. **FILTER USERS (ADMIN)**
- **Method:** GET
- **URL:** `http://localhost:3000/auth/users?rol=admin`

---

## 10. **FILTER USERS (ACTIVE)**
- **Method:** GET
- **URL:** `http://localhost:3000/auth/users?activo=true`

---

## 11. **TOGGLE USER STATUS**
- **Method:** PUT
- **URL:** `http://localhost:3000/auth/users/5/status`

---

## 12. **CHANGE USER ROLE**
- **Method:** PUT
- **URL:** `http://localhost:3000/auth/users/4/role`
- **Body (raw JSON):**
```json
{
  "rol": "admin"
}
```

---

## 🔴 ERROR TESTS

## 13. **LOGIN INVALID**
- **Method:** POST
- **URL:** `http://localhost:3000/auth/login`
- **Body (raw JSON):**
```json
{
  "email": "admin@interbank.pe",
  "password": "wrong-password"
}
```

---

## 14. **REGISTER INVALID**
- **Method:** POST
- **URL:** `http://localhost:3000/auth/register`
- **Body (raw JSON):**
```json
{
  "nombre": "",
  "email": "invalid-email",
  "password": "123"
}
```

---

## 15. **USER NOT FOUND**
- **Method:** GET
- **URL:** `http://localhost:3000/auth/profile/999`

---

## ✅ Expected Results

### Success Responses:
- **200:** OK (login, get, update, logout)
- **201:** Created (register)

### Error Responses:
- **400:** Bad Request (invalid data)
- **401:** Unauthorized (wrong credentials)
- **404:** Not Found (user doesn't exist)
- **409:** Conflict (email already exists)

### All responses should have:
```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... }  // only on success
}
```

---

## 🚀 Quick Test Order

1. **Login Admin** → Should return user with rol: "admin"
2. **Get All Users** → Should return list of users
3. **Register User** → Should create new user
4. **Login New User** → Should login with new credentials
5. **Update Profile** → Should update user data
6. **Change Role** → Should change user to admin
7. **Toggle Status** → Should activate/deactivate user
8. **Delete User** → Should deactivate user
9. **Logout** → Should logout successfully

## 📝 Notes
- All requests use `Content-Type: application/json` header
- Server must be running on `http://localhost:3000`
- Database must have seeder data loaded
- Check console for detailed error messages