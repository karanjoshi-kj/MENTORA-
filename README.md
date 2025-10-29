# 🎓 Student Counseling Portal

A full-stack MERN-inspired portal (Express, Node, MongoDB, HTML/CSS) for managing the entire student counseling journey: from sign-up to seat allocation, fee payment, verification, and offer letter delivery. Built to streamline counseling for institutions with separate flows for students and admins.

---

## 🚀 Key Features

### 🔐 Role-Based Authentication
- Separate flows for **students** and **staff/admins**
- Secure login/signup with session or JWT secrets

### 📝 Student Workflow
- Stepwise process: Welcome → Student Sign Up → Dashboard → Success → Sign In → Status
- Conditional seat allocation by admin
- Dynamic dashboard for current seat status and fee payment options
- Payment and receipt upload (if allocated)
- Download offer letter when approved

### 🧑‍💼 Admin Dashboard
- View all student profiles & preferences
- Allocate seats and manage admission status
- Verify uploaded payment receipts
- Upload official offer letters for students

### 📄 Offer Letter Management
- PDF/JPG offer letters uploaded by admin
- Downloadable by students once approved

---

## 🌐 App Flow

1. **Welcome Page**
2. [Student] **Sign Up** → **Dashboard** → **Successful Signup Notice**
3. **Sign In** (Student/Admin)
4. [Student] **Status Page**: shows if seat is not allocated / conditionally allocated / payment pending / verified / offer available.
5. **Payment Section**: Appears after conditional seat allocation
6. **Admin** verifies payment, uploads offer letter
7. **Student** downloads final offer letter

**Each step is in a standalone folder with its own HTML/CSS/JS.**

---

## 🛠️ Tech Stack

| Layer      | Technology      |
|------------|----------------|
| Backend    | Node.js, Express|
| Database   | MongoDB (Atlas/local)|
| Frontend   | HTML, CSS, Vanilla JS|
| Auth       | JWT or session-based|
| File Upload| Multer/Express|
| PDF/Image  | (Admin upload or static)|

---

## 📁 Project Structure

```
Student_Counseling_Portal/
├── admindashboard/
├── AdminRouter/
├── adminsignin/
├── adminsignup/
├── errorpage/
├── logout/
├── middleware/
├── node_modules/
├── payment/
├── profilepage/
├── studentdashboard/
├── StudentRouter/
├── studentsignin/
├── studentsignup/
├── studentstatus/
├── successsignup/
├── welcomepage/
├── .env
├── .env.example
├── config.js
├── db.js
├── express.js
└── package-lock.json
```

---

## ⚡ Setup Instructions

### 1️⃣ Prerequisites

- Node.js & npm installed locally
- MongoDB Atlas or local MongoDB instance
- Git

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Student_Counseling_Portal.git
cd Student_Counseling_Portal
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Configure Environment Variables

- Copy `.env.example` to `.env`  
  `cp .env.example .env`
- Open `.env` and:
  - Add your **MongoDB connection URL** (from MongoDB Atlas or local)
  - Set **JWT/session secrets** for student and admin auth

### 5️⃣ Start the Project

```bash
node express.js
# or, if you have a start script in package.json
npm start
```
The server will run (by default) at [http://localhost:3000](http://localhost:3000).

---

## 🔑 Configuration Files

- **`.env`**: Your actual local configuration, with secrets and DB URLs (should NOT be committed!)
- **`.env.example`**: A template for required environment variables for new developers
- **`config.js`**: Additional configuration settings for the project (e.g., app constants, directory paths)

---

## 🛤️ Routing Flow & Pages

- **welcomepage/**: Welcome and introduction
- **studentsignup/**: Student registration
- **successsignup/**: Confirmation of successful registration
- **studentsignin/**: Student log in
- **studentdashboard/**: Student's dashboard after login
- **studentstatus/**: Shows current application and seat status
- **payment/**: Payment submission (if seat allocated)
- **profilepage/**: View/edit student profile
- **admindashboard/**: Admin control panel for managing students, allocations, and offer letters
- **adminsignup**, **adminsignin**: Separate admin auth flows
- **logout/**: Logout logic and redirection
- **errorpage/**: User-friendly error and fallback pages

---

## 🗄️ Database

Uses MongoDB. Create your database on MongoDB Atlas or locally, and paste the connection URI in `.env`.

---

## 📄 Environment Variables

**.env.example** will look something like:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority
STUDENT_JWT_SECRET=your_student_jwt_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret
PORT=3000
```

**Don't remove .env.example and never commit your .env!**

---

## 🌟 Future Enhancements

- Automated seat allocation algorithms
- Real-time status updates (using websockets)
- Notification Emails/SMS integrations
- Robust offer letter PDF generator
- Analytics dashboards for admin users
- 2FA and enhanced security
- Responsive & mobile-friendly UI

---

## 🤝 Contributing

Your contributions are welcome! Please fork the repo, create a branch, commit your changes, and open a pull request.

---


**Made with love by Bhavesh Joshi, now with 100% more drama, less paperwork, and absolutely zero counseling couches!**
