# Technical Architecture Document
## Comprehensive Dating Application for Indian Market

### 1. System Overview

This document outlines the technical architecture for a comprehensive dating application specifically designed for the Indian market, featuring dual authentication systems, cultural customizations, and a structured user flow.

### 2. Technology Stack

#### Frontend
- **Framework**: React.js 18+ with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Routing**: React Router v6
- **HTTP Client**: Axios for API calls
- **Real-time**: Socket.IO client for live chat
- **Maps**: Google Maps JavaScript API
- **Internationalization**: react-i18next for multilingual support

#### Backend
- **Runtime**: Node.js 18+ with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for session management and caching
- **Authentication**: JWT tokens with refresh token rotation
- **File Storage**: AWS S3 for profile images and media
- **Real-time**: Socket.IO for chat functionality
- **Email**: SendGrid for transactional emails
- **SMS**: Twilio for OTP verification

#### Third-Party Integrations
- **Google OAuth 2.0**: Social authentication
- **Twilio**: SMS OTP verification
- **Google Maps API**: Geolocation and distance calculation
- **Razorpay**: Payment processing for premium features
- **WhatsApp Business API**: Customer support integration

### 3. Authentication Architecture

#### 3.1 Multi-Modal Authentication System

```typescript
interface AuthenticationMethods {
  google: GoogleOAuthConfig;
  email: EmailPasswordConfig;
  phone: PhoneOTPConfig;
}

interface SecurityFeatures {
  rateLimiting: RateLimitConfig;
  bruteForceProtection: BruteForceConfig;
  sessionManagement: JWTConfig;
  passwordPolicy: PasswordPolicyConfig;
}
```

#### 3.2 Google OAuth 2.0 Implementation

```javascript
// Google OAuth Configuration
const googleOAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  scope: ['profile', 'email'],
  accessType: 'offline'
};

// Auto-profile creation flow
const handleGoogleAuth = async (googleUser) => {
  const existingUser = await User.findOne({ email: googleUser.email });
  
  if (!existingUser) {
    const newUser = await User.create({
      email: googleUser.email,
      fullName: googleUser.name,
      profilePicture: googleUser.picture,
      authProvider: 'google',
      isVerified: true,
      createdAt: new Date()
    });
    
    return generateJWTTokens(newUser);
  }
  
  return generateJWTTokens(existingUser);
};
```

#### 3.3 Phone OTP System with Twilio

```javascript
// Twilio OTP Implementation
const sendOTP = async (phoneNumber) => {
  const otp = generateSixDigitOTP();
  const hashedOTP = await bcrypt.hash(otp, 10);
  
  // Store OTP in Redis with 5-minute expiry
  await redis.setex(`otp:${phoneNumber}`, 300, hashedOTP);
  
  // Send SMS via Twilio
  await twilioClient.messages.create({
    body: `Your ConnectIndia verification code is: ${otp}. Valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${phoneNumber}`
  });
};

const verifyOTP = async (phoneNumber, userOTP) => {
  const storedHashedOTP = await redis.get(`otp:${phoneNumber}`);
  
  if (!storedHashedOTP) {
    throw new Error('OTP expired or invalid');
  }
  
  const isValid = await bcrypt.compare(userOTP, storedHashedOTP);
  
  if (isValid) {
    await redis.del(`otp:${phoneNumber}`);
    return true;
  }
  
  throw new Error('Invalid OTP');
};
```

### 4. Security Implementation

#### 4.1 Password Security

```javascript
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  hashRounds: 12
};

const validatePassword = (password) => {
  const checks = {
    length: password.length >= passwordPolicy.minLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  return Object.values(checks).every(check => check);
};
```

#### 4.2 Rate Limiting and Brute Force Protection

```javascript
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
};

const bruteForceProtection = {
  freeRetries: 3,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 60 * 60 * 1000, // 1 hour
  lifetime: 24 * 60 * 60 * 1000 // 24 hours
};
```

### 5. User Flow Architecture

#### 5.1 Post-Login Flow Sequence

```typescript
interface UserFlowSteps {
  step1: 'call-support';
  step2: 'dating-matches';
  step3: 'nearby-profiles';
}

const userFlowConfig = {
  sequence: ['call-support', 'dating-matches', 'nearby-profiles'],
  skipable: true,
  progressTracking: true,
  analytics: true
};
```

#### 5.2 Flow Implementation

```javascript
const UserFlowManager = {
  async initializeFlow(userId) {
    const flowState = {
      userId,
      currentStep: 0,
      completedSteps: [],
      startedAt: new Date(),
      isComplete: false
    };
    
    await redis.setex(`userflow:${userId}`, 3600, JSON.stringify(flowState));
    return flowState;
  },
  
  async progressToNextStep(userId) {
    const flowState = await this.getFlowState(userId);
    flowState.currentStep += 1;
    flowState.completedSteps.push(flowState.currentStep - 1);
    
    if (flowState.currentStep >= userFlowConfig.sequence.length) {
      flowState.isComplete = true;
      await this.completeFlow(userId);
    }
    
    await redis.setex(`userflow:${userId}`, 3600, JSON.stringify(flowState));
    return flowState;
  }
};
```

### 6. Cultural Customization Features

#### 6.1 Indian Market Specific Features

```typescript
interface CulturalFilters {
  religion: Religion[];
  caste: Caste[];
  dietaryPreference: DietaryPreference[];
  familyType: FamilyType[];
  motherTongue: Language[];
  horoscope: HoroscopeDetails;
}

interface RelationshipGoals {
  marriage: 'arranged' | 'love' | 'both';
  friendship: boolean;
  casual: boolean;
  serious: boolean;
}
```

#### 6.2 Multilingual Support

```javascript
const i18nConfig = {
  fallbackLng: 'en',
  supportedLanguages: [
    'en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn'
  ],
  resources: {
    en: { translation: require('./locales/en.json') },
    hi: { translation: require('./locales/hi.json') },
    ta: { translation: require('./locales/ta.json') }
    // ... other languages
  }
};
```

### 7. Database Schema Design

#### 7.1 User Schema

```javascript
const userSchema = new mongoose.Schema({
  // Basic Information
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, sparse: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  
  // Authentication
  password: { type: String }, // Optional for OAuth users
  authProvider: { type: String, enum: ['email', 'google', 'phone'] },
  isVerified: { type: Boolean, default: false },
  
  // Profile Information
  profilePictures: [{ type: String }],
  bio: { type: String, maxLength: 500 },
  profession: { type: String },
  education: { type: String },
  
  // Cultural Information
  religion: { type: String },
  caste: { type: String },
  motherTongue: { type: String },
  languages: [{ type: String }],
  dietaryPreference: { 
    type: String, 
    enum: ['vegetarian', 'non-vegetarian', 'vegan', 'jain'] 
  },
  
  // Location
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [longitude, latitude]
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  
  // Preferences
  relationshipGoals: [{ 
    type: String, 
    enum: ['marriage', 'friendship', 'casual', 'serious'] 
  }],
  agePreference: {
    min: { type: Number, default: 18 },
    max: { type: Number, default: 35 }
  },
  distancePreference: { type: Number, default: 50 }, // in km
  
  // Subscription
  subscriptionStatus: { 
    type: String, 
    enum: ['free', 'premium'], 
    default: 'free' 
  },
  subscriptionExpiry: { type: Date },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

// Geospatial index for location-based queries
userSchema.index({ location: '2dsphere' });
```

### 8. API Architecture

#### 8.1 RESTful API Design

```javascript
// Authentication Routes
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/phone/send-otp
POST /api/auth/phone/verify-otp
POST /api/auth/refresh-token
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password

// User Profile Routes
GET /api/users/profile
PUT /api/users/profile
POST /api/users/upload-photo
DELETE /api/users/photo/:photoId
GET /api/users/nearby
GET /api/users/matches

// Matching Routes
POST /api/matches/like/:userId
POST /api/matches/pass/:userId
GET /api/matches/mutual
DELETE /api/matches/:matchId

// Chat Routes
GET /api/chats
GET /api/chats/:chatId/messages
POST /api/chats/:chatId/messages
PUT /api/chats/:chatId/read

// Support Routes
POST /api/support/chat
POST /api/support/call-request
GET /api/support/resources
```

#### 8.2 WebSocket Events for Real-time Features

```javascript
const socketEvents = {
  // Chat Events
  'chat:join': (chatId) => {},
  'chat:message': (messageData) => {},
  'chat:typing': (chatId, userId) => {},
  'chat:read': (chatId, messageId) => {},
  
  // Matching Events
  'match:new': (matchData) => {},
  'match:like': (userId) => {},
  
  // Support Events
  'support:chat:start': () => {},
  'support:chat:message': (messageData) => {},
  'support:call:request': (callData) => {}
};
```

### 9. Performance Optimization

#### 9.1 Caching Strategy

```javascript
const cacheConfig = {
  userProfiles: { ttl: 3600 }, // 1 hour
  nearbyUsers: { ttl: 300 },   // 5 minutes
  matches: { ttl: 1800 },      // 30 minutes
  chatMessages: { ttl: 86400 } // 24 hours
};

const cacheManager = {
  async getUserProfile(userId) {
    const cached = await redis.get(`profile:${userId}`);
    if (cached) return JSON.parse(cached);
    
    const profile = await User.findById(userId);
    await redis.setex(`profile:${userId}`, cacheConfig.userProfiles.ttl, JSON.stringify(profile));
    return profile;
  }
};
```

#### 9.2 Database Optimization

```javascript
// Compound indexes for efficient queries
userSchema.index({ location: '2dsphere', gender: 1, ageRange: 1 });
userSchema.index({ religion: 1, caste: 1, dietaryPreference: 1 });
userSchema.index({ lastActive: -1, subscriptionStatus: 1 });

// Aggregation pipeline for nearby users
const getNearbyUsers = async (userId, maxDistance = 50000) => {
  return User.aggregate([
    {
      $geoNear: {
        near: userLocation,
        distanceField: 'distance',
        maxDistance: maxDistance,
        spherical: true
      }
    },
    {
      $match: {
        _id: { $ne: userId },
        isActive: true
      }
    },
    {
      $limit: 50
    }
  ]);
};
```

### 10. Testing Strategy

#### 10.1 Unit Testing

```javascript
// Authentication Tests
describe('Authentication Service', () => {
  test('should register user with valid email and password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      fullName: 'Test User'
    };
    
    const result = await authService.register(userData);
    expect(result.success).toBe(true);
    expect(result.user.email).toBe(userData.email);
  });
  
  test('should reject weak passwords', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'weak',
      fullName: 'Test User'
    };
    
    await expect(authService.register(userData)).rejects.toThrow('Password does not meet requirements');
  });
});
```

#### 10.2 Integration Testing

```javascript
// API Integration Tests
describe('User API', () => {
  test('GET /api/users/nearby should return nearby users', async () => {
    const response = await request(app)
      .get('/api/users/nearby')
      .set('Authorization', `Bearer ${validToken}`)
      .query({ lat: 19.0760, lng: 72.8777, radius: 10 });
    
    expect(response.status).toBe(200);
    expect(response.body.users).toBeInstanceOf(Array);
    expect(response.body.users.length).toBeGreaterThan(0);
  });
});
```

#### 10.3 Load Testing

```javascript
// Artillery.js configuration for load testing
module.exports = {
  config: {
    target: 'http://localhost:3000',
    phases: [
      { duration: 60, arrivalRate: 10 },
      { duration: 120, arrivalRate: 50 },
      { duration: 60, arrivalRate: 100 }
    ]
  },
  scenarios: [
    {
      name: 'User Registration and Login',
      weight: 30,
      flow: [
        { post: { url: '/api/auth/register', json: { /* user data */ } } },
        { post: { url: '/api/auth/login', json: { /* login data */ } } }
      ]
    },
    {
      name: 'Browse Nearby Users',
      weight: 70,
      flow: [
        { get: { url: '/api/users/nearby?lat=19.0760&lng=72.8777' } }
      ]
    }
  ]
};
```

### 11. Deployment Architecture

#### 11.1 Infrastructure Setup

```yaml
# Docker Compose Configuration
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - mongodb
      - redis
  
  mongodb:
    image: mongo:5.0
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

#### 11.2 CI/CD Pipeline

```yaml
# GitHub Actions Workflow
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:integration
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to AWS ECS
        run: |
          aws ecs update-service --cluster production --service dating-app --force-new-deployment
```

### 12. Monitoring and Analytics

#### 12.1 Application Monitoring

```javascript
const monitoring = {
  metrics: {
    userRegistrations: 'counter',
    activeUsers: 'gauge',
    matchesCreated: 'counter',
    messagesExchanged: 'counter',
    responseTime: 'histogram'
  },
  
  alerts: {
    highErrorRate: { threshold: '5%', duration: '5m' },
    slowResponse: { threshold: '2s', duration: '1m' },
    lowMatchRate: { threshold: '10%', duration: '10m' }
  }
};
```

This comprehensive technical architecture provides a solid foundation for building a scalable, secure, and culturally relevant dating application for the Indian market. The implementation includes all requested features while maintaining high performance and security standards.