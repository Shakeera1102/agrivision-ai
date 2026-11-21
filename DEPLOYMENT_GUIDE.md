# AgriVision AI - Step-by-Step Deployment Guide

This guide explains how to deploy your **AgriVision AI** application to the cloud so anyone can access it via a public website link.

---

## Why Hugging Face Spaces is Recommended (100% Free)

For Machine Learning projects, **Hugging Face Spaces** is the easiest and most reliable option:
- **100% Free** (No credit card needed).
- **16 GB RAM** (Plenty of memory for TensorFlow and your 171 MB SVM model).
- Free public HTTPS link: `https://yourname-agrivision-ai.hf.space`.
- Native support for large model files (`.joblib` files up to several GB).

---

## Method 1: Deploy on Hugging Face Spaces (Step-by-Step)

### Step 1: Create a Free Hugging Face Account
1. Go to [https://huggingface.co/join](https://huggingface.co/join).
2. Sign up with your email.

### Step 2: Create a New Space
1. Go to [https://huggingface.co/new-space](https://huggingface.co/new-space).
2. Enter Space Name: `agrivision-ai`
3. License: Select `MIT` or `OpenRAIL`.
4. Select Space SDK: Choose **Docker** -> Select **Blank**.
5. Space Hardware: Choose **CPU basic (Free - 2 vCPU, 16 GB RAM)**.
6. Visibility: **Public**.
7. Click **Create Space**.

### Step 3: Install Git LFS (Large File Storage)
Because `SVM_Hybrid_Res_Eff_PCA.joblib` is 171 MB, Git LFS is required:
1. Open PowerShell or Command Prompt on your computer.
2. Run:
   ```bash
   git lfs install
   ```

### Step 4: Push Your Project to the Space
In your terminal, navigate to your project folder and push:
```bash
cd "c:\Users\shaik\Downloads\Desktop\Concepts\AI or Machine Learning\Agri_Vision\AgriVision-AI"

# Initialize git if not already initialized
git init

# Track large joblib and h5 model files with Git LFS
git lfs track "*.joblib"
git lfs track "*.h5"
git add .gitattributes

# Add all files
git add .
git commit -m "Deploy AgriVision AI with Docker and authentic models"

# Link to your Hugging Face Space repository (replace YOUR_USERNAME)
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/agrivision-ai

# Push to Hugging Face
git branch -M main
git push -u origin main
```

*(When prompted for a password, generate an Access Token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) with "Write" permissions and paste it as your password).*

### Step 5: View Your Live App!
Hugging Face will automatically build the Docker image and start the app.
After 2-3 minutes, your live web application will be accessible at:
`https://huggingface.co/spaces/YOUR_USERNAME/agrivision-ai`

---

## Method 2: Share Instantly on Your Local Wi-Fi (No Cloud Required)

If you just want to demonstrate the application to someone nearby (e.g. on your phone, laptop, or college network):

1. Find your computer's local IP address:
   - Open PowerShell and type: `ipconfig`
   - Look for **IPv4 Address** (for example: `192.168.1.15`).
2. Start the server on `0.0.0.0`:
   ```powershell
   cd "c:\Users\shaik\Downloads\Desktop\Concepts\AI or Machine Learning\Agri_Vision\AgriVision-AI\backend"
   & "C:\Users\shaik\AppData\Local\Programs\Python\Python311\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
3. Any phone, tablet, or laptop connected to the same Wi-Fi can now open:
   `http://192.168.1.15:8000`

---

## Method 3: Deploy on Render.com

1. Push your repository to GitHub.
   *(Make sure to use `git lfs` for the 171 MB `.joblib` model file).*
2. Go to [render.com](https://render.com) and create a free account.
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configuration:
   - **Environment**: `Docker`
   - **Plan**: `Free`
6. Click **Create Web Service**.
