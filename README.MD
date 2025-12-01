# 🎛️ Portfolio Admin Panel

A content management system (CMS) designed to manage data for my personal portfolio website. Built with **Refine** for rapid internal tool development.

![Admin Panel Preview](https://via.placeholder.com/1200x600?text=Admin+Panel+Preview)

## 🎯 Purpose

This admin panel allows me to Create, Read, Update, and Delete (CRUD) content for my portfolio without touching the codebase or database directly.

## ✨ Features

* **🔐 Authentication:** Secure login via Supabase Auth.
* **🖼️ Image Upload:** Drag-and-drop upload directly to Supabase Storage (Buckets).
* **📝 Data Management:** Manage Projects, Experiences, Skills, Educations, and Achievements.
* **💅 UI Framework:** Clean interface using Ant Design.

## 🛠️ Tech Stack

* **Framework:** [Refine](https://refine.dev/)
* **UI Library:** [Ant Design](https://ant.design/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Backend:** [Supabase](https://supabase.com/) (Database & Auth)

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/USERNAME_ANDA/admin-portfolio-gigih.git](https://github.com/USERNAME_ANDA/admin-portfolio-gigih.git)
    cd admin-portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:5173](http://localhost:5173) (or the port shown in terminal).

## 📄 Database Schema (Supabase)

This app connects to the following tables:
* `projects` (id, title, slug, thumbnail, gallery, ...)
* `experiences` (id, company, role, start_date, is_current, ...)
* `skills` (id, name, category)
* `educations`
* `achievements`

---
*Built with ❤️ by Gigih Agung Prasetyo*