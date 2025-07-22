# Comprehensive Testing Plan
## Dating Application - Indian Market

### 1. Testing Strategy Overview

This document outlines a comprehensive testing strategy for the dating application, covering all aspects from unit tests to security validation, ensuring a robust and reliable platform for Indian users.

### 2. Test Environment Setup

#### 2.1 Testing Environments

```yaml
environments:
  development:
    url: "http://localhost:3000"
    database: "mongodb://localhost:27017/dating_dev"
    redis: "redis://localhost:6379/0"
    
  staging:
    url: "https://staging.connectindia.com"
    database: "mongodb://staging-cluster/dating_staging"
    redis: "redis://staging-redis:6379/0"
    
  production:
    url: "https://connectindia.com"
    database: "mongodb://prod-cluster/dating_prod"
    redis: "redis://prod-redis:6379/0"
```

#### 2.2 Test Data Management

```javascript
// Test Data Factory
class TestDataFactory {
  static createUser(overrides = {}) {
    return {
      email: faker.internet.email(),
      fullName: faker.name.fullName(),
      dateOfBirth: faker.date.between('1990-01-01', '2000-12-31'),
      gender: faker.helpers.arrayElement(['male', 'female']),
      location: {
        coordinates: [72.8777, 19.0760], // Mumbai
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      religion: faker.helpers.arrayElement(['Hindu', 'Muslim', 'Christian', 'Sikh']),
      dietaryPreference: faker.helpers.arrayElement(['vegetarian', 'non-vegetarian']),
      ...overrides
    };
  }
  
  static createProfile(userId, overrides = {}) {
    return {
      userId,
      bio: faker.lorem.paragraph(),
      profession: faker.name.jobTitle(),
      education: faker.helpers.arrayElement(['B.Tech', 'MBA', 'M.Tech', 'PhD']),
      interests: faker.helpers.arrayElements(['Travel', 'Music', 'Sports', 'Reading'], 3),
      ...overrides
    };
  }
}
```

### 3. Unit Testing

#### 3.1 Authentication Service Tests

```javascript
// auth.service.test.js
describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Registration', () => {
    test('should register user with valid email and password', async () => {
      const userData = TestDataFactory.createUser({
        email: 'test@example.com',
        password: 'SecurePass123!'
      });

      const result = await authService.register(userData);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe(userData.email);
      expect(result.user.password).toBeUndefined(); // Password should not be returned
      expect(result.tokens).toHaveProperty('accessToken');
      expect(result.tokens).toHaveProperty('refreshToken');
    });

    test('should reject registration with weak password', async () => {
      const userData = TestDataFactory.createUser({
        password: 'weak'
      });

      await expect(authService.register(userData))
        .rejects
        .toThrow('Password does not meet security requirements');
    });

    test('should reject registration with duplicate email', async () => {
      const userData = TestDataFactory.createUser({
        email: 'duplicate@example.com'
      });

      await authService.register(userData);

      await expect(authService.register(userData))
        .rejects
        .toThrow('Email already registered');
    });

    test('should validate Indian phone number format', async () => {
      const validPhones = ['9876543210', '8765432109', '7654321098'];
      const invalidPhones = ['1234567890', '0987654321', '12345'];

      for (const phone of validPhones) {
        expect(authService.validateIndianPhone(phone)).toBe(true);
      }

      for (const phone of invalidPhones) {
        expect(authService.validateIndianPhone(phone)).toBe(false);
      }
    });
  });

  describe('Google OAuth', () => {
    test('should create user from Google profile', async () => {
      const googleProfile = {
        id: 'google123',
        email: 'user@gmail.com',
        name: 'John Doe',
        picture: 'https://example.com/photo.jpg'
      };

      const result = await authService.handleGoogleAuth(googleProfile);

      expect(result.user.email).toBe(googleProfile.email);
      expect(result.user.fullName).toBe(googleProfile.name);
      expect(result.user.profilePicture).toBe(googleProfile.picture);
      expect(result.user.authProvider).toBe('google');
      expect(result.user.isVerified).toBe(true);
    });

    test('should link existing user with Google account', async () => {
      const existingUser = await User.create(TestDataFactory.createUser({
        email: 'existing@example.com'
      }));

      const googleProfile = {
        email: 'existing@example.com',
        name: 'John Doe'
      };

      const result = await authService.handleGoogleAuth(googleProfile);

      expect(result.user.id).toBe(existingUser.id);
      expect(result.user.authProvider).toBe('google');
    });
  });

  describe('OTP Verification', () => {
    test('should send OTP to valid Indian phone number', async () => {
      const phoneNumber = '9876543210';
      const mockTwilio = jest.spyOn(twilioService, 'sendSMS');

      await authService.sendOTP(phoneNumber);

      expect(mockTwilio).toHaveBeenCalledWith(
        `+91${phoneNumber}`,
        expect.stringMatching(/Your ConnectIndia verification code is: \d{6}/)
      );
    });

    test('should verify correct OTP', async () => {
      const phoneNumber = '9876543210';
      const otp = '123456';

      // Mock Redis to return hashed OTP
      const hashedOTP = await bcrypt.hash(otp, 10);
      jest.spyOn(redis, 'get').mockResolvedValue(hashedOTP);
      jest.spyOn(redis, 'del').mockResolvedValue(1);

      const result = await authService.verifyOTP(phoneNumber, otp);

      expect(result).toBe(true);
      expect(redis.del).toHaveBeenCalledWith(`otp:${phoneNumber}`);
    });

    test('should reject incorrect OTP', async () => {
      const phoneNumber = '9876543210';
      const correctOTP = '123456';
      const incorrectOTP = '654321';

      const hashedOTP = await bcrypt.hash(correctOTP, 10);
      jest.spyOn(redis, 'get').mockResolvedValue(hashedOTP);

      await expect(authService.verifyOTP(phoneNumber, incorrectOTP))
        .rejects
        .toThrow('Invalid OTP');
    });

    test('should reject expired OTP', async () => {
      const phoneNumber = '9876543210';
      const otp = '123456';

      jest.spyOn(redis, 'get').mockResolvedValue(null);

      await expect(authService.verifyOTP(phoneNumber, otp))
        .rejects
        .toThrow('OTP expired or invalid');
    });
  });
});
```

#### 3.2 Matching Algorithm Tests

```javascript
// matching.service.test.js
describe('Matching Service', () => {
  let user1, user2, user3;

  beforeEach(async () => {
    user1 = await User.create(TestDataFactory.createUser({
      religion: 'Hindu',
      dietaryPreference: 'vegetarian',
      location: { coordinates: [72.8777, 19.0760] }, // Mumbai
      agePreference: { min: 24, max: 30 }
    }));

    user2 = await User.create(TestDataFactory.createUser({
      age: 26,
      religion: 'Hindu',
      dietaryPreference: 'vegetarian',
      location: { coordinates: [72.8877, 19.0860] }, // 1km from user1
      relationshipGoals: ['marriage']
    }));

    user3 = await User.create(TestDataFactory.createUser({
      age: 35,
      religion: 'Christian',
      dietaryPreference: 'non-vegetarian',
      location: { coordinates: [77.2090, 28.6139] }, // Delhi
      relationshipGoals: ['casual']
    }));
  });

  test('should calculate compatibility score correctly', async () => {
    const compatibility = await matchingService.calculateCompatibility(user1.id, user2.id);

    expect(compatibility.score).toBeGreaterThan(80);
    expect(compatibility.factors).toEqual(
      expect.objectContaining({
        religion: expect.any(Number),
        dietaryPreference: expect.any(Number),
        location: expect.any(Number),
        age: expect.any(Number)
      })
    );
  });

  test('should find nearby users within specified radius', async () => {
    const nearbyUsers = await matchingService.findNearbyUsers(user1.id, 5000); // 5km radius

    expect(nearbyUsers).toHaveLength(1);
    expect(nearbyUsers[0].id).toBe(user2.id);
    expect(nearbyUsers[0].distance).toBeLessThan(5000);
  });

  test('should apply cultural filters correctly', async () => {
    const filters = {
      religion: 'Hindu',
      dietaryPreference: 'vegetarian',
      maxDistance: 50000
    };

    const matches = await matchingService.findMatches(user1.id, filters);

    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe(user2.id);
  });

  test('should exclude already liked/passed users', async () => {
    // User1 already liked user2
    await Like.create({
      likerId: user1.id,
      likedId: user2.id,
      isLike: true
    });

    const matches = await matchingService.findMatches(user1.id, {});

    expect(matches.find(m => m.id === user2.id)).toBeUndefined();
  });
});
```

### 4. Integration Testing

#### 4.1 API Integration Tests

```javascript
// api.integration.test.js
describe('API Integration Tests', () => {
  let app, server, authToken;

  beforeAll(async () => {
    app = require('../app');
    server = app.listen(0);
    
    // Create test user and get auth token
    const user = await User.create(TestDataFactory.createUser());
    authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/auth/register should create new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        fullName: 'New User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.user.email).toBe(userData.email);
    });

    test('POST /api/auth/login should authenticate user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!'
      };

      // First register the user
      await request(app)
        .post('/api/auth/register')
        .send({ ...userData, fullName: 'Test User' });

      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send(userData)
        .expect(200);

      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
    });

    test('POST /api/auth/phone/send-otp should send OTP', async () => {
      const phoneNumber = '9876543210';

      const response = await request(app)
        .post('/api/auth/phone/send-otp')
        .send({ phoneNumber })
        .expect(200);

      expect(response.body.message).toBe('OTP sent successfully');
    });
  });

  describe('User Profile Endpoints', () => {
    test('GET /api/users/profile should return user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email');
    });

    test('PUT /api/users/profile should update user profile', async () => {
      const updateData = {
        bio: 'Updated bio',
        profession: 'Software Engineer'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.user.bio).toBe(updateData.bio);
      expect(response.body.user.profession).toBe(updateData.profession);
    });

    test('GET /api/users/nearby should return nearby users', async () => {
      const response = await request(app)
        .get('/api/users/nearby')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ lat: 19.0760, lng: 72.8777, radius: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('Matching Endpoints', () => {
    test('POST /api/matches/like should create like', async () => {
      const targetUser = await User.create(TestDataFactory.createUser());

      const response = await request(app)
        .post(`/api/matches/like/${targetUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Like recorded');
    });

    test('GET /api/matches/mutual should return mutual matches', async () => {
      const response = await request(app)
        .get('/api/matches/mutual')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('matches');
      expect(Array.isArray(response.body.matches)).toBe(true);
    });
  });
});
```

#### 4.2 Database Integration Tests

```javascript
// database.integration.test.js
describe('Database Integration Tests', () => {
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('User Model', () => {
    test('should create user with geospatial index', async () => {
      const userData = TestDataFactory.createUser({
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760]
        }
      });

      const user = await User.create(userData);
      
      // Test geospatial query
      const nearbyUsers = await User.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [72.8777, 19.0760]
            },
            $maxDistance: 1000
          }
        }
      });

      expect(nearbyUsers).toHaveLength(1);
      expect(nearbyUsers[0].id).toBe(user.id);
    });

    test('should enforce unique constraints', async () => {
      const userData = TestDataFactory.createUser({
        email: 'unique@example.com'
      });

      await User.create(userData);

      await expect(User.create(userData))
        .rejects
        .toThrow(/duplicate key error/);
    });
  });

  describe('Matching Queries', () => {
    test('should perform complex aggregation for matches', async () => {
      const users = await User.create([
        TestDataFactory.createUser({ religion: 'Hindu', age: 25 }),
        TestDataFactory.createUser({ religion: 'Hindu', age: 27 }),
        TestDataFactory.createUser({ religion: 'Muslim', age: 26 })
      ]);

      const matches = await User.aggregate([
        {
          $match: {
            religion: 'Hindu',
            age: { $gte: 24, $lte: 30 }
          }
        },
        {
          $project: {
            fullName: 1,
            age: 1,
            religion: 1,
            compatibility: {
              $add: [
                { $cond: [{ $eq: ['$religion', 'Hindu'] }, 20, 0] },
                { $cond: [{ $gte: ['$age', 25] }, 10, 0] }
              ]
            }
          }
        },
        {
          $sort: { compatibility: -1 }
        }
      ]);

      expect(matches).toHaveLength(2);
      expect(matches[0].compatibility).toBeGreaterThanOrEqual(matches[1].compatibility);
    });
  });
});
```

### 5. End-to-End Testing

#### 5.1 Selenium WebDriver Tests

```javascript
// e2e.selenium.test.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('End-to-End Tests', () => {
  let driver;

  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  describe('User Registration Flow', () => {
    test('should complete full registration process', async () => {
      await driver.get('http://localhost:3000');

      // Click sign up button
      const signUpButton = await driver.findElement(By.css('[data-testid="signup-button"]'));
      await signUpButton.click();

      // Fill registration form
      await driver.findElement(By.css('[data-testid="fullname-input"]')).sendKeys('Test User');
      await driver.findElement(By.css('[data-testid="email-input"]')).sendKeys('test@example.com');
      await driver.findElement(By.css('[data-testid="password-input"]')).sendKeys('SecurePass123!');
      await driver.findElement(By.css('[data-testid="confirm-password-input"]')).sendKeys('SecurePass123!');

      // Submit form
      await driver.findElement(By.css('[data-testid="register-submit"]')).click();

      // Wait for success message
      await driver.wait(until.elementLocated(By.css('[data-testid="registration-success"]')), 5000);

      const successMessage = await driver.findElement(By.css('[data-testid="registration-success"]')).getText();
      expect(successMessage).toContain('Registration successful');
    });

    test('should show validation errors for invalid input', async () => {
      await driver.get('http://localhost:3000');

      const signUpButton = await driver.findElement(By.css('[data-testid="signup-button"]'));
      await signUpButton.click();

      // Submit empty form
      await driver.findElement(By.css('[data-testid="register-submit"]')).click();

      // Check for validation errors
      const emailError = await driver.findElement(By.css('[data-testid="email-error"]')).getText();
      const passwordError = await driver.findElement(By.css('[data-testid="password-error"]')).getText();

      expect(emailError).toContain('Email is required');
      expect(passwordError).toContain('Password is required');
    });
  });

  describe('User Flow Navigation', () => {
    beforeEach(async () => {
      // Login first
      await driver.get('http://localhost:3000');
      await driver.findElement(By.css('[data-testid="login-button"]')).click();
      await driver.findElement(By.css('[data-testid="email-input"]')).sendKeys('test@example.com');
      await driver.findElement(By.css('[data-testid="password-input"]')).sendKeys('SecurePass123!');
      await driver.findElement(By.css('[data-testid="login-submit"]')).click();
      
      await driver.wait(until.elementLocated(By.css('[data-testid="user-flow"]')), 5000);
    });

    test('should navigate through user flow steps', async () => {
      // Step 1: Call & Support
      await driver.wait(until.elementLocated(By.css('[data-testid="support-page"]')), 5000);
      const supportTitle = await driver.findElement(By.css('[data-testid="support-title"]')).getText();
      expect(supportTitle).toContain('24/7 Call & Support');

      await driver.findElement(By.css('[data-testid="continue-button"]')).click();

      // Step 2: Dating
      await driver.wait(until.elementLocated(By.css('[data-testid="dating-page"]')), 5000);
      const datingTitle = await driver.findElement(By.css('[data-testid="dating-title"]')).getText();
      expect(datingTitle).toContain('Find Your Perfect Match');

      await driver.findElement(By.css('[data-testid="continue-button"]')).click();

      // Step 3: Nearby
      await driver.wait(until.elementLocated(By.css('[data-testid="nearby-page"]')), 5000);
      const nearbyTitle = await driver.findElement(By.css('[data-testid="nearby-title"]')).getText();
      expect(nearbyTitle).toContain('Discover Nearby Connections');

      await driver.findElement(By.css('[data-testid="get-started-button"]')).click();

      // Should redirect to main app
      await driver.wait(until.elementLocated(By.css('[data-testid="main-app"]')), 5000);
    });
  });

  describe('Dating App Functionality', () => {
    test('should display user profiles and allow interactions', async () => {
      // Navigate to main app (assuming user is logged in)
      await driver.get('http://localhost:3000/app');

      // Wait for profiles to load
      await driver.wait(until.elementsLocated(By.css('[data-testid="profile-card"]')), 5000);

      const profileCards = await driver.findElements(By.css('[data-testid="profile-card"]'));
      expect(profileCards.length).toBeGreaterThan(0);

      // Click on first profile
      await profileCards[0].click();

      // Profile modal should open
      await driver.wait(until.elementLocated(By.css('[data-testid="profile-modal"]')), 5000);

      // Test like button
      const likeButton = await driver.findElement(By.css('[data-testid="like-button"]'));
      await likeButton.click();

      // Should show match notification or close modal
      await driver.sleep(1000); // Wait for animation
    });
  });
});
```

#### 5.2 Cypress E2E Tests

```javascript
// cypress/integration/user-flow.spec.js
describe('User Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete full user registration and flow', () => {
    // Registration
    cy.get('[data-testid="signup-button"]').click();
    cy.get('[data-testid="fullname-input"]').type('Cypress Test User');
    cy.get('[data-testid="email-input"]').type('cypress@example.com');
    cy.get('[data-testid="password-input"]').type('SecurePass123!');
    cy.get('[data-testid="confirm-password-input"]').type('SecurePass123!');
    cy.get('[data-testid="register-submit"]').click();

    // User Flow Step 1
    cy.get('[data-testid="support-page"]').should('be.visible');
    cy.get('[data-testid="support-title"]').should('contain', '24/7 Call & Support');
    cy.get('[data-testid="continue-button"]').click();

    // User Flow Step 2
    cy.get('[data-testid="dating-page"]').should('be.visible');
    cy.get('[data-testid="dating-title"]').should('contain', 'Find Your Perfect Match');
    cy.get('[data-testid="continue-button"]').click();

    // User Flow Step 3
    cy.get('[data-testid="nearby-page"]').should('be.visible');
    cy.get('[data-testid="nearby-title"]').should('contain', 'Discover Nearby Connections');
    cy.get('[data-testid="get-started-button"]').click();

    // Main App
    cy.get('[data-testid="main-app"]').should('be.visible');
    cy.get('[data-testid="profile-card"]').should('have.length.greaterThan', 0);
  });

  it('should handle phone OTP verification', () => {
    cy.get('[data-testid="signup-button"]').click();
    cy.get('[data-testid="phone-tab"]').click();
    cy.get('[data-testid="phone-input"]').type('9876543210');
    cy.get('[data-testid="send-otp-button"]').click();

    // Mock OTP input
    cy.get('[data-testid="otp-input"]').type('123456');
    cy.get('[data-testid="verify-otp-button"]').click();

    // Should proceed to user flow
    cy.get('[data-testid="user-flow"]').should('be.visible');
  });

  it('should test responsive design on mobile', () => {
    cy.viewport('iphone-x');
    
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
    
    cy.get('[data-testid="signup-button"]').click();
    cy.get('[data-testid="registration-modal"]').should('be.visible');
    
    // Test mobile form layout
    cy.get('[data-testid="fullname-input"]').should('be.visible');
    cy.get('[data-testid="email-input"]').should('be.visible');
  });
});
```

### 6. Performance Testing

#### 6.1 Load Testing with Artillery

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"
    - duration: 60
      arrivalRate: 200
      name: "Peak load"
  payload:
    path: "./test-users.csv"
    fields:
      - "email"
      - "password"

scenarios:
  - name: "User Registration"
    weight: 20
    flow:
      - post:
          url: "/api/auth/register"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
            fullName: "Load Test User"
          capture:
            - json: "$.tokens.accessToken"
              as: "accessToken"

  - name: "User Login and Browse"
    weight: 60
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            - json: "$.tokens.accessToken"
              as: "accessToken"
      - get:
          url: "/api/users/nearby"
          headers:
            Authorization: "Bearer {{ accessToken }}"
          qs:
            lat: 19.0760
            lng: 72.8777
            radius: 10

  - name: "Matching Actions"
    weight: 20
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            - json: "$.tokens.accessToken"
              as: "accessToken"
      - get:
          url: "/api/users/nearby"
          headers:
            Authorization: "Bearer {{ accessToken }}"
          capture:
            - json: "$.users[0].id"
              as: "targetUserId"
      - post:
          url: "/api/matches/like/{{ targetUserId }}"
          headers:
            Authorization: "Bearer {{ accessToken }}"
```

#### 6.2 Database Performance Tests

```javascript
// performance.test.js
describe('Database Performance Tests', () => {
  test('should handle concurrent user queries efficiently', async () => {
    const startTime = Date.now();
    const concurrentQueries = 100;
    
    const promises = Array.from({ length: concurrentQueries }, () =>
      User.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [72.8777, 19.0760] },
            $maxDistance: 10000
          }
        }
      }).limit(20)
    );

    await Promise.all(promises);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
  });

  test('should optimize matching algorithm performance', async () => {
    // Create 1000 test users
    const users = Array.from({ length: 1000 }, () => TestDataFactory.createUser());
    await User.insertMany(users);

    const testUser = users[0];
    const startTime = Date.now();

    const matches = await matchingService.findMatches(testUser.id, {
      maxDistance: 50000,
      ageRange: [22, 35]
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(1000); // Should complete within 1 second
    expect(matches.length).toBeGreaterThan(0);
  });
});
```

### 7. Security Testing

#### 7.1 Authentication Security Tests

```javascript
// security.test.js
describe('Security Tests', () => {
  describe('Authentication Security', () => {
    test('should prevent brute force attacks', async () => {
      const userData = { email: 'test@example.com', password: 'wrongpassword' };
      
      // Attempt multiple failed logins
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(userData)
          .expect(401);
      }

      // Next attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/login')
        .send(userData)
        .expect(429);

      expect(response.body.message).toContain('Too many attempts');
    });

    test('should validate JWT tokens properly', async () => {
      const invalidToken = 'invalid.jwt.token';

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.message).toContain('Invalid token');
    });

    test('should sanitize user input', async () => {
      const maliciousInput = {
        email: 'test@example.com',
        fullName: '<script>alert("xss")</script>',
        bio: '{{ constructor.constructor("return process")().exit() }}'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(maliciousInput)
        .expect(400);

      expect(response.body.message).toContain('Invalid input');
    });
  });

  describe('Data Privacy', () => {
    test('should not expose sensitive user data', async () => {
      const user = await User.create(TestDataFactory.createUser());
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).not.toHaveProperty('__v');
    });

    test('should enforce user data access controls', async () => {
      const user1 = await User.create(TestDataFactory.createUser());
      const user2 = await User.create(TestDataFactory.createUser());
      const token1 = jwt.sign({ userId: user1.id }, process.env.JWT_SECRET);

      // User1 trying to access User2's private data
      const response = await request(app)
        .get(`/api/users/${user2.id}/private`)
        .set('Authorization', `Bearer ${token1}`)
        .expect(403);

      expect(response.body.message).toContain('Access denied');
    });
  });
});
```

#### 7.2 OWASP Security Tests

```javascript
// owasp-security.test.js
describe('OWASP Security Tests', () => {
  test('should prevent SQL injection attempts', async () => {
    const maliciousEmail = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: maliciousEmail,
        password: 'password'
      })
      .expect(400);

    expect(response.body.message).toContain('Invalid email format');
  });

  test('should prevent NoSQL injection', async () => {
    const maliciousQuery = {
      email: { $ne: null },
      password: { $ne: null }
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(maliciousQuery)
      .expect(400);

    expect(response.body.message).toContain('Invalid input');
  });

  test('should have proper CORS configuration', async () => {
    const response = await request(app)
      .options('/api/users/profile')
      .set('Origin', 'https://malicious-site.com')
      .expect(200);

    expect(response.headers['access-control-allow-origin']).not.toBe('*');
  });

  test('should set security headers', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .expect(401);

    expect(response.headers).toHaveProperty('x-content-type-options');
    expect(response.headers).toHaveProperty('x-frame-options');
    expect(response.headers).toHaveProperty('x-xss-protection');
  });
});
```

### 8. Browser Compatibility Testing

#### 8.1 Cross-Browser Test Configuration

```javascript
// browser-compatibility.test.js
const browsers = [
  { name: 'chrome', version: 'latest' },
  { name: 'firefox', version: 'latest' },
  { name: 'safari', version: 'latest' },
  { name: 'edge', version: 'latest' },
  { name: 'chrome', version: '90' }, // Older version
  { name: 'firefox', version: '88' }
];

describe('Browser Compatibility Tests', () => {
  browsers.forEach(browser => {
    describe(`${browser.name} ${browser.version}`, () => {
      let driver;

      beforeAll(async () => {
        driver = await createWebDriver(browser);
      });

      afterAll(async () => {
        await driver.quit();
      });

      test('should load homepage correctly', async () => {
        await driver.get('http://localhost:3000');
        
        const title = await driver.getTitle();
        expect(title).toContain('ConnectIndia');

        const heroSection = await driver.findElement(By.css('[data-testid="hero-section"]'));
        expect(await heroSection.isDisplayed()).toBe(true);
      });

      test('should handle responsive design', async () => {
        await driver.manage().window().setRect({ width: 375, height: 667 }); // iPhone size
        await driver.get('http://localhost:3000');

        const mobileMenu = await driver.findElement(By.css('[data-testid="mobile-menu-button"]'));
        expect(await mobileMenu.isDisplayed()).toBe(true);
      });

      test('should support modern JavaScript features', async () => {
        await driver.get('http://localhost:3000');
        
        const jsErrors = await driver.manage().logs().get('browser');
        const criticalErrors = jsErrors.filter(log => log.level.name === 'SEVERE');
        
        expect(criticalErrors).toHaveLength(0);
      });
    });
  });
});
```

### 9. Accessibility Testing

#### 9.1 WCAG Compliance Tests

```javascript
// accessibility.test.js
const axeCore = require('@axe-core/playwright');

describe('Accessibility Tests', () => {
  test('should meet WCAG 2.1 AA standards', async () => {
    await page.goto('http://localhost:3000');
    
    const results = await axeCore.analyze(page);
    
    expect(results.violations).toHaveLength(0);
  });

  test('should support keyboard navigation', async () => {
    await page.goto('http://localhost:3000');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);

    // Continue tabbing
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to activate with Enter/Space
    await page.keyboard.press('Enter');
    
    // Check if action was performed
    const modalVisible = await page.isVisible('[data-testid="auth-modal"]');
    expect(modalVisible).toBe(true);
  });

  test('should have proper ARIA labels', async () => {
    await page.goto('http://localhost:3000');
    
    const buttons = await page.$$('button');
    
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });

  test('should support screen readers', async () => {
    await page.goto('http://localhost:3000');
    
    // Check for semantic HTML
    const headings = await page.$$('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for alt text on images
    const images = await page.$$('img');
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});
```

### 10. Test Execution and Reporting

#### 10.1 Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/config/**',
    '!src/migrations/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 30000,
  maxWorkers: 4
};
```

#### 10.2 CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run security audit
        run: npm audit --audit-level high
      - name: Run OWASP ZAP scan
        uses: zaproxy/action-full-scan@v0.4.0
        with:
          target: 'http://localhost:3000'

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:performance
      - name: Upload performance results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: performance-results.json
```

This comprehensive testing plan ensures thorough validation of all application components, from individual functions to complete user workflows, while maintaining high standards for security, performance, and accessibility.