# SpiralReports API Documentation

This document provides detailed information about the SpiralReports API endpoints.

## Authentication

The API uses JWT Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## User APIs

### Authentication

#### Login with Username/Password
- **POST** `/api/auth/user/login`
- **Description**: Authenticate user with username and password
- **Request Body**:
  ```json
  {
    "username": "user.spiralreport@gmail.com",
    "password": "string"
  }
  ```

#### Google Login
- **GET** `/api/auth/user/login/google`
- **Description**: Initiate Google OAuth login flow

#### Google Auth Callback
- **GET** `/api/auth/oauth/google`
- **Description**: Google OAuth callback endpoint

#### Verify OTP Login (2FA)
- **POST** `/api/auth/verify-otp-login`
- **Description**: Verify OTP for two-factor authentication
- **Request Body**:
  ```json
  {
    "userId": "string",
    "otp": "string",
    "type": "EMAIL" | "PHONE",
    "context": "TWOFA" | "VERIFY"
  }
  ```

#### Refresh Token
- **POST** `/api/auth/user/refresh`
- **Description**: Get new access token using refresh token
- **Request Body**:
  ```json
  {
    "userId": "string",
    "refreshToken": "string"
  }
  ```

### User Management

#### Sign Up
- **POST** `/api/users/signup`
- **Description**: Create new user account
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "company": "string",
    "industry": "string",
    "workRole": "string",
    "country": "string",
    "password": "string"
  }
  ```

#### Get Profile
- **GET** `/api/users/profile`
- **Description**: Get current user's profile
- **Authentication**: Required

#### Update Profile
- **PATCH** `/api/users`
- **Description**: Update user profile
- **Authentication**: Required
- **Request Body**: (all fields optional)
  ```json
  {
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "company": "string",
    "industry": "string",
    "workRole": "string",
    "country": "string",
    "password": "string"
  }
  ```

### Password Management

#### Forgot Password
- **POST** `/api/users/forgot-password`
- **Description**: Initiate password reset process
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```

#### Reset Password
- **POST** `/api/users/reset-password`
- **Description**: Reset password using token
- **Request Body**:
  ```json
  {
    "password": "string",
    "token": "string"
  }
  ```

### Email Verification

#### Send Confirmation Email
- **POST** `/api/users/send-confirm-email`
- **Description**: Send email verification link
- **Authentication**: Required

#### Confirm Email
- **POST** `/api/users/confirm-email`
- **Description**: Verify email using token
- **Request Body**:
  ```json
  {
    "token": "string"
  }
  ```

### Assessments

#### List All Assessments
- **GET** `/api/assessments/all`
- **Description**: Get paginated list of assessments
- **Authentication**: Required
- **Query Parameters**:
  - search (optional): Search term
  - page (optional, default: 1): Page number
  - limit (optional, default: 10): Items per page
  - sortBy (optional): Field to sort by
  - orderBy (optional, default: "asc"): Sort order ("asc" or "desc")
  - filter (optional): JSON filter conditions

#### Get Assessment
- **GET** `/api/assessments/{id}`
- **Description**: Get assessment by ID
- **Authentication**: Required
- **Parameters**:
  - id: Assessment ID

#### Get Related Assessments
- **GET** `/api/assessments/related/{id}`
- **Description**: Get related assessments
- **Authentication**: Required
- **Parameters**:
  - id: Assessment ID

### Evaluations

#### Create Evaluation
- **POST** `/api/evaluations/new`
- **Description**: Create new evaluation
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "assessmentId": "string",
    "receipient": "SELF" | "CLIENT",
    "name": "string",
    "compliance": "string",
    "response": [[]],
    "toolsUsed": ["string"]
  }
  ```

#### List Evaluations
- **GET** `/api/evaluations`
- **Description**: Get paginated list of evaluations
- **Authentication**: Required
- **Query Parameters**: Similar to assessments list

#### Get Evaluation
- **GET** `/api/evaluations/{id}`
- **Description**: Get evaluation by ID
- **Authentication**: Required
- **Parameters**:
  - id: Evaluation ID

#### Delete Evaluation
- **DELETE** `/api/evaluations/{id}`
- **Description**: Delete evaluation
- **Authentication**: Required
- **Parameters**:
  - id: Evaluation ID

### Payments

#### Create Checkout Session
- **POST** `/api/payments/checkout`
- **Description**: Create payment checkout session
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "quantity": 0
  }
  ```

### Dashboard

#### Get Dashboard Data
- **GET** `/api/dashboard`
- **Description**: Get user dashboard data
- **Authentication**: Required

## Admin APIs

### Authentication

#### Admin Login
- **POST** `/api/auth/admin/login`
- **Description**: Authenticate admin user
- **Request Body**:
  ```json
  {
    "username": "admin@spiralreports.com",
    "password": "string"
  }
  ```

#### Admin Token Refresh
- **POST** `/api/auth/auth/refresh`
- **Description**: Get new admin access token
- **Request Body**:
  ```json
  {
    "userId": "string",
    "refreshToken": "string"
  }
  ```

### Admin Management

#### Create Admin
- **POST** `/api/admin/create`
- **Description**: Create new admin user
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "email": "string",
    "country": "string",
    "phone": 0,
    "password": "string",
    "status": "ACTIVE" | "INACTIVE" | "NOT VERIFIED"
  }
  ```

#### Get Admin Profile
- **GET** `/api/admin/profile`
- **Description**: Get admin profile
- **Authentication**: Required

### User Management (Admin)

#### List Users
- **GET** `/api/admin/users`
- **Description**: Get list of all users
- **Authentication**: Required

#### Get User
- **GET** `/api/admin/users/{id}`
- **Description**: Get user by ID
- **Authentication**: Required
- **Parameters**:
  - id: User ID

#### Update User Status
- **PATCH** `/api/users/{id}`
- **Description**: Update user status
- **Authentication**: Required
- **Parameters**:
  - id: User ID
- **Request Body**:
  ```json
  {
    "status": "ACTIVE" | "INACTIVE" | "NOT VERIFIED" | "SUSPENDED"
  }
  ```

### Assessment Management

#### Create Assessment
- **POST** `/api/assessments`
- **Description**: Create new assessment
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "tags": ["string"],
    "credReq": 0,
    "levelsReq": 0,
    "questionSet": [{
      "question": "string",
      "options": [{
        "text": "string",
        "level": 0
      }],
      "considerScore": true,
      "maxScore": 0,
      "subdomain": "string"
    }],
    "status": "DRAFT" | "ACTIVE" | "INACTIVE",
    "featured": true,
    "popular": true
  }
  ```

#### Update Assessment
- **PATCH** `/api/assessments/{id}`
- **Description**: Update assessment
- **Authentication**: Required
- **Parameters**:
  - id: Assessment ID
- **Request Body**: Similar to create assessment (all fields optional)

#### Delete Assessment
- **DELETE** `/api/assessments/{id}`
- **Description**: Delete assessment
- **Authentication**: Required
- **Parameters**:
  - id: Assessment ID

### Transaction Management

#### Create Transaction
- **POST** `/api/transactions`
- **Description**: Create new transaction
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "user": "string",
    "credits": 0,
    "trnRef": "string",
    "description": "string"
  }
  ```

#### List Transactions
- **GET** `/api/transactions/all`
- **Description**: Get paginated list of transactions
- **Authentication**: Required
- **Query Parameters**: Similar to assessments list

#### Get Transaction
- **GET** `/api/transactions/{id}`
- **Description**: Get transaction by ID
- **Authentication**: Required
- **Parameters**:
  - id: Transaction ID

#### Update Transaction
- **POST** `/api/transactions/{id}`
- **Description**: Update transaction
- **Parameters**:
  - id: Transaction ID
- **Request Body**:
  ```json
  {
    "user": "string",
    "type": "CREDIT" | "DEBIT",
    "status": "INITIAL" | "PENDING" | "CANCELED" | "COMPLETED",
    "credits": 0,
    "trnRef": "string",
    "description": "string",
    "balance": 0
  }
