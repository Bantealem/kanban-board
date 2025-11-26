Kanban Board React App
Project Description

This is a dynamic Kanban Board built with React, Tailwind CSS, and Axios, featuring drag & drop functionality using @hello-pangea/dnd. The application fetches and updates tasks from DummyJSON API, allowing users to organize tasks across three columns: To Do, In Progress, and Done.

This project is designed to be fully responsive, supports dark and light themes, and includes a language toggle for English and Italian, making it versatile and user-friendly for different devices and audiences.

Features

Drag & Drop Tasks: Move tasks seamlessly between columns.

API Integration: Fetch, add, update, and delete tasks via DummyJSON API.

Responsive Design: Works on mobile, tablet, and desktop devices.

Dark/Light Theme: Toggle between dark and light modes.

Language Toggle: Switch between English and Italian for all labels and column titles.

Modern UI: Clean, minimal design with Tailwind CSS styling.

Scalable Architecture: Component-based structure for easy maintenance and expansion.

Technologies Used

Frontend: React, Tailwind CSS

State Management: React Hooks (useState, useEffect)

Drag & Drop: @hello-pangea/dnd

API Calls: Axios

Backend: DummyJSON (fake online REST API)

Version Control: Git & GitHub

Folder Structure
src/
 ├─ api/
 │    ├─ api.js         # Axios instance
 │    └─ tasks.js       # API functions for CRUD operations
 ├─ components/
 │    ├─ KanbanBoard.jsx
 │    ├─ Column.jsx
 │    └─ TaskCard.jsx
 ├─ constants.js        # Column titles and translations
 ├─ App.jsx
 └─ index.css

Installation & Running

Clone the repository:

git clone https://github.com/YourUsername/kanban-board.git
cd kanban-board


Install dependencies:

npm install


Run the development server:

npm run dev


Open in your browser:

http://localhost:5173

Usage

Drag and drop tasks to reorganize.

Use the language toggle in the header to switch between English and Italian.

Use the theme toggle in the header to switch between dark and light modes.

Add, edit, or delete tasks (if implemented) using the task controls.

Future Improvements

Add user authentication for multiple users.

Persist tasks in a real backend database.

Add task priorities and deadlines.

Implement task search and filter functionality.

Live Demo

(Optional: Add a link if deployed, e.g., Vercel or Netlify)

Author

Bantealem Geto Assefa – Full-Stack Developer | React & Data Science Enthusiast
