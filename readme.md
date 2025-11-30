# SE4458 Midterm Project — Bill Management System

## Overview

This project implements the _Bill Management Backend System_ required by the **SE4458 Midterm (Group 1)** assignment.  
The backend exposes RESTful APIs used by:

- Mobile Provider Application
- Banking Application
- Website
- Admin Panel

The system includes versioning, authentication, rate limiting, paging, logging, and Azure deployment as specified in the assignment PDF.

## Tech Stack

- Node.js (20 LTS)
- Express.js
- Prisma ORM (v5)
- PostgreSQL (Azure PostgreSQL Flexible Server)
- Typescript
- Swagger UI
- JSON Web Token (JWT) Authentication
- Azure App Service Deployment

## Github Repo

[https://github.com/laraozduman/SE4458_Midterm](https://github.com/laraozduman/SE4458_Midterm)

## Presentation Video

https://drive.google.com/file/d/1KZ-ZMN1IFZrFmfFoLOeH_peLdP_fGsfg/view?usp=sharing

## Database Schema (Prisma)

```prisma
model Bill {
  id           Int      @id @default(autoincrement())
  subscriberNo String
  month        String
  billTotal    Float
  paidAmount   Float    @default(0)
  paidStatus   Boolean  @default(false)
  details      Json?
}

model Admin {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  role      String   @default("admin")
  createdAt DateTime @default(now())
}

model User {
  id           Int      @id @default(autoincrement())
  subscriberNo String   @unique
  role         String   @default("user")
  createdAt    DateTime @default(now())
}
```

## Authentication Rules

| Client                        | Authentication Required |
| ----------------------------- | ----------------------- |
| Mobile Provider Query Bill    | Yes (JWT)               |
| Mobile Provider Bill Detailed | Yes (JWT)               |
| Banking App Unpaid Bill Query | Yes (JWT)               |
| Website Pay Bill              | No                      |
| Admin Add Bill                | Yes (JWT)               |
| Admin Batch Upload            | Yes (JWT)               |

JWT tokens are issued via:

```
POST /api/v1/admin/login
```

```
POST /api/v1/user/login
```

## Rate Limiting

The assignment requires:

- Mobile Provider Application for get bill may perform a maximum of **3 queries per subscriber per day**.

This is implemented using _express-rate-limit_ with a custom key based on `subscriberNo`.

## Paging Support

Required for detailed bill queries.

Implemented as:

```
GET /api/v1/bills/detailed?subscriberNo=111&limit=1&page=1&month=2024-01
```

## Logging (Gateway-Level Logging)

A custom middleware logs:

### Request Log Includes:

- Timestamp
- Method
- Full path
- Client IP
- Request headers
- Request body size

### Response Log Includes:

- Status code
- Latency (milliseconds)
- Response size

Logs appear inside Azure App Service Log Stream.

## Swagger Documentation

Swagger UI is available at:

```
https://se4458-webapp-c9bhapdya4esc8hr.francecentral-01.azurewebsites.net/swagger/#/
```

It includes all endpoints, authentication support, and example requests.

## Deployment

The backend is deployed on **Azure App Service (Linux)**.

Configuration:

- Node 20 runtime
- Oryx build system
- Environment variables stored in App Service Configuration
- Prisma connected to Azure PostgreSQL

### Deployment URL

```
https://se4458-webapp-c9bhapdya4esc8hr.francecentral-01.azurewebsites.net
```

## Running the Project Locally

### 1. Install dependencies

```
npm install
```

### 2. Generate Prisma Client

```
npx prisma generate
```

### 3. Run Database Migrations

```
npx prisma migrate dev
```

### 4. Start Development Server

```
npm run dev
```

## Environment Variables (.env)

```
DATABASE_URL="postgresql://username:password@host:5432/db"
JWT_SECRET="your_secret"
PORT=8080
```

Production variables are stored in Azure App Service Configuration.

## CSV Batch Upload

Admins may upload multiple bills using:

```
POST /api/v1/admin/bill/batch
```

Request type: multipart/form-data  
Field name: file

CSV format:

```
subscriberNo,month,billTotal
```

## Key Endpoints

### Admin Endpoints

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| POST   | /api/v1/admin/add   | Add a single bill |
| POST   | /api/v1/admin/batch | Batch CSV upload  |

### Website Endpoints

| Method | Endpoint    | Description |
| ------ | ----------- | ----------- |
| POST   | /api/v1/pay | Pay bill    |

### Mobile Provider Endpoints

| Method | Endpoint              | Paging | Rate Limit | Description        |
| ------ | --------------------- | ------ | ---------- | ------------------ |
| GET    | /api/v1/bill          | No     | Yes        | Basic bill info    |
| GET    | /api/v1/bill/detailed | Yes    | No         | Detailed bill info |

### Banking App Endpoints

| Method | Endpoint            | Description      |
| ------ | ------------------- | ---------------- |
| GET    | /api/v1/bill/unpaid | Get unpaid bills |

### Auth Endpoints

| Method | Endpoint                 | Description |
| ------ | ------------------------ | ----------- |
| POST   | /api/v1/auth/admin/login | Admin login |
| POST   | /api/v1/auth/user/login  | User login  |

## Final Requirement Checklist

| Requirement              | Status    |
| ------------------------ | --------- |
| CRUD operations          | Completed |
| Authentication rules     | Completed |
| Paging                   | Completed |
| Rate limiting            | Completed |
| Logging (gateway-style)  | Completed |
| Swagger documentation    | Completed |
| Cloud deployment (Azure) | Completed |
| Versioning (/v1)         | Completed |
| CSV batch upload         | Completed |
| Error handling           | Completed |

## System Assumptions

1. Admin accounts are predefined and not created through the API.

- Since the midterm specification does not require an admin registration flow, it is assumed that admin users are created manually (seed file / database insert).

- Therefore, no public endpoint such as /registerAdmin was implemented for security reasons.

2. Subscriber (User) records already exist in an external system.

- The project description does not define a user-registration workflow.

- Because of this, the backend assumes that subscriber accounts are managed by the Mobile Provider’s internal system.

- Only bill-related operations are handled here, and no /register/user route exists.

3. Uploaded CSV files follow the correct format.

- CSV validation is implemented at a basic level (required fields), assuming that the admin panel produces valid files.

- Deep validation (schema mismatch detection, malformed rows, etc.) was not necessary per assignment scope.

## Challenges Faced During Development

1. Prisma v7 Migration Issues

- Prisma v7 introduced major breaking changes (removal of url in schema, new prisma.config.ts requirement, adapter system, etc.).

- This caused multiple schema validation errors and client initialization failures until the correct Prisma v7 configuration was applied.

2. Azure Deployment Node Version Mismatch

- Azure App Service attempted to use Node 24 by default, which caused repeated runtime failures.

- The solution required manually forcing Node 20 via Application Settings → WEBSITE_NODE_DEFAULT_VERSION.

3. ZIP Deploy Not Installing Dependencies Correctly

- Some deployments produced the error: "Cannot find module 'express'", despite it being installed locally.

- The fix was to create a new webapp and to zip upload for deployment

4. Silent Startup (No Logs Appearing)

- When a custom startup command was incorrectly configured, Azure suppressed log streaming.

- Removing the startup script and redeploying restored the log output.

## Authour

Lara Özudman

- SE4458 - Software Construction
- Yaşar University
- Deployed on Azure
- GitHub: https://github.com/laraozduman
