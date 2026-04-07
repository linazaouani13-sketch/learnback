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

## 3. Matching & Roadmap APIs
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
        "status": "pending",
        "matchApprovedByA": false,
        "matchApprovedByB": false
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
      "data": [
        {
          "matchId": "65f1a...",
          "requesterName": "Ayoub",
          "skillTheyTeach": "Javascript",
          "skillTheyWantToLearn": "Python"
        }
      ]
    }
    ```

### Get Roadmap Steps
*   **Method:** `GET /:matchId/roadmap`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        {
          "stepNumber": 1,
          "description": "Learn syntax",
          "targetUserId": "...",
          "quiz": {
            "questions": [
              { "question": "What is Python?", "options": ["A", "B", "C"], "id": "q1" }
            ],
            "passingScore": 70
          }
        }
      ]
    }
    ```

### Submit Quiz
*   **Method:** `POST /steps/:stepId/submit-quiz`
*   **Request Body:** `{ "answers": ["Option A", "Option C", "Option B"] }`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": {
        "score": 100,
        "passed": true,
        "stepCompleted": true,
        "matchCompleted": false
      }
    }
    ```
*   **Note:** If `matchCompleted: true`, users earn **100 points** shared reward.

### Review Match Peer
*   **Method:** `POST /:matchId/review`
*   **Request Body:**
    ```json
    {
      "rating": 5,
      "review": "excellent",
      "comment": "Very helpful!"
    }
    ```
*   **Success Response (201):**
    ```json
    {
      "success": true,
      "data": { "reviewerId": "...", "rating": 5, "comment": "Very helpful!" }
    }
    ```

---

## 4. Professional Courses APIs
**Base URL:** `/api/courses` (Requires Auth)

### Unlock Course
*   **Method:** `POST /:id/unlock`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": { "userId": "...", "courseId": "...", "status": "unlocked" }
    }
    ```
*   **Error (400):** `{ "success": false, "error": "Insufficient points" }`

### Complete Course
*   **Method:** `PUT /:id/complete`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Course marked as completed" 
    }
    ```
*   **Note:** User earns **100 points** automatically.

---

## 5. Skill Verification APIs
**Base URL:** `/api/tests` (Requires Auth)

### Take Verification Test
*   **Method:** `POST /:testId/take`
*   **Request Body:** `{ "answers": ["...", "..."] }`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": {
        "score": 85,
        "passed": true,
        "verification": "65f1a..."
      }
    }
    ```
*   **Note:** User earns **50 points** on success and gets "Verified" status for the skill.

---

## 6. Admin Control APIs
**Base URL:** `/api/admin` (Requires Admin Token)

### List Users
*   **Method:** `GET /users`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        { "name": "Iliass", "role": "student", "points": 100 },
        { "name": "Admin", "role": "admin" }
      ]
    }
    ```

### Force Complete Match
*   **Method:** `PUT /matches/:matchId/force-update`
*   **Request Body:** `{ "status": "completed" }`
*   **Success Response (200):** `{ "success": true, "data": { "status": "completed" } }`

### Delete User (Safety Cleanup)
*   **Method:** `DELETE /users/:userId`
*   **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "User and all related data deleted successfully"
    }
    ```
