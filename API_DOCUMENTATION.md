# LearnBack Detailed API Documentation

This document provides exact JSON request and response structures for all LearnBack API endpoints.

---

## 1. Authentication APIs
**Base URL:** `/api/auth`

### Register User
*   **Method:** `POST /register`
*   **Request Body:**
    ```json
    {
      "name": "Iliass",
      "email": "iliass@estin.dz",
      "password": "securepassword123",
      "role": "student"
    }
    ```
*   **Success Response (201):**
    ```json
    {
      "success": true,
      "data": "Registration successful! Please check your email to verify your account."
    }
    ```
*   **Error Response (400):**
    ```json
    {
      "success": false,
      "error": "Only @estin.dz emails are allowed"
    }
    ```

### Verify Email
*   **Method:** `GET /verify-email?token=TOKEN_HERE`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": "Email verified successfully! You can now log in."
    }
    ```

### Login User
*   **Method:** `POST /login`
*   **Request Body:**
    ```json
    {
      "email": "iliass@estin.dz",
      "password": "securepassword123"
    }
    ```
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "65f1a...",
        "name": "Iliass",
        "email": "iliass@estin.dz",
        "role": "student",
        "token": "eyJhbGci..."
      }
    }
    ```

---

## 2. User & Profile APIs
**Base URL:** `/api/users` (Requires Auth Header: `Authorization: Bearer <token>`)

### Get Own Profile
*   **Method:** `GET /profile`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "65f1a...",
        "name": "Iliass",
        "email": "iliass@estin.dz",
        "points": 500,
        "role": "student",
        "profile": { "bio": "Student", "avatar": "" },
        "createdAt": "2024-03-20T10:00:00Z"
      }
    }
    ```

### Update Profile
*   **Method:** `PUT /profile`
*   **Request Body:**
    ```json
    {
      "name": "Iliass NewName",
      "profile": { "bio": "Learner and Teacher" }
    }
    ```

### Get Points
*   **Method:** `GET /points`
*   **Success Response (200):**
    ```json
    { "success": true, "data": { "points": 100 } }
    ```

### Add User Skill
*   **Method:** `POST /addskill`
*   **Request Body:**
    ```json
    {
      "skillId": "65f1a...",
      "level": "Intermediate"
    }
    ```
*   **Success Response (201):**
    ```json
    {
      "success": true,
      "data": { "userId": "...", "skillId": "...", "level": "Intermediate", "source": "self-reported" }
    }
    ```

### Get My Skills
*   **Method:** `GET /getskill`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "65f1a...",
          "skillId": { "_id": "...", "name": "Python", "category": "Programming" },
          "level": "Intermediate",
          "source": "verified"
        }
      ]
    }
    ```

### Get My Enrolled Courses
*   **Method:** `GET /getusercourses`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        {
          "courseId": "65f1a...",
          "status": "unlocked",
          "unlockedAt": "..."
        }
      ]
    }
    ```

### Get User Reviews
*   **Method:** `GET /:userId/userreviews`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        {
          "rating": 5,
          "review": "excellent",
          "comment": "Nice explanation of Python basics",
          "reviewerId": { "name": "Ayoub", "email": "..." }
        }
      ]
    }
    ```

---

## 3. Skills APIs
**Base URL:** `/api/skills`

### List All Skills
*   **Method:** `GET /list`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        { "_id": "65f1a...", "name": "Python", "category": "Programming", "description": "..." }
      ]
    }
    ```

### Create New Skill (Admin Only)
*   **Method:** `POST /create`
*   **Request Body:**
    ```json
    {
      "name": "Rust",
      "description": "System programming language",
      "category": "Programming"
    }
    ```

---

## 4. Learning Goals APIs
**Base URL:** `/api/learninggoals`

### Add Learning Goal
*   **Method:** `POST /newgoal`
*   **Request Body:** `{ "skillId": "65f1a..." }`
*   **Success Response (201):**
    ```json
    {
      "success": true,
      "data": { "userId": "...", "skillId": "...", "createdAt": "..." }
    }
    ```

### Get My Learning Goals
*   **Method:** `GET /usergoal`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        { "skillId": { "_id": "...", "name": "Javascript" }, "userId": "..." }
      ]
    }
    ```

---

## 5. Matching & Roadmap APIs
**Base URL:** `/api/match` (Requires Auth)

### Find a Peer Match
*   **Method:** `POST /find`
*   **Request Body:** `{ "learnSkillId": "65f1a..." }`
*   **Success Response (201):**
    ```json
    {
      "success": true,
      "data": {
        "userAId": "your_id",
        "userBId": "peer_id",
        "teachSkillAId": "skill_you_teach",
        "teachSkillBId": "skill_you_learn",
        "status": "pending"
      }
    }
    ```

### Approve Match Proposal
*   **Method:** `PUT /:matchId/approve-match`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": { "status": "active", "activatedAt": "..." }
    }
    ```

### My Matches
*   **Method:** `GET /my-matches`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        {
          "matchId": "65f1a...",
          "peerName": "Ayoub",
          "skillYouTeach": "Python",
          "skillYouLearn": "Javascript",
          "status": "active"
        }
      ]
    }
    ```

### Incoming Match Requests
*   **Method:** `GET /requests`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [ { "matchId": "...", "requesterName": "Ayoub", "skillTheyTeach": "JS" } ]
    }
    ```

### Get Roadmap Steps
*   **Method:** `GET /:matchId/roadmap`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [ { "stepNumber": 1, "description": "...", "targetUserId": "..." } ]
    }
    ```

### Get Match Progress
*   **Method:** `GET /:matchId/progress`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": {
        "totalSteps": 6,
        "userA": { "completedSteps": [1, 3], "progressPercent": 33.3 },
        "userB": { "completedSteps": [2], "progressPercent": 16.6 },
        "roadmap": [ { "stepNumber": 1, "status": "completed", "isCurrentStep": false } ]
      }
    }
    ```

### Submit Step Quiz
*   **Method:** `POST /steps/:stepId/submit-quiz`
*   **Request Body:** `{ "answers": ["Option A", "Option C"] }`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": { "score": 100, "passed": true, "matchCompleted": false }
    }
    ```

### Review Match Peer
*   **Method:** `POST /:matchId/review`
*   **Request Body:** `{ "rating": 5, "review": "excellent", "comment": "Great!" }`

### Get Match Reviews
*   **Method:** `GET /:matchId/review`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [ { "reviewerId": "...", "rating": 5, "comment": "..." } ]
    }
    ```

---

## 6. Professional Courses APIs
**Base URL:** `/api/courses` (Requires Auth)

### List All Courses
*   **Method:** `GET /list`
*   **Success Response (200):**
    ```json
    { "success": true, "data": [ { "title": "Advanced Node.js", "requiredPoints": 200 } ] }
    ```

### Get Course Details
*   **Method:** `GET /:id`
*   **Success Response (200):**
    ```json
    { "success": true, "data": { "_id": "...", "title": "...", "content": "..." } }
    ```

### Create Course (Admin Only)
*   **Method:** `POST /create`
*   **Request Body:**
    ```json
    {
      "title": "Machine Learning 101",
      "description": "Basics of ML",
      "requiredPoints": 300,
      "content": "Course content here...",
      "difficulty": "Intermediate"
    }
    ```

### Unlock Course
*   **Method:** `POST /:id/unlock`
*   **Success Response (200):**
    ```json
    { "success": true, "data": { "status": "unlocked" } }
    ```
*   **Error (400):** `{ "success": false, "error": "Insufficient points" }`

### Complete Course
*   **Method:** `POST /:id/complete`
*   **Success Response (200):**
    ```json
    { "success": true, "data": { "status": "completed", "completedAt": "..." } }
    ```
*   **Note:** User earns **100 points** automatically.

---

## 7. Skill Verification APIs
**Base URL:** `/api/tests` (Requires Auth)

### Generate AI Skill Test
*   **Method:** `POST /generate`
*   **Request Body:**
    ```json
    {
      "skillId": "65f1a...",
      "skillName": "Python",
      "level": "Intermediate"
    }
    ```
*   **Success Response (201):**
    ```json
    { "success": true, "data": { "_id": "...", "questions": [...] } }
    ```

### Get Test by Skill
*   **Method:** `GET /:skillId`
*   **Success Response (200):**
    ```json
    { "success": true, "data": { "questions": [...] } }
    ```

### Take Verification Test
*   **Method:** `POST /:testId/take`
*   **Request Body:** `{ "answers": ["...", "..."] }`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": { "score": 85, "passed": true, "verification": "..." }
    }
    ```
*   **Note:** User earns **50 points** on success and becomes "Verified" for the skill.

### Get My Verifications
*   **Method:** `GET /verification`
*   **Success Response (200):**
    ```json
    { "success": true, "data": [ { "skillId": { "name": "Python" }, "passed": true } ] }
    ```

---

## 8. Admin Control APIs
**Base URL:** `/api/admin` (Requires Admin Token)

### Get User Details
*   **Method:** `GET /users/:userId`
*   **Success Response (200):**
    ```json
    { "success": true, "data": { "_id": "...", "name": "...", "role": "..." } }
    ```

### List All Users
*   **Method:** `GET /users`
*   **Success Response (200):**
    ```json
    { "success": true, "data": [ { "name": "Iliass", "role": "student" } ] }
    ```

### Get User Skills
*   **Method:** `GET /users/:userId/skills`
*   **Success Response (200):**
    ```json
    { "success": true, "data": [ { "skillId": { "name": "Python" }, "level": "..." } ] }
    ```

### List All Matches
*   **Method:** `GET /matches`
*   **Success Response (200):**
    ```json
    { "success": true, "data": [ { "_id": "...", "status": "active" } ] }
    ```

### Get Match Details
*   **Method:** `GET /matches/:matchId`

### List All Courses
*   **Method:** `GET /courses`

### Get Skill Details
*   **Method:** `GET /skills/:skillId`

### Force Complete Match
*   **Method:** `PUT /matches/:matchId/force-update`
*   **Request Body:** `{ "status": "completed" }`
*   **Success Response (200):** `{ "success": true, "data": { "status": "completed" } }`

### Delete User (Safety Cleanup)
*   **Method:** `DELETE /users/:userId`
*   **Success Response (200):**
    ```json
    { "success": true, "message": "User and all related data deleted successfully" }
    ```
