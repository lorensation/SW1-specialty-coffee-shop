# Royal Coffee - Backend API (Simplified)

Lightweight, production-ready backend for Royal Coffee specialty coffee shop.

## 🎯 Features

### Core Functionality
- ✅ **User Authentication** - Registration, login, logout with cookie-based sessions
- ✅ **Role-Based Access Control** - User and Admin roles
- ✅ **Product Catalog** - Full CRUD for coffee products with categories
- ✅ **Reservations** - Table booking system with availability checking
- ✅ **Email Notifications** - Welcome emails for new users
- ✅ **User Profiles** - Basic profile management
- ✅ **Admin Panel** - Product, reservation, and user management

### Technical Features
- 🔐 Secure authentication with bcrypt password hashing (10 rounds)
- 🍪 Simple cookie-based session management (no JWT)
- 📧 Transactional email with Nodemailer
- 🛡️ Input validation with express-validator
- 🔒 Security headers with Helmet
- 📊 Supabase PostgreSQL database
- 🎨 Clean MVC architecture
- ⚠️ Centralized error handling
- 📝 Request logging with Morgan
- 🚀 Ready for production deployment

## 📁 Project Structure

```
backend/
├── config/
│   ├── config.js          # App configuration
│   └── database.js        # Supabase client setup
├── controllers/
│   ├── authController.js  # Auth endpoints (register, login, logout, me)
│   ├── userController.js  # User management
│   ├── productController.js
│   └── reservationController.js
├── middlewares/
│   ├── auth.js            # Cookie-based authentication
│   ├── errorHandler.js    # Error handling
│   ├── validate.js        # Validation middleware
│   └── validators.js      # Validation schemas
├── models/
│   ├── User.js            # User model
│   ├── Session.js         # Session model (cookie tokens)
│   ├── Product.js         # Product model
│   └── Reservation.js     # Reservation model
├── routes/
│   ├── index.js           # Route aggregator
│   ├── authRoutes.js      # Auth routes
│   ├── userRoutes.js      # User routes
│   ├── productRoutes.js   # Product routes
│   └── reservationRoutes.js # Reservation routes
├── services/
│   ├── authService.js     # Authentication logic (no JWT)
│   └── emailService.js    # Email sending
├── database/
│   ├── schema.sql         # Database schema (4 tables)
│   └── seed.sql           # Sample data
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── server.js              # Express app entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Supabase account
- Gmail account for email (or other SMTP service)

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Supabase Database**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor
   - Run `database/schema.sql` to create tables
   - Run `database/seed.sql` to populate sample data

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Cookie Configuration
COOKIE_SECRET=your_cookie_secret_change_this_in_production

# Email Configuration (Optional - for welcome emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=Royal Coffee <noreply@royalcoffee.com>

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

5. **Start the server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Logout
```http
POST /api/auth/logout
Cookie: session_token={token}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: session_token={token}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=20&category=origen
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Get Products by Category
```http
GET /api/products/category/origen
```

#### Get Featured Products
```http
GET /api/products/featured?limit=6
```

#### Create Product (Admin)
```http
POST /api/products
Cookie: session_token={admin_token}
Content-Type: application/json

{
  "name": "Ethiopia Yirgacheffe",
  "description": "Floral and citrus notes",
  "price": 8.50,
  "category": "origen",
  "origin": "Ethiopia",
  "tasting_notes": "Floral, citric",
  "stock_quantity": 50,
  "is_active": true,
  "is_featured": true
}
```

### Reservation Endpoints

#### Create Reservation
```http
POST /api/reservations
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+34 600 000 000",
  "num_people": 2,
  "reservation_date": "2025-12-25",
  "reservation_time": "19:00",
  "message": "Window table please"
}
```

#### Get My Reservations
```http
GET /api/reservations/user/me
Cookie: session_token={token}
```

#### Check Availability
```http
GET /api/reservations/availability?date=2025-12-25&time=19:00
```

#### Update Reservation Status (Admin)
```http
PATCH /api/reservations/:id/status
Cookie: session_token={admin_token}
Content-Type: application/json

{
  "status": "confirmed",
  "admin_notes": "VIP table reserved"
}
```

### User Endpoints

#### Get Profile
```http
GET /api/users/profile
Cookie: session_token={token}
```

#### Update Profile
```http
PUT /api/users/profile
Cookie: session_token={token}
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

#### Get All Users (Admin)
```http
GET /api/users?page=1&limit=20&role=user
Cookie: session_token={admin_token}
```

#### Update User (Admin)
```http
PUT /api/users/:id
Cookie: session_token={admin_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "admin",
  "is_active": true
}
```

#### Delete User (Admin)
```http
DELETE /api/users/:id
Cookie: session_token={admin_token}
```

## 🔐 Authentication

The API uses simple cookie-based session management (no JWT):

1. **Register/Login** → Server creates session in database → Returns HTTP-only cookie
2. **Protected Routes** → Cookie sent automatically → Server validates session
3. **Logout** → Server deletes session → Cookie cleared

### Session Details
- Sessions stored in database (not JWT tokens)
- HTTP-only cookies for security
- 7-day expiration
- Automatic cleanup of expired sessions

## 👥 User Roles

### Public (No Login)
- Browse products
- View product details
- Create reservations (with email)
- Check reservation availability

### User (Registered)
- All public permissions
- Access own profile
- View own reservations
- Update profile information

### Admin
- All User permissions
- Manage products (CRUD)
- Manage all reservations
- Manage users (view, update, delete)
- Access admin endpoints

## 📧 Email Configuration

### Gmail Setup
1. Enable 2FA on your Google account
2. Generate App Password: Google Account > Security > App Passwords
3. Use App Password in `EMAIL_PASS` environment variable

### Email Templates
- Welcome email on registration (simple greeting)

## 🛡️ Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Cookie-based session authentication
- ✅ HTTP-only secure cookies
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation and sanitization
- ✅ SQL injection protection (Supabase prepared statements)
- ✅ XSS protection
- ✅ Role-based access control
- ✅ Session expiration (7 days)

## 🗄️ Database Schema

### Tables (4 total)
- `users` - User accounts (id, email, password_hash, name, role, is_active)
- `sessions` - Active sessions (id, user_id, session_token, expires_at)
- `products` - Coffee products (id, name, description, price, category, origin, tasting_notes, stock, etc.)
- `reservations` - Table bookings (id, user_id, name, email, phone, num_people, date, time, status)

See `database/schema.sql` for complete schema with indexes and triggers.

## 🚀 Production Deployment

### Environment Variables
Update these for production:
- Use strong random secret for `COOKIE_SECRET` (min 32 characters)
- Set `NODE_ENV=production`
- Configure production email service (optional)
- Update `FRONTEND_URL` to production domain
- Cookies automatically set to `secure` in production

### Database
- Backup Supabase database regularly
- Monitor query performance
- Sessions auto-cleanup on validation

### Server
- Use process manager (PM2)
- Set up HTTPS/SSL
- Configure reverse proxy (Nginx)
- Enable logging
- Set up monitoring

### Recommended Services
- **Hosting**: Render, Railway, Fly.io, AWS, Digital Ocean
- **Database**: Supabase (included)
- **Email**: SendGrid, AWS SES, Mailgun
- **Monitoring**: Sentry, LogRocket

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🧪 Testing

```bash
# Install development dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 📄 License

ISC

## 👨‍💻 Development

Built with:
- Node.js & Express.js
- Supabase (PostgreSQL)
- Cookie-based sessions (no JWT)
- Nodemailer for emails
- bcryptjs for password hashing
- express-validator for validation

## 🔗 Related Links

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Royal Coffee** - Premium Specialty Coffee Shop 
