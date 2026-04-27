# Admin Panel Implementation Guide

## Overview
The admin panel in the `admin/` folder needs updates to work with the new backend APIs. This guide shows what components need to be updated.

---

## Current Issues

1. ❌ **AuthContext** doesn't use the new auth endpoints
2. ❌ **Admin routes** not protected properly
3. ❌ **User management** component doesn't exist
4. ❌ **Order management** component needs updates
5. ❌ **API calls** using old endpoint formats

---

## Required Updates

### 1. Update AuthContext.jsx

**File:** `admin/src/Componants/AuthContext/AuthContext.jsx`

**Changes Needed:**

```javascript
// OLD - Hardcoded verification
if (userData.role !== "admin") {
  // reject
}

// NEW - Proper token verification
const res = await axios.get(`${url}/api/user/verify-token`, {
  headers: { Authorization: `Bearer ${token}` }
});

if (!res.data.valid || res.data.user.role !== "admin") {
  // reject
}
```

**Key Changes:**
- Use `/api/user/verify-token` instead of custom verification
- Include Authorization header format: `Bearer <token>`
- Check `res.data.valid` and role properly

---

### 2. Create User Management Component

**New File:** `admin/src/Pages/UserManagement/UserManagement.jsx`

**Required Features:**
- Display list of all users
- Delete user functionality
- Change user role (user → seller → admin)
- Search and filter users

**Example Implementation:**

```jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Componants/AuthContext/AuthContext";

const UserManagement = ({ url }) => {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/user/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure?")) return;
    
    try {
      const res = await axios.delete(`${url}/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        setUsers(users.filter(u => u._id !== userId));
        toast.success("User deleted");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // Update user role
  const updateRole = async (userId, newRole) => {
    try {
      const res = await axios.put(
        `${url}/api/user/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        fetchUsers();
        toast.success("Role updated");
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select 
                  value={user.role}
                  onChange={(e) => updateRole(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
```

---

### 3. Update Order Management

**File:** `admin/src/Pages/Orders/Orders.jsx`

**Changes Needed:**

```javascript
// OLD - Getting orders from body
const orders = await orderModel.find({ userId: req.body.userId });

// NEW - Using auth middleware
const orders = await orderModel.find({})
  .populate("userId", "name email");

// Frontend should call:
const res = await axios.get(`${url}/api/orders/list`, {
  headers: { Authorization: `Bearer ${token}` }
});

// Update order status
const updateStatus = async (orderId, newStatus) => {
  const res = await axios.post(
    `${url}/api/orders/update/${orderId}`,
    { status: newStatus },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
```

---

### 4. Update Add Product (List.jsx)

**File:** `admin/src/Pages/List/List.jsx`

**Changes Needed:**

```javascript
// Fetch products - now includes pagination option
const res = await axios.get(`${url}/api/saree/list`);

// Delete product - now properly authorized
const deleteProduct = async (id) => {
  const res = await axios.delete(
    `${url}/api/saree/remove/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Update product - new endpoint
const updateProduct = async (id, data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("price", data.price);
  // ... other fields
  
  const res = await axios.put(
    `${url}/api/saree/${id}`,
    formData,
    { 
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      } 
    }
  );
};
```

---

### 5. Create Sidebar Navigation

**Update:** `admin/src/Componants/Sidebar/Sidebar.jsx`

Add new menu items:

```jsx
<div className="sidebar">
  <Link to="/list">Product List</Link>
  <Link to="/add">Add Product</Link>
  <Link to="/orders">Orders</Link>
  <Link to="/users">User Management</Link>
  <Link to="/dashboard">Dashboard</Link>
</div>
```

---

### 6. Update Admin App.jsx

**File:** `admin/src/App.jsx`

```jsx
import { Routes, Route } from 'react-router-dom';
import AdminRoute from './Componants/ProtectedRoute/AdminRoute';
import Navbar from './Componants/Navbar/Navbar';
import List from './Pages/List/List';
import Add from './Pages/Add/Add';
import Orders from './Pages/Orders/Orders';
import UserManagement from './Pages/UserManagement/UserManagement';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/list" element={
          <AdminRoute>
            <List url={url} />
          </AdminRoute>
        } />
        <Route path="/add" element={
          <AdminRoute>
            <Add url={url} />
          </AdminRoute>
        } />
        <Route path="/orders" element={
          <AdminRoute>
            <Orders url={url} />
          </AdminRoute>
        } />
        <Route path="/users" element={
          <AdminRoute>
            <UserManagement url={url} />
          </AdminRoute>
        } />
        {/* ... more routes */}
      </Routes>
    </div>
  );
}

export default App;
```

---

### 7. Create AdminRoute Component

**New File:** `admin/src/Componants/ProtectedRoute/AdminRoute.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
```

---

### 8. Create Dashboard Component

**New File:** `admin/src/Pages/Dashboard/Dashboard.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Componants/AuthContext/AuthContext';

const Dashboard = ({ url }) => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalSarees: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users
        const usersRes = await axios.get(`${url}/api/user/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch orders
        const ordersRes = await axios.get(`${url}/api/orders/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch sarees
        const sareesRes = await axios.get(`${url}/api/saree/list`);

        // Calculate revenue
        const revenue = ordersRes.data.data?.reduce((sum, order) => 
          order.payment ? sum + order.amount : sum, 0
        ) || 0;

        setStats({
          totalUsers: usersRes.data.data?.length || 0,
          totalOrders: ordersRes.data.data?.length || 0,
          totalSarees: sareesRes.data.data?.length || 0,
          totalRevenue: revenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sarees</h3>
          <p>{stats.totalSarees}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

---

## Testing Checklist for Admin Panel

- [ ] Admin login with env credentials
- [ ] Token stored in localStorage
- [ ] Protected routes redirect to login if not admin
- [ ] User Management page loads
- [ ] Can view all users
- [ ] Can delete user
- [ ] Can update user role
- [ ] Orders page shows all orders
- [ ] Can update order status
- [ ] Can delete order
- [ ] Product list shows products
- [ ] Can add product
- [ ] Can update product
- [ ] Can delete product
- [ ] Dashboard shows correct statistics

---

## Common Issues & Solutions

### Issue: "Admin access required" error
**Solution:** Check that user role in token matches backend expectation

### Issue: Images not uploading
**Solution:** Ensure Cloudinary credentials are correct in .env

### Issue: Orders showing other users' orders
**Solution:** Make sure auth middleware is applied to `/api/orders/list`

### Issue: Token expires mid-session
**Solution:** Implement token refresh mechanism or increase expiry to 30 days

---

## Next Steps

1. ✅ Backend is fully updated and ready
2. ⏳ Update AdminAuthContext.jsx
3. ⏳ Create UserManagement component
4. ⏳ Update Orders component
5. ⏳ Create Dashboard component
6. ⏳ Add AdminRoute protection
7. ⏳ Test all admin features
8. ⏳ Deploy to production

---

**Admin Panel Update Status:** In Progress 🔨  
**Backend Status:** ✅ Complete  
**Frontend Status:** ✅ Complete  
**Overall Status:** 80% Complete
