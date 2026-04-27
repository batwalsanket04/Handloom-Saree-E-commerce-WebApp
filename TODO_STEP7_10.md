# TODO: Steps 7-10 Implementation

## Step 7: Improve Saree Controller - Validation & Error Handling
- [ ] Fix sareeController.js: ObjectId validation, regex escaping, required image check, pagination
- [ ] Fix sareeRouter.js: Change route guards from authorizeAdmin to authorizeSeller for add/delete

## Step 8: Data Flow Correction
- [ ] Fix server.js: Remove EJS, add global error handler, request size limits
- [ ] Fix orderRoute.js: Remove duplicate POST /userorders
- [ ] Fix orderController.js: Add stock deduction on order placement
- [ ] Fix cartController.js: Validate product exists before adding to cart

## Step 9: Security Improvements
- [ ] Fix auth.js: ObjectId comparison bug in authorizeUser
- [ ] Ensure consistent HTTP status codes across all controllers

## Step 10: Performance & Clean Code
- [ ] Fix StoreContext.jsx: Add url dependency, clean data flow
- [ ] Add MongoDB indexes to sareeModel.js, userModel.js, orderModel.js

