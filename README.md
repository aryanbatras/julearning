# JU Learning Portal

This is a modern, clean, and professional learning portal built with React, Vite, TailwindCSS, and Supabase.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```sh
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Set up environment variables**
    -   Create a `.env` file in the root of your project by copying the example file:
        ```sh
        cp .env.example .env
        ```
    -   Open your Supabase project dashboard.
    -   Go to **Project Settings** > **API**.
    -   Find your **Project URL** and **anon Public Key**.
    -   Add them to your `.env` file:
        ```
        VITE_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
        VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
        ```

### Running the Development Server

To start the local development server, run:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.

## 📦 Building for Production

To create a production-ready build of the application, run:

```sh
npm run build
```

This command will generate a `dist` folder in the root of your project, containing all the static files needed for deployment.

## 🌐 Deploying to Hostinger

You can easily deploy your static site on Hostinger.

1.  **Build your project** by running `npm run build`.
2.  **Log in to your Hostinger hPanel.**
3.  Navigate to **Websites** and click **Manage** on the desired website.
4.  In the sidebar, go to **Files** > **File Manager**.
5.  Open the `public_html` directory.
6.  **Upload the contents** of your local `dist` folder into `public_html`. You can do this by dragging and dropping the files or using the "Upload Files" button.
7.  That's it! Your website should now be live at your domain.

## ✨ Features

-   **User Authentication:** Secure sign-up and login for students and admins using Supabase Auth.
-   **Course Management:** Admins can create, update, and delete courses with details like price, PDFs, and video links.
-   **Student Dashboard:** Students can view available courses, enroll, and access their enrolled courses.
-   **Admin Dashboard:** A comprehensive dashboard for admins to manage courses, coupons, payments, team members, and the image gallery.
-   **Dynamic Content:** All content is fetched dynamically from the Supabase backend.
-   **Modern UI/UX:** Built with TailwindCSS and shadcn/ui for a clean, responsive, and professional look.
