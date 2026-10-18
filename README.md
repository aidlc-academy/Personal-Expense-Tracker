# 💰 Personal Expense Tracker

A full-stack web application designed to help users manage their personal finances by tracking income and expenses.

## 📌 Project Overview

The Personal Expense Tracker helps users record, organize, and monitor their income and expenses through a user-friendly web interface.

The application uses modern frontend and backend technologies to provide a foundation for personal financial management.

## 🎯 Objectives

- Track daily income and expenses.
- Organize financial transactions.
- Monitor spending habits.
- Display financial information through dashboards and charts.
- Develop practical full-stack web development skills.

## ✨ Features

- Income and expense tracking.
- Financial transaction management.
- Dashboard for financial summaries.
- Data visualization using charts.
- Input validation where implemented.
- Responsive user interface, if supported by the current design.

## 🛠️ Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Axios
- React Hook Form
- Zod
- Lucide React

### Backend
- Node.js
- Express.js

### Database
- Prisma ORM
- SQLite, if configured in the project

### Development Tools
- Kiro IDE
- Git
- GitHub
- npm

## 📂 Project Structure

```text
Personal-Expense-Tracker/
├── client/
│   ├── src/
│   └── package.json
├── server/
│   ├── src/
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The exact structure may differ depending on the implementation.

## ⚙️ Prerequisites

Install the following before running the project:

- Node.js (a version compatible with the project dependencies)
- npm
- Git

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aidlc-academy/Personal-Expense-Tracker.git
```

### 2. Navigate to the Project

```bash
cd Personal-Expense-Tracker
```

### 3. Install Dependencies

Install dependencies in the directories that contain a `package.json` file.

For example, if the frontend and backend have separate dependencies:

```bash
cd client
npm install
```

Open a second terminal from the project root and run:

```bash
cd server
npm install
```

If your project uses a root-level workspace configuration, follow the installation instructions defined in the root `package.json` instead.

### 4. Configure Environment Variables

Check the `.env.example` file for the required environment variables.

Create the necessary `.env` files in the locations expected by the application.

Never upload passwords, API keys, or other secrets to GitHub.

### 5. Start the Backend Server

Open a terminal in the backend directory:

```bash
cd server
npm run dev
```

This command works only if the backend `package.json` defines a `dev` script.

Check the terminal output for the actual server address and port.

### 6. Start the Frontend

Open another terminal in the frontend directory:

```bash
cd client
npm run dev
```

Vite typically displays a local development URL in the terminal.

For example:

```text
http://localhost:5173
```

Open the exact URL printed by Vite in your browser.

## 🌐 Localhost URLs

The following are examples. Confirm the actual ports from your project configuration.

| Component | Example URL | Purpose |
|---|---|---|
| Frontend | http://localhost:5173 | Opens the web application |
| Backend API | http://localhost:3000 | Example backend server address |
| Database | Depends on configuration | Stores application data |

**Note:** The frontend and backend may use different ports. The backend URL above is only an example and is not necessarily a webpage you can open directly.

## 🧪 Testing

Check the available scripts in the frontend and backend `package.json` files.

If testing scripts are configured, run the corresponding commands, such as:

```bash
npm test
```

Only use this command if the relevant `package.json` defines a test script.

Verify the implemented functionality, including:

- Application startup.
- Income and expense operations.
- Form validation.
- Dashboard calculations.
- Backend API responses.
- Database operations.

## 🔐 Security

- Keep secret credentials in environment variables.
- Do not commit `.env` files containing sensitive information.
- Use `.env.example` to document required configuration variables without exposing their values.

## 🚀 Future Enhancements

Potential improvements include:

- Budget planning.
- Monthly financial reports.
- Enhanced financial analytics.
- Recurring transactions.
- Additional data visualization.
- Secure user authentication, if not already implemented.

## 🎓 Learning Outcomes

This project provides practical experience with frontend development, backend APIs, database integration, debugging, environment configuration, and GitHub version control.

## 🏁 Conclusion

The Personal Expense Tracker demonstrates how full-stack web development technologies can be used to build an application for organizing personal financial information.

## 👨‍💻 Project Information

- **Project Name:** Personal Expense Tracker
- **Project Type:** Full-Stack Web Application
- **Development Tool:** Kiro IDE
- **Repository:** https://github.com/aidlc-academy/Personal-Expense-Tracker
