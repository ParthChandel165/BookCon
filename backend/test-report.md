# BookCon Test Report

**Date:** 5/5/2025, 12:41:41 AM

## Summary

- Total Tests: 13
- Passed: 13
- Failed: 0

## Test Results

### __tests__/controllers/product.test.js

Status: ✅ Passed

| Test | Status | Duration (ms) |
|------|--------|-------------|
| should return products for a specific shop | ✅ Passed | 6.00 |
| should calculate genre distribution correctly | ✅ Passed | 2.00 |
| should create a product with valid shop | ✅ Passed | 1.00 |

### __tests__/controllers/order.test.js

Status: ✅ Passed

| Test | Status | Duration (ms) |
|------|--------|-------------|
| should create orders grouped by shop | ✅ Passed | 11.00 |
| should update seller balance on delivery | ✅ Passed | 2.00 |

### __tests__/middleware/auth.test.js

Status: ✅ Passed

| Test | Status | Duration (ms) |
|------|--------|-------------|
| should call next with error if no token is present | ✅ Passed | 12.00 |
| should set req.user and call next if token is valid | ✅ Passed | 3.00 |
| should verify seller authentication | ✅ Passed | 1.00 |
| should verify admin role | ✅ Passed | 1.00 |
| should reject non-admin users | ✅ Passed | 1.00 |

### __tests__/models/user.test.js

Status: ✅ Passed

| Test | Status | Duration (ms) |
|------|--------|-------------|
| should create a user successfully | ✅ Passed | 178.00 |
| should fail validation for missing required fields | ✅ Passed | 9.00 |
| should not allow duplicate emails | ✅ Passed | 170.00 |

