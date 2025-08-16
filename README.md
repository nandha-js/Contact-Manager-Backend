# 📇 Contact Manager 

A React-based frontend for managing contacts — built with **Vite**, **React Router**, **Axios**, and **TailwindCSS**.  
This app connects to the Contact Manager backend API to perform **CRUD** operations (Create, Read, Update, Delete).

---

Features
Add Contact: User-friendly form to add new contacts with validation.

Edit Contact: Update existing contacts with pre-filled forms.

Delete Contact: Remove contacts with confirmation prompts.

Search: Real-time contact search by name.

Sort: Sort contacts by recent, name ascending, or name descending.

Responsive Design: Works well on mobile, tablet, and desktop devices.

Advanced UI: Modern, clean interface using Tailwind CSS with animations and accessibility in mind.

API Integration: Centralized API helper functions to interact with backend services.

---

## 🛠 Tech Stack
- **React + Vite** for fast frontend development
- **React Router DOM** for page navigation
- **Axios** for API calls
- **TailwindCSS** for styling
- **JavaScript (ES6)**

---

Usage
Use the search bar to filter contacts by name in real-time.

Sort contacts using the dropdown (by recent added or alphabetically).

Click “Add New Contact” to open a form for adding a contact.

Edit or delete contacts using the buttons on each contact card.

Forms validate input fields with immediate feedback.


---

## 🔗 API Endpoints Used
- **GET** `/api/contacts` → fetch all contacts
- **POST** `/api/contacts` → create a contact
- **GET** `/api/contacts/:id` → fetch one contact
- **PUT** `/api/contacts/:id` → update contact
- **DELETE** `/api/contacts/:id` → delete contact

---



