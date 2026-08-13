# Multi-Tenant CRM Platform

A full-stack, multi-tenant Customer Relationship Management (CRM) application built with **Node.js/Express** on the backend and **React (Vite)** on the frontend. The system provides workspace isolation, lead management, role-based access control (RBAC), and full audit log tracking.

---

## 🌟 Key Features

- **Multi-Tenant Workspace Isolation:** Strict workspace filtering across all controllers ensures cross-tenant data privacy.
- **Lead Management:** Create, view, update, delete, and add notes to leads with paginated data fetching.
- **Role-Based Access Control (RBAC):** Admin, Manager, and Member permission levels for secure user and system management.
- **Audit Logging:** System activities and security events are logged with user and workspace associations.
- **Lead Discovery:** Integrated tools for discovering prospective leads.
- **Fast Frontend:** Powered by React, Vite, and HMR for modern web performance.

---

## 🛠️ Project Structure

```text
CRM-NEW/
└── CRM-master/
    ├── crm-backend/    # Express API, Sequelize ORM, SQLite/PostgreSQL
    └── crm-frontend/   # React, Vite, CSS / Tailwind