# API DOCUMENTATION

## Base URL
- **Development**: `http://localhost:4000`
- **Production**: `https://your-api-domain.com`

---

## Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

Get token by logging in via `/api/user/login` or `/api/user/register`

---

## User Authentication Endpoints

### 1. Register User
**POST** `/api/user/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 2. Login User
**POST** `/api/user/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 3. Admin Login
**POST** `/api/user/admin-login`

**Request Body:**
```json
{
  "email": "admin@paithani.com",
  "password": "AdminPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "admin",
    "name": "Admin",
    "email": "admin@paithani.com",
    "role": "admin"
  }
}
```

---

### 4. Get User Profile
**GET** `/api/user/profile`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "9876543210",
    "address": "123 Main St"
  }
}
```

---

### 5. Verify Token
**GET** `/api/user/verify-token`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "valid": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## User Management Endpoints (Admin Only)

### 6. Get All Users
**GET** `/api/user/list`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 7. Delete User
**DELETE** `/api/user/:userId`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 8. Update User Role
**PUT** `/api/user/:userId/role`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "role": "seller"
}
```

**Valid Roles:** `user`, `seller`, `admin`

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "role": "seller"
  }
}
```

---

## Saree/Product Endpoints

### 9. List All Sarees
**GET** `/api/saree/list`

**Query Parameters (Optional):**
```
?category=Banarasi
?minPrice=1000
?maxPrice=5000
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Banarasi Silk Saree",
      "description": "Beautiful handwoven saree",
      "price": 3500,
      "category": "Banarasi",
      "image": "https://cloudinary.com/...",
      "stock": 50,
      "createdAt": "2024-01-10T10:30:00Z"
    }
  ]
}
```

---

### 10. Get Saree Details
**GET** `/api/saree/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Banarasi Silk Saree",
    "description": "Beautiful handwoven saree",
    "price": 3500,
    "category": "Banarasi",
    "image": "https://cloudinary.com/...",
    "stock": 50,
    "sellerId": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Seller Name",
      "email": "seller@example.com"
    }
  }
}
```

---

### 11. Search Sarees
**GET** `/api/saree/search`

**Query Parameters:**
```
?q=banarasi silk
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Banarasi Silk Saree",
      "price": 3500,
      "category": "Banarasi",
      "image": "https://cloudinary.com/..."
    }
  ]
}
```

---

### 12. Get Related Sarees
**GET** `/api/saree/related/:id`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Another Banarasi Saree",
      "price": 4000,
      "category": "Banarasi"
    }
  ]
}
```

---

### 13. Add Saree (Admin Only)
**POST** `/api/saree/add`

**Headers Required:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
- name: "Banarasi Silk Saree"
- description: "Beautiful handwoven saree"
- price: 3500
- category: "Banarasi"
- stock: 50
- image: <file>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Saree added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Banarasi Silk Saree",
    "price": 3500,
    "image": "https://cloudinary.com/..."
  }
}
```

---

### 14. Update Saree (Seller/Admin)
**PUT** `/api/saree/:id`

**Headers Required:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
- name: "Updated Saree Name"
- price: 4000
- stock: 75
- image: <file> (optional)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Saree updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Updated Saree Name",
    "price": 4000
  }
}
```

---

### 15. Delete Saree (Admin Only)
**DELETE** `/api/saree/remove/:id`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Saree deleted successfully"
}
```

---

## Cart Endpoints

### 16. Get Cart
**POST** `/api/cart/get`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "cartData": {
    "507f1f77bcf86cd799439012": 2,
    "507f1f77bcf86cd799439013": 1
  }
}
```

---

### 17. Add to Cart
**POST** `/api/cart/add`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "id": "507f1f77bcf86cd799439012"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Added to cart",
  "cartData": {
    "507f1f77bcf86cd799439012": 3
  }
}
```

---

### 18. Remove from Cart
**POST** `/api/cart/remove`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "id": "507f1f77bcf86cd799439012"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Removed from cart",
  "cartData": {
    "507f1f77bcf86cd799439012": 2
  }
}
```

---

## Order Endpoints

### 19. Place Order (Stripe)
**POST** `/api/orders/place`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Banarasi Silk Saree",
      "price": 3500,
      "quantity": 2
    }
  ],
  "amount": 7000,
  "address": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipcode": "400001",
    "country": "India"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "session_url": "https://checkout.stripe.com/...",
  "orderId": "507f1f77bcf86cd799439014"
}
```

---

### 20. Place Order (Cash on Delivery)
**POST** `/api/orders/cod`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [...],
  "amount": 7000,
  "address": {...}
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "COD order placed successfully",
  "orderId": "507f1f77bcf86cd799439014"
}
```

---

### 21. Verify Payment
**POST** `/api/orders/verify`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439014",
  "success": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified"
}
```

---

### 22. Get User Orders
**GET** `/api/orders/userorders` or **POST** `/api/orders/userorders`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "items": [...],
      "amount": 7180,
      "status": "Order Processing",
      "payment": true,
      "paymentMethod": "stripe",
      "date": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 23. Get All Orders (Admin Only)
**GET** `/api/orders/list`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "status": "Order Processing"
    }
  ]
}
```

---

### 24. Update Order Status (Admin Only)
**POST** `/api/orders/update/:orderId`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "Out for Delivery"
}
```

**Valid Statuses:** `Pending`, `Order Processing`, `Out for Delivery`, `Delivered`, `Cancelled`

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated"
}
```

---

### 25. Delete Order (Admin Only)
**DELETE** `/api/orders/:orderId`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

---

## Wishlist Endpoints

### 26. Get Wishlist
**GET** `/api/wishlist/`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "wishlist": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Banarasi Silk Saree",
      "price": 3500,
      "image": "https://cloudinary.com/..."
    }
  ]
}
```

---

### 27. Add to Wishlist
**POST** `/api/wishlist/add`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sareeId": "507f1f77bcf86cd799439012"
}
```

**Response (200):**
```json
{
  "success": true,
  "wishlist": [...]
}
```

---

### 28. Remove from Wishlist
**POST** `/api/wishlist/remove`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sareeId": "507f1f77bcf86cd799439012"
}
```

**Response (200):**
```json
{
  "success": true,
  "wishlist": [...]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized - No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error during login"
}
```

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## Rate Limiting (Future Implementation)

The following endpoints have rate limiting (to be implemented):
- `/api/user/login` - 5 requests per 15 minutes
- `/api/user/register` - 3 requests per hour
- `/api/saree/search` - 30 requests per minute

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:4000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Password123"}'

# Login
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'

# Get Profile
curl -X GET http://localhost:4000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# List Sarees
curl -X GET http://localhost:4000/api/saree/list

# Search Sarees
curl -X GET "http://localhost:4000/api/saree/search?q=banarasi"
```

---

**Documentation Version:** 1.0  
**Last Updated:** January 2024
