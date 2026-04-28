# Order System Bug Fixes - TODO

## Root Causes Identified
1. **API URL Mismatch**: Frontend uses `/api/order/*` (singular) but backend mounts at `/api/orders/*` (plural) → 404
2. **Auth Header Mismatch**: Frontend sends `{ headers: { token } }` but backend expects `Authorization: Bearer <token>` → 401
3. **Wrong HTTP Method**: `MyOrders.jsx` uses POST for `/api/orders/userorders` but route is GET → 405
4. **Missing Auth on Verify**: `Verify.jsx` calls `/verify` without token but route requires authMiddleware → 401
5. **Missing Context Export**: `Cart.jsx` destructures `loadCartData` but `StoreContext.jsx` never exports it → Runtime crash
6. **Schema Type Mismatch**: `orderModel.js` uses `userId: String` but `listOrders` tries `.populate("userId")` which needs ObjectId

## Files to Edit
- [ ] `backend/models/orderModel.js` — Fix userId type to ObjectId
- [ ] `frontend/src/pages/PlaceOrder/PlaceOrder.jsx` — Fix URLs and headers
- [ ] `frontend/src/pages/Verify/Verify.jsx` — Fix URL, add auth header, add try-catch
- [ ] `frontend/src/pages/MyOrders/MyOrders.jsx` — Fix URL, method, headers
- [ ] `frontend/src/Context/StoreContext.jsx` — Export loadCartData
- [ ] `frontend/src/pages/Cart/Cart.jsx` — Remove/loadCartData dependency
