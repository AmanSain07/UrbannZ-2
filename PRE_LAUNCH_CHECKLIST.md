# UrbanZ - Pre-Launch Checklist & Action Items

**Generated**: June 12, 2026  
**Status**: Ready for Launch

---

## 🚀 IMMEDIATE ACTION ITEMS (Do before launch)

### Priority 1: CRITICAL (1-2 hours)

- [ ] **Verify Email Configuration**
  - Location: Check Django settings for EMAIL_BACKEND
  - Task: Ensure EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER are configured
  - Test: Send test email to admin
  - Impact: Admins won't receive notifications if not configured

- [ ] **Set Production Environment Variables**
  - [ ] Change DEBUG=False in .env
  - [ ] Generate new SECRET_KEY (don't use default)
  - [ ] Set ALLOWED_HOSTS for your domain
  - [ ] Set CORS_ALLOWED_ORIGINS for your frontend domain
  - Location: `UrbanZBackend/.env`

- [ ] **Secure Static Files**
  - [ ] Configure STATIC_ROOT
  - [ ] Configure MEDIA_ROOT
  - [ ] Either:
    - Option A: Use S3/CloudStorage
    - Option B: Configure nginx to serve static files
    - Option C: Use WhiteNoise middleware
  - Location: `UrbanZBackend/urbanz/settings.py`

---

### Priority 2: IMPORTANT (2-4 hours)

- [ ] **Load Test the System**
  - Tools: Apache JMeter or Locust
  - Test: 100 concurrent users placing orders
  - Scenario: Register → Browse → Add to Cart → Checkout
  - Success Criteria: No errors, < 2s response time
  - Command: `pip install locust` then create locustfile

- [ ] **Database Backup Strategy**
  - [ ] Schedule daily backups
  - [ ] Test backup/restore process
  - [ ] Store backups in separate location

- [ ] **Logging Configuration**
  - [ ] Enable Django logging
  - [ ] Log to file (not just console)
  - Location: Configure LOGGING in settings.py
  - Recommendation: Use ELK Stack or Papertrail

- [ ] **API Documentation**
  - Tool: Generate using DRF's built-in docs
  - URL: `http://localhost:8000/api/` (with browsable API)
  - Or use Swagger/Redoc
  - Share with frontend team

---

### Priority 3: RECOMMENDED (If time)

- [ ] **Add Sentry for Error Tracking**
  - Setup: `pip install sentry-sdk`
  - Configure in settings.py
  - Benefits: Real-time error monitoring in production

- [ ] **Add Redis for Caching**
  - Improves performance
  - Use for session storage
  - Benefits: Faster API responses

- [ ] **Setup Celery for Async Tasks**
  - For sending emails asynchronously
  - For long-running operations
  - Benefits: Better user experience

---

## ✅ FEATURE COMPLETENESS CHECKLIST

### Customer Features
- [x] Registration
- [x] Login/Logout
- [x] Browse Products
- [x] Search Products
- [x] Filter Products
- [x] Add to Cart
- [x] Remove from Cart
- [x] View Cart
- [x] Checkout
- [x] Place Order
- [x] View Order History
- [x] Track Order Status

### Vendor Features
- [x] Vendor Application
- [x] Product Management
- [x] Image Upload
- [x] View Orders
- [x] Update Order Status
- [ ] Dashboard (Phase 2)
- [ ] Earnings Report (Phase 2)

### Admin Features
- [x] Approve Vendors
- [x] Reject Vendors
- [x] Approve Products
- [x] Reject Products
- [x] View Users
- [x] Suspend Users
- [ ] Admin Dashboard UI (Phase 2)
- [ ] Analytics Dashboard (Phase 2)

### System Features
- [x] JWT Authentication
- [x] Role-Based Access Control
- [x] Order Processing
- [x] Notifications (in-app)
- [ ] Email Notifications (Phase 2)
- [ ] Real-time Notifications (Phase 2)

---

## 🧪 TESTING CHECKLIST

### Manual Testing

#### Customer Workflow
- [ ] Create new customer account
- [ ] Login successfully
- [ ] Browse product catalog
- [ ] Search for specific product
- [ ] Filter products by category
- [ ] Add product to cart
- [ ] Remove product from cart
- [ ] Update quantity in cart
- [ ] Checkout and place order
- [ ] View order confirmation
- [ ] View order in order history
- [ ] Verify order status updates

#### Vendor Workflow
- [ ] Create customer account
- [ ] Submit vendor application
- [ ] Admin approves vendor
- [ ] Login as vendor
- [ ] Create product
- [ ] Upload product images
- [ ] Edit product details
- [ ] View vendor orders
- [ ] Update order status
- [ ] Verify customer notification

#### Admin Workflow
- [ ] Login as admin
- [ ] View pending vendor applications
- [ ] Approve vendor application
- [ ] View pending products
- [ ] Approve product
- [ ] View all users
- [ ] View system orders

### Automated Testing (Recommended)
- [ ] Unit tests for models
- [ ] Unit tests for serializers
- [ ] Integration tests for API endpoints
- [ ] End-to-end tests for user workflows
- Coverage target: > 80%

**Run tests**: 
```bash
python manage.py test apps/ --verbosity=2
```

---

## 🔒 SECURITY CHECKLIST

### Before Going Live
- [ ] **HTTPS**: Enforce SSL/TLS on all connections
- [ ] **CORS**: Restrict to your frontend domain only
- [ ] **CSRF**: Ensure CSRF tokens in forms
- [ ] **SQL Injection**: Not applicable (using ORM)
- [ ] **XSS**: Not applicable (using DRF serializers)
- [ ] **Rate Limiting**: Add to prevent abuse
- [ ] **API Key**: Not needed (JWT used)
- [ ] **Admin Path**: Hide `/admin/` or add custom path
- [ ] **Secret Key**: Rotate in production
- [ ] **Database Password**: Use strong, random password

### Rate Limiting Setup
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

### CORS Setup (Production)
```python
# .env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 📊 PERFORMANCE CHECKLIST

### Database Optimization
- [x] Database indexes on frequently queried fields
- [x] Prefetch_related and select_related used
- [ ] Database query caching (optional)
- [ ] Connection pooling setup

### API Performance
- [ ] Pagination implemented on list endpoints
- [ ] Response compression enabled (gzip)
- [ ] API response times < 500ms
- [ ] Caching headers properly set

### Frontend Performance
- [ ] Lazy loading for images
- [ ] Code splitting for routes
- [ ] Production build optimization
- [ ] CDN for static assets

---

## 📝 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Security audit completed
- [ ] Load test completed
- [ ] Backup created

### Deployment
- [ ] Use deployment tool (Docker, Ansible, etc.)
- [ ] Database migrations run
- [ ] Static files collected
- [ ] Web server started (Gunicorn/uWSGI)
- [ ] Reverse proxy configured (Nginx)
- [ ] SSL certificate installed
- [ ] Cron jobs scheduled (backups, cleanup)

### Post-Deployment
- [ ] Monitor server resources
- [ ] Check application logs
- [ ] Verify API endpoints responding
- [ ] Test critical user workflows
- [ ] Monitor error rates

---

## 📋 QUICK FIX ITEMS

### 1-Minute Fixes
- [ ] Add `unique=True` to Product.slug
  ```python
  # apps/products/models.py line ~80
  slug = models.SlugField(max_length=300, unique=True, blank=True)
  ```

- [ ] Add min_length to password field
  ```python
  # Update serializer to enforce min 8 characters
  ```

### 5-Minute Fixes
- [ ] Add product name length validation
- [ ] Add email format validation (if not already done)
- [ ] Add price validation (positive only)

### 15-Minute Fixes
- [ ] Create Django management command for sample data
  ```bash
  python manage.py create_sample_data
  ```
  
- [ ] Add frontend validation hints for form errors

---

## 🎯 PHASE 2 ENHANCEMENTS (After Launch)

### High Priority
1. **Admin Dashboard UI**
   - User management
   - Product approval panel
   - Vendor application reviews
   - Sales analytics

2. **Vendor Dashboard UI**
   - Order list and details
   - Product management
   - Earnings reports
   - Customer reviews

3. **Email Notifications**
   - Order confirmation
   - Shipment tracking
   - Review requests

### Medium Priority
4. **Payment Integration**
   - Stripe/PayPal integration
   - Invoice generation
   - Refund handling

5. **Real-time Features**
   - WebSocket notifications
   - Live order tracking
   - Chat support

6. **Mobile App**
   - React Native app
   - Push notifications
   - Mobile optimized UI

### Nice-to-Have
7. **Advanced Search**
   - Elasticsearch integration
   - Advanced filters
   - Faceted search

8. **Analytics**
   - User behavior tracking
   - Sales analytics
   - Product performance

9. **Review System**
   - Product reviews
   - Vendor ratings
   - Review moderation

10. **Wishlist**
    - Save products
    - Price notifications
    - Share lists

---

## 🚨 CRITICAL THINGS TO REMEMBER

1. **Always backup before migrations**
   ```bash
   python manage.py dumpdata > backup_$(date +%s).json
   ```

2. **Never commit SECRET_KEY or passwords**
   - Use .env file
   - Add .env to .gitignore

3. **Test all user workflows before launch**
   - Complete happy path for each role
   - Test error scenarios

4. **Monitor logs after launch**
   - Set up real-time alerting
   - Review errors daily first week

5. **Have a rollback plan**
   - Keep previous version deployed
   - Have quick rollback procedure

6. **Start with small traffic**
   - Soft launch to 5% of users
   - Monitor for issues
   - Gradually increase to 100%

---

## 📞 SUPPORT CONTACTS

For any issues during launch:
- Backend: Review `UrbanZBackend/` logs
- Frontend: Review browser console
- Database: Check `db.sqlite3` (or your DB)
- API: Test endpoints with Postman/Insomnia

---

## ✨ LAUNCH DAY CHECKLIST

**2 hours before launch:**
- [ ] Final backup taken
- [ ] All services tested
- [ ] Logs cleared
- [ ] Team standing by

**At launch:**
- [ ] Deploy to production
- [ ] Monitor error rates (should be ~0.1%)
- [ ] Monitor response times (should be < 500ms)
- [ ] Test all user workflows
- [ ] Have rollback ready

**After launch:**
- [ ] Monitor for 24 hours
- [ ] Review logs hourly
- [ ] Respond to user issues
- [ ] Scale if needed

---

**Good luck with your launch! 🚀**

UrbanZ is ready for production. Execute this checklist and you'll have a solid marketplace running smoothly.
