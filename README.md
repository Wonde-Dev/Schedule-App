# 📱 Schedule App (React Native + Expo)

A simple and efficient **Schedule Management Mobile App** built using **React Native** and **Expo**. The app allows users to create, view, and delete daily schedules in a clean and easy-to-use interface.

---

## 📌 Project Overview

The Schedule App helps users organize their daily tasks and events. It is designed for simplicity, speed, and smooth user experience.

You can:

- Create new schedules
- View all saved schedules
- Delete completed or unwanted schedules
- Navigate easily between screens

---

## ✨ Features

- 🏠 Home screen displaying all schedules
- ➕ Add new schedule with title and details
- 📅 Schedule listing page for organized view
- 🗑️ Delete schedule functionality
- ⚡ Fast performance using Expo
- 📱 Cross-platform (Android & iOS)

---

## 🖼️ App Screenshots (Preview)

> Add your images inside `/assets` folder

### 🏠 Home Screen

![Home](https://github.com/Wonde-Dev/Schedule-App/blob/8257fdda29d91e74b3809ec0b1b1cba30fff005d/assets/images/home.jpg)

### 📅 Schedule Screen

![Schedule](./assets/schedule.png)

### ➕ Add Schedule Screen

![Add](./assets/add.png)

### 🗑️ Delete Schedule Screen

![Delete](./assets/delete.png)

---

## 🧠 What This App Includes (Core Functionality)

### 1. Home Screen

- Displays all saved schedules
- Shows list of tasks in an organized format
- Navigation to add new schedules

### 2. Add Schedule Screen

- Input fields for schedule title and description
- Save button to store data
- Validations for empty inputs

### 3. Schedule Management

- Displays all created schedules
- Allows users to scroll and view items easily

### 4. Delete Functionality

- Remove schedules individually
- Instant UI update after deletion

### 5. Navigation System

- Smooth navigation between screens using React Navigation
- Home → Add → Schedule flow

---

## 🛠️ Tech Stack

- React Native
- Expo
- JavaScript (ES6+)
- React Navigation
- AsyncStorage (for local storage)

---

## 📁 Project Structure

```bash
schedule-app/
├── assets/
│   ├── home.png
│   ├── schedule.png
│   ├── add.png
│   └── delete.png
│
├── components/
│   └── (reusable UI components)
│
├── screens/
│   ├── HomeScreen.js
│   ├── AddScheduleScreen.js
│   ├── ScheduleScreen.js
│   └── DeleteScreen.js
│
├── navigation/
│   └── AppNavigator.js
│
├── App.js
└── package.json
### and You can use :
🚀 How to Run This Project
Step 1: Clone the repository
git clone https://github.com/your-username/schedule-app.git
cd schedule-app
Step 2: Install dependencies

Install all required packages:

npm install

or

yarn install
Step 3: Start the Expo server

Run the project using Expo:

npx expo start
Step 4: Open on device
Install Expo Go on your mobile phone
Scan the QR code from terminal or browser
The app will open instantly
Step 5: Build (Optional)

If you want APK or production build:

eas build
```
