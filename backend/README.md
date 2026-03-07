# Municipal Property Management System - Backend

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection string and JWT secret
```

### 3. Create database
```bash
# Connect to PostgreSQL and run:
psql -U your_user -d your_db -f database/schema.sql
psql -U your_user -d your_db -f database/seed.sql
```

### 4. Start server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## Seed Accounts (password: `password123`)

| Username  | Role     |
|-----------|----------|
| admin     | ADMIN    |
| employee1 | EMPLOYEE |
| citizen1  | CITIZEN  |
| citizen2  | CITIZEN  |

## API Endpoints

| Method | Endpoint                  | Auth   | Role              |
|--------|---------------------------|--------|-------------------|
| POST   | /api/auth/login           | No     | —                 |
| POST   | /api/auth/register        | No     | —                 |
| GET    | /api/properties           | Yes    | All               |
| POST   | /api/properties           | Yes    | EMPLOYEE, ADMIN   |
| PUT    | /api/properties/:id       | Yes    | EMPLOYEE, ADMIN   |
| DELETE | /api/properties/:id       | Yes    | EMPLOYEE, ADMIN   |
| GET    | /api/auctions             | Yes    | All               |
| POST   | /api/auctions             | Yes    | EMPLOYEE, ADMIN   |
| POST   | /api/auctions/:id/bid     | Yes    | CITIZEN            |
| POST   | /api/auctions/:id/close   | Yes    | EMPLOYEE, ADMIN   |
| GET    | /api/invoices             | Yes    | All (filtered)    |
| POST   | /api/invoices/pay         | Yes    | All               |
| GET    | /api/requests             | Yes    | All (filtered)    |
| POST   | /api/requests             | Yes    | CITIZEN            |
| PUT    | /api/requests/:id/approve | Yes    | EMPLOYEE, ADMIN   |
| PUT    | /api/requests/:id/reject  | Yes    | EMPLOYEE, ADMIN   |
| GET    | /api/complaints           | Yes    | All (filtered)    |
| POST   | /api/complaints           | Yes    | CITIZEN            |
| PUT    | /api/complaints/:id/resolve| Yes   | EMPLOYEE, ADMIN   |
| GET    | /api/reviews              | Yes    | All (filtered)    |
| POST   | /api/reviews              | Yes    | CITIZEN            |
| PUT    | /api/reviews/:id/hide     | Yes    | EMPLOYEE, ADMIN   |
| GET    | /api/announcements        | Yes    | All               |
| POST   | /api/announcements        | Yes    | EMPLOYEE, ADMIN   |
| PUT    | /api/announcements/:id    | Yes    | EMPLOYEE, ADMIN   |
| GET    | /api/messages             | Yes    | EMPLOYEE, ADMIN   |
| POST   | /api/messages             | Yes    | EMPLOYEE, ADMIN   |
| PUT    | /api/messages/:id/read    | Yes    | All               |
| GET    | /api/users                | Yes    | ADMIN              |
| PUT    | /api/users/:id            | Yes    | ADMIN              |
| DELETE | /api/users/:id            | Yes    | ADMIN              |
| GET    | /api/statistics/properties| Yes    | ADMIN              |
| GET    | /api/documents            | Yes    | CITIZEN            |
| POST   | /api/documents            | Yes    | CITIZEN            |
| GET    | /api/documents/:id/download| Yes   | CITIZEN            |

## Architecture

```
Clean Architecture: Controllers → Services → Repositories → PostgreSQL (pg)
```

Validation: Zod | Auth: JWT + bcrypt | Files: Multer
