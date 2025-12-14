# Deployment Guide: Free Portfolio Hosting

This guide will walk you through deploying your Next.js portfolio for free using **Vercel** (frontend/API) and **MongoDB Atlas** (database).

## Prerequisites

*   A GitHub account.
*   The project code pushed to a GitHub repository.

## Step 1: Set up MongoDB Atlas (Free Database)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2.  Create a new project (e.g., "Portfolio").
3.  Click **Create** to build a database.
4.  Select **M0 Sandbox** (Free Tier).
5.  Select a provider (AWS) and a region close to you.
6.  Click **Create Deployment**.
7.  **Security Setup:**
    *   **Username/Password:** Create a database user. Remember the password!
    *   **IP Access List:** Click "Add My Current IP Address" AND "Allow Access from Anywhere" (0.0.0.0/0). This is required for Vercel to connect.
8.  **Get Connection String:**
    *   Click **Connect**.
    *   Select **Drivers**.
    *   Copy the connection string. It looks like:
        `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<password>` with your actual password.
    *   Add the database name at the end, e.g., `...mongodb.net/portfolio?retryWrites...`

## Step 2: Push Code to GitHub

1.  Initialize git if you haven't:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Push your code:
    ```bash
    git remote add origin <your-repo-url>
    git branch -M main
    git push -u origin main
    ```

## Step 3: Deploy to Vercel

1.  Go to [Vercel](https://vercel.com/signup) and sign up with GitHub.
2.  Click **Add New...** -> **Project**.
3.  Import your portfolio repository.
4.  **Configure Project:**
    *   Framework Preset: Next.js (should be auto-detected).
    *   Root Directory: `./` (default).
5.  **Environment Variables:**
    *   Click to expand "Environment Variables".
    *   Add `DATABASE_URL` and paste your MongoDB connection string from Step 1.
    *   Add `NEXTAUTH_SECRET` (generate a random string, e.g., using `openssl rand -base64 32` or just a long random text).
    *   Add `NEXTAUTH_URL` (set to your Vercel URL once deployed, or `http://localhost:3000` for now, Vercel usually handles this automatically but good to know).
6.  Click **Deploy**.

## Step 4: Finalize

1.  Wait for the build to complete.
2.  Once deployed, you will get a URL (e.g., `tara-prasad-portfolio.vercel.app`).
3.  **Seed the Database (Optional):**
    *   Since your database is empty, you might want to run your seed script.
    *   You can run this locally pointing to your production DB (update your local `.env` temporarily) OR use the Admin Panel you built to add data manually.

## Troubleshooting

*   **Connection Errors:** Ensure "Allow Access from Anywhere" (0.0.0.0/0) is enabled in MongoDB Atlas Network Access.
*   **Build Errors:** Check the Vercel logs. Common issues are missing environment variables or type errors.

## Admin Access

*   Go to `/admin/login` on your deployed site.
*   Since the DB is new, you'll need to create an initial admin user. You may need to manually insert one via MongoDB Atlas Data Explorer or use a setup script.
