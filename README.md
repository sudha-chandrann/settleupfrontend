# Settle Up

**Settle Up** is a mobile app for managing shared expenses, splitting bills, and tracking balances with friends, roommates, or groups. Built with React Native and backed by a Node.js + MongoDB API.

---

## 🚀 MVP Features

- ✅ User Registration & Login (JWT Auth)
- ✅ Create & Join Groups
- ✅ Add, Edit & Delete Expenses
- ✅ View Individual and Group Balances
- ✅ Simple Activity Feed

---

## 🛠️ Tech Stack

### Frontend (Mobile App)
- React Native + TypeScript
- React Navigation
- Axios (for API calls)
- React Hook Form (form validation)
- Day.js (date formatting)

### Backend (API Server)
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for Authentication
- Bcrypt for Password Hashing
- RESTful API structure

---

## 📦 Installation

### Prerequisites
- Node.js ≥ 16.x
- Expo CLI (`npm install -g expo-cli`)
- MongoDB (Atlas or local instance)

---

### 🔧 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev