# 🗺️ Royal Coffee - Development Roadmap

## 📋 Project Overview

**Current State:** The project has a React frontend with hardcoded data and a Node.js + Express backend with Supabase integration. They are currently **NOT connected**.

**Main Goal:** Connect the frontend with the backend to create a fully functional full-stack specialty coffee shop web application.

---

## 🔄 Git Workflow & Branch Strategy

### Team Collaboration Guidelines (4-5 Students)

#### Branch Structure
```
main
├── develop (integration branch)
├── feature/auth-integration
├── feature/menu-integration
├── feature/booking-integration
├── feature/cart-checkout
└── feature/ui-improvements
```

#### Workflow Steps

1. **Never work directly on `main`**
   - `main` = production-ready code only
   - Protected branch (require pull request reviews)

2. **Use `develop` as integration branch**
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

3. **Create feature branches from `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

4. **Work on your feature**
   ```bash
   # Make changes
   git add .
   git commit -m "feat: descriptive message"
   git push -u origin feature/your-feature-name
   ```

5. **Create Pull Request to `develop`**
   - Open PR on GitHub: `feature/your-feature-name` → `develop`
   - Request review from at least 1 teammate
   - Resolve any merge conflicts
   - Merge after approval

6. **Periodically merge `develop` → `main`**
   - After major milestones
   - When features are tested and stable
   - Create release tags (v1.0.0, v1.1.0, etc.)

#### Commit Message Convention
```
feat: add product API integration to Menu page
fix: resolve CORS issue in authentication
refactor: extract API calls to service layer
docs: update README with setup instructions
style: format code with prettier
test: add unit tests for cart context
```

#### Daily Workflow
```bash
# Start of day - sync with team
git checkout develop
git pull origin develop
git checkout your-feature-branch
git merge develop  # Get latest changes

# End of day - push your work
git add .
git commit -m "feat: your progress"
git push origin your-feature-branch
```

---

## 🎯 Implementation Phases

### **Phase 1: Setup & Configuration** (Week 1)
**Goal:** Prepare the environment and establish API communication

#### Tasks:

**1.1 Environment Configuration** 🔧
- **Assignee:** Student 1
- **Branch:** `feature/environment-setup`
- **Priority:** HIGH
- **Estimated Time:** 4 hours

**Tasks:**
- [ ] Create `.env` file in client with backend API URL
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```
- [ ] Verify backend `.env` configuration (Supabase credentials)
- [ ] Test backend server startup (`npm run dev` in server/)
- [ ] Test frontend startup (`npm run dev` in client/)
- [ ] Document setup process in README.md

**Deliverable:** Both frontend and backend running simultaneously

---

**1.2 API Service Layer** 🌐
- **Assignee:** Student 2
- **Branch:** `feature/api-service-layer`
- **Priority:** HIGH
- **Estimated Time:** 6 hours

**Tasks:**
- [ ] Create `client/src/services/api.js` base service
  ```javascript
  // Base axios/fetch configuration
  // Error handling
  // Request/response interceptors
  ```
- [ ] Create `client/src/services/authService.js`
- [ ] Create `client/src/services/productService.js`
- [ ] Create `client/src/services/reservationService.js`
- [ ] Add error handling and loading states

**Deliverable:** Centralized API communication layer

---

**1.3 CORS & Security Configuration** 🔒
- **Assignee:** Student 1 or 2 (pair with environment setup)
- **Branch:** `feature/cors-configuration`
- **Priority:** HIGH
- **Estimated Time:** 2 hours

**Tasks:**
- [ ] Verify CORS settings in `server/config/config.js`
- [ ] Test API calls from frontend to backend
- [ ] Configure cookie settings for cross-origin requests
- [ ] Add error handling for network failures

**Deliverable:** Frontend can successfully communicate with backend

---

### **Phase 2: Authentication Integration** (Week 2) ✅ COMPLETED
**Goal:** Connect login/register functionality with backend

#### Tasks:

**2.1 Auth Context Integration** 👤 ✅ COMPLETED
- **Assignee:** Student 3
- **Branch:** `feature/auth-integration`
- **Priority:** HIGH
- **Estimated Time:** 8 hours

**Tasks:**
- [x] Update `AuthContext.jsx` to use real API calls
- [x] Test registration flow: Account page → backend → Supabase
- [x] Test login flow: Account page → backend → session cookie
- [x] Test logout flow: Clear session
- [x] Test `checkAuth` on app load (session persistence)
- [x] Add loading states during auth operations
- [x] Display error messages from backend
- [x] Add password validation (min 8 characters, uppercase, lowercase, numbers)

**Deliverable:** Fully functional authentication system ✅

---

**2.2 Protected Routes** 🛡️ ✅ COMPLETED
- **Assignee:** Student 3
- **Branch:** `feature/protected-routes`
- **Priority:** MEDIUM
- **Estimated Time:** 4 hours

**Tasks:**
- [x] Create `ProtectedRoute` component wrapper
- [x] Protect user profile/account pages
- [x] Redirect to login if not authenticated
- [x] Show appropriate messages for unauthorized access
- [x] Test with both authenticated and non-authenticated users

**Deliverable:** Route protection based on authentication status ✅

---

### **Phase 3: Menu & Products Integration** (Week 3) ✅ COMPLETED
**Goal:** Replace hardcoded menu data with backend API

#### Tasks:

**3.1 Products API Integration** ☕ ✅ COMPLETED
- **Assignee:** Student 4
- **Branch:** `feature/menu-integration`
- **Priority:** HIGH
- **Estimated Time:** 8 hours

**Tasks:**
- [x] Remove hardcoded `DATA` object from `Menu.jsx`
- [x] Fetch products from `/api/products` on component mount
- [x] Add loading spinner while fetching
- [x] Handle empty states (no products)
- [x] Handle error states (API failure)
- [x] Filter products by category (origen, bebida, postres, ediciones)
- [x] Display product images from backend (image_url)
- [x] Add "Add to Cart" functionality with real product IDs
- [x] Created API service layer (api.js)
- [x] Created productService.js for product API calls
- [x] Created reservationService.js for future use
- [x] Added loading skeletons for better UX
- [x] Added stock_quantity check for "Agotado" state

**API Endpoints to use:**
```javascript
GET /api/products
GET /api/products/category/:category
GET /api/products/:id
```

**Deliverable:** Dynamic menu populated from database ✅

---

**3.2 Product Management (Admin)** 🛠️
- **Assignee:** Student 4
- **Branch:** `feature/product-management`
- **Priority:** LOW (future enhancement)
- **Estimated Time:** 6 hours

**Tasks:**
- [ ] Create admin page to manage products
- [ ] Add/Edit/Delete products through UI
- [ ] Upload product images
- [ ] Set featured products
- [ ] Manage stock quantities

**Deliverable:** Admin interface for product management

---

### **Phase 4: Booking/Reservations Integration** (Week 4)
**Goal:** Connect booking form with backend

#### Tasks:

**4.1 Reservations API Integration** 📅
- **Assignee:** Student 5
- **Branch:** `feature/booking-integration`
- **Priority:** HIGH
- **Estimated Time:** 8 hours

**Tasks:**
- [ ] Update `Booking.jsx` to send data to backend
- [ ] Call `POST /api/reservations` on form submit
- [ ] Handle successful booking (show confirmation)
- [ ] Handle errors (time slot unavailable, validation errors)
- [ ] Send email confirmation (backend already has this)
- [ ] Optionally: Check availability before submitting
- [ ] Add date/time validation (prevent past dates)
- [ ] Link reservation to logged-in user (if authenticated)

**API Endpoints to use:**
```javascript
POST /api/reservations
GET /api/reservations/availability
GET /api/reservations (user's bookings)
```

**Deliverable:** Functional reservation system

---

**4.2 User Reservations Dashboard** 📊
- **Assignee:** Student 5
- **Branch:** `feature/user-reservations`
- **Priority:** MEDIUM
- **Estimated Time:** 6 hours

**Tasks:**
- [ ] Display user's reservations in Account page
- [ ] Fetch from `GET /api/reservations` (filtered by user)
- [ ] Show reservation status (pending, confirmed, cancelled)
- [ ] Allow users to cancel reservations
- [ ] Add reservation history section

**Deliverable:** Users can view and manage their reservations

---

### **Phase 5: Cart & Checkout** (Week 5)
**Goal:** Implement order processing

#### Tasks:

**5.1 Backend Orders System** 🛒
- **Assignee:** Student 2
- **Branch:** `feature/orders-backend`
- **Priority:** HIGH
- **Estimated Time:** 8 hours

**Tasks:**
- [ ] Create `orders` table in database schema
  ```sql
  CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP
  );
  
  CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER,
    unit_price DECIMAL(10,2)
  );
  ```
- [ ] Create Order model (`models/Order.js`)
- [ ] Create order controller (`controllers/orderController.js`)
- [ ] Create order routes (`routes/orderRoutes.js`)
- [ ] Add endpoints:
  - `POST /api/orders` - Create order
  - `GET /api/orders` - Get user's orders
  - `GET /api/orders/:id` - Get order details

**Deliverable:** Backend order processing system

---

**5.2 Frontend Checkout Integration** 💳
- **Assignee:** Student 1
- **Branch:** `feature/checkout-integration`
- **Priority:** HIGH
- **Estimated Time:** 8 hours

**Tasks:**
- [ ] Update `Cart.jsx` to submit orders to backend
- [ ] Create checkout flow:
  1. Review cart items
  2. Confirm order
  3. Submit to `POST /api/orders`
  4. Clear cart on success
  5. Show order confirmation
- [ ] Link cart items to real product IDs from backend
- [ ] Calculate totals using backend prices
- [ ] Add order history page
- [ ] Send order confirmation email

**Deliverable:** Complete checkout process

---

### **Phase 6: Enhanced Features** (Week 6+)
**Goal:** Polish and add advanced functionality

#### Tasks:

**6.1 Reviews/Opinions System** ⭐
- **Assignee:** Student 3
- **Branch:** `feature/reviews-system`
- **Priority:** MEDIUM
- **Estimated Time:** 10 hours

**Tasks:**
- [ ] Create `reviews` table in database
- [ ] Create Review model and controller
- [ ] Add review endpoints (CRUD)
- [ ] Update `Feed.jsx` to fetch real reviews
- [ ] Allow users to submit reviews
- [ ] Add rating system (1-5 stars)
- [ ] Moderate reviews (admin feature)

**Deliverable:** User review system

---

**6.2 Image Upload & Storage** 📸
- **Assignee:** Student 4
- **Branch:** `feature/image-upload`
- **Priority:** MEDIUM
- **Estimated Time:** 6 hours

**Tasks:**
- [ ] Configure Supabase Storage bucket
- [ ] Add image upload to product creation
- [ ] Resize/optimize images on upload
- [ ] Update product model to store image URLs
- [ ] Add avatar upload for user profiles

**Deliverable:** Image management system

---

**6.3 Search & Filtering** 🔍
- **Assignee:** Any available student
- **Branch:** `feature/search-filter`
- **Priority:** LOW
- **Estimated Time:** 6 hours

**Tasks:**
- [ ] Add search bar to Menu page
- [ ] Implement product search (name, description)
- [ ] Add price range filter
- [ ] Add category filter with chips/badges
- [ ] Sort products (price, name, date)

**Deliverable:** Enhanced product discovery

---

**6.4 Admin Dashboard** 👨‍💼
- **Assignee:** Student 5
- **Branch:** `feature/admin-dashboard`
- **Priority:** LOW
- **Estimated Time:** 12 hours

**Tasks:**
- [ ] Create admin layout/sidebar
- [ ] Dashboard overview (stats, charts)
- [ ] Manage users (view, deactivate)
- [ ] Manage reservations (confirm, cancel)
- [ ] Manage orders (view, update status)
- [ ] Manage products (add, edit, delete)
- [ ] View analytics and reports

**Deliverable:** Complete admin panel

---

**6.5 Email Notifications** 📧
- **Assignee:** Student 2
- **Branch:** `feature/email-templates`
- **Priority:** MEDIUM
- **Estimated Time:** 4 hours

**Tasks:**
- [ ] Create HTML email templates
- [ ] Welcome email (already implemented)
- [ ] Reservation confirmation
- [ ] Reservation reminder (day before)
- [ ] Order confirmation
- [ ] Password reset email

**Deliverable:** Professional email notifications

---

**6.6 UI/UX Improvements** 🎨
- **Assignee:** All students (small tasks)
- **Branch:** `feature/ui-improvements`
- **Priority:** ONGOING
- **Estimated Time:** Varies

**Tasks:**
- [ ] Add loading skeletons instead of spinners
- [ ] Improve form validation feedback
- [ ] Add toast notifications (success, error)
- [ ] Mobile responsiveness testing
- [ ] Accessibility improvements (ARIA labels)
- [ ] Dark mode enhancements
- [ ] Animations and transitions
- [ ] Error boundary component

**Deliverable:** Polished user interface

---

## 🚀 Quick Start Checklist

### For Each Student Starting Work:

1. **Clone & Setup**
   ```bash
   git clone <repository-url>
   cd SW1-specialty-coffee-shop
   
   # Install dependencies
   cd server && npm install
   cd ../client && npm install
   ```

2. **Environment Configuration**
   ```bash
   # server/.env
   SUPABASE_URL=your_url
   SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_KEY=your_service_key
   PORT=5000
   NODE_ENV=development
   
   # client/.env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Database Setup**
   - Go to Supabase dashboard
   - Run SQL from `server/database/schema.sql`
   - Run SQL from `server/database/seed.sql` (optional test data)

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

5. **Create Your Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-task-name
   ```

6. **Start Coding!** 🎉

---

## 📚 Technical Stack Reference

### Frontend
- **Framework:** React 18.3
- **Router:** React Router DOM 6.27
- **Build Tool:** Vite 5.4
- **State Management:** Context API (Auth, Cart)
- **Styling:** Custom CSS (styles.css)
- **HTTP Client:** Fetch API (can upgrade to Axios)

### Backend
- **Runtime:** Node.js
- **Framework:** Express 4.18
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Session-based (cookies)
- **Security:** Helmet, CORS, bcryptjs
- **Email:** Nodemailer
- **Validation:** Express-validator

---

## 🎯 Priority Matrix

### Must Have (HIGH Priority)
1. ✅ Environment setup & API service layer
2. ✅ Authentication integration
3. ✅ Menu/Products API integration
4. 🟡 Booking/Reservations integration
5. 🟡 Cart & Checkout system

### Should Have (MEDIUM Priority)
6. 🟡 User reservations dashboard
7. 🟡 Reviews/Opinions system
8. ✅ Protected routes
9. 🟡 Email notifications

### Nice to Have (LOW Priority)
10. 🔵 Admin dashboard
11. 🔵 Image upload
12. 🔵 Search & filtering
13. 🔵 Product management
14. 🔵 UI/UX improvements

---

## 🤝 Collaboration Best Practices

### Communication
- **Daily standups:** Quick sync (5-10 min)
  - What did you do yesterday?
  - What will you do today?
  - Any blockers?

- **Use GitHub Issues:** Track bugs and features
- **Use GitHub Projects:** Kanban board for task management
- **Code Reviews:** Review each other's PRs
- **Pair Programming:** For complex features

### Code Quality
- Write clean, commented code
- Follow JavaScript/React best practices
- Test your features before pushing
- Don't commit console.logs or commented code
- Keep components small and focused

### Documentation
- Update README.md with new features
- Document API endpoints
- Add JSDoc comments to functions
- Keep this ROADMAP.md updated

---

## 📝 Testing Checklist

### Before Merging to Develop:
- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Code reviewed by teammate
- [ ] Merge conflicts resolved

### Before Merging to Main:
- [ ] All features tested together
- [ ] Backend and frontend connected
- [ ] Database migrations applied
- [ ] Environment variables documented
- [ ] README.md updated
- [ ] Version number incremented

---

## 🆘 Common Issues & Solutions

### CORS Errors
```javascript
// server/config/config.js
cors: {
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}
```

### Session Cookie Not Working
```javascript
// Check credentials in fetch
credentials: 'include'

// Check cookie settings
sameSite: 'lax',
secure: false (development)
```

### Supabase Connection Failed
- Verify `.env` variables
- Check Supabase dashboard for API keys
- Ensure database schema is created
- Check network/firewall settings

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

---

## 📅 Estimated Timeline

| Phase | Duration | Parallel Students |
|-------|----------|-------------------|
| Phase 1: Setup | Week 1 | 2 students |
| Phase 2: Auth | Week 2 | 1 student |
| Phase 3: Menu | Week 3 | 1 student |
| Phase 4: Booking | Week 4 | 1 student |
| Phase 5: Cart/Checkout | Week 5 | 2 students |
| Phase 6: Enhancements | Week 6+ | All students |

**Total Core Development:** 5-6 weeks  
**With Enhancements:** 8-10 weeks

---

## 🎓 Learning Objectives

By completing this roadmap, students will learn:

- ✅ Full-stack development (React + Node + Express)
- ✅ RESTful API design and implementation
- ✅ Database design and SQL (PostgreSQL)
- ✅ Authentication and session management
- ✅ Git workflow and team collaboration
- ✅ State management with React Context
- ✅ API integration and error handling
- ✅ Deployment and DevOps basics
- ✅ Code review and quality assurance

---

## 📞 Need Help?

- **Backend Issues:** Check `server/README.md` and Supabase docs
- **Frontend Issues:** Check React and Vite documentation
- **Git Problems:** Use `git status`, `git log`, and ask team
- **Stuck?** Ask your teammates or instructor!

---

**Good luck with your development! 🚀☕**

*Last updated: November 25, 2025*
