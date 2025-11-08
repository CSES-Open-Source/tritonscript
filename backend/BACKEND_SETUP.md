# TritonScript Backend Setup Guide

Welcome! This guide will walk you through setting up the TritonScript backend from scratch. Follow each step carefully to get your development environment running.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start Checklist](#quick-start-checklist)
3. [Detailed Setup Instructions](#detailed-setup-instructions)
4. [Environment Variables Explained](#environment-variables-explained)
5. [Running the Backend](#running-the-backend)
6. [Testing Your Setup](#testing-your-setup)
7. [Common Issues & Solutions](#common-issues--solutions)
8. [Next Steps](#next-steps)

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed and configured:

### Required Software

- **Node.js** (v16 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- **npm** (comes with Node.js)
  - Check: `npm --version`

- **Git**
  - Check: `git --version`
  - Download: https://git-scm.com/

### Required Services

- **MongoDB** (Database)
  - Option A: Local installation
  - Option B: MongoDB Atlas (cloud, recommended for beginners)

- **AWS Account** (for S3 file storage)
  - You'll need AWS credentials with S3 access

---

## 🚀 Quick Start Checklist

Use this checklist to track your progress:

- [ ] Clone the repository
- [ ] Install Node.js dependencies
- [ ] Set up MongoDB (local or Atlas)
- [ ] Configure AWS S3
- [ ] Create and configure `.env` file
- [ ] Start the backend server
- [ ] Test the API endpoints

---

## 📖 Detailed Setup Instructions

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/CSES-Open-Source/tritonscript.git

# Navigate to the backend directory
cd tritonscript/backend
```

---

### Step 2: Install Dependencies

```bash
# Install all required npm packages
npm install
```

This will install:
- Express.js (web framework)
- Mongoose (MongoDB ODM)
- AWS SDK (for S3)
- TypeScript and development tools

**Expected output:** You should see a progress bar and "added XXX packages" message.

---

### Step 3: Set Up MongoDB

You have two options for MongoDB:

#### Option A: MongoDB Atlas (Recommended for Beginners)

1. **Create a free MongoDB Atlas account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Create a new cluster (choose the free tier)

2. **Configure database access:**
   - Click "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"

3. **Configure network access:**
   - Click "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict this to specific IPs

4. **Get your connection string:**
   - Click "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add `/tritonscript` at the end to specify the database name

**Example connection string:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/tritonscript
```

#### Option B: Local MongoDB Installation

1. **Install MongoDB:**
   - **macOS:** `brew install mongodb-community`
   - **Windows:** Download from https://www.mongodb.com/try/download/community
   - **Linux:** Follow instructions at https://docs.mongodb.com/manual/administration/install-on-linux/

2. **Start MongoDB:**
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # MongoDB should start automatically as a service
   ```

3. **Verify MongoDB is running:**
   ```bash
   # Try connecting with mongosh
   mongosh
   # You should see a MongoDB shell prompt
   # Type 'exit' to quit
   ```

4. **Your connection string will be:**
   ```
   mongodb://localhost:27017/tritonscript
   ```

---

### Step 4: Get AWS S3 Credentials

AWS S3 is used to store uploaded PDF files. **Good news!** Our teammate **Kabir** has already set up the AWS infrastructure and a shared IAM user for the team.

#### Getting Your AWS Credentials

**You don't need to create an AWS account or S3 bucket!** Kabir has provided a shared IAM user account. Follow these steps:

#### 4.1: Get IAM Login Credentials from Kabir

1. LOGIN W THIS:
   - **IAM Username** (for logging into AWS Console)
   - **IAM Password** (for logging into AWS Console)
   - **S3 Bucket Name** (usually `tritonscript-notebucket`)
   - **AWS Region** (usually `us-west-1`)



#### 4.2: Log into AWS Console

1. **Go to AWS Console:**
   - Navigate to https://console.aws.amazon.com/
   
2. **Sign in as IAM user:**
   - Select "IAM user"
   - Enter the **IAM username** Kabir provided
   - Enter the **IAM password** Kabir provided
   - Click "Sign in"

#### 4.3: Generate Your Personal Access Keys

Once logged into the AWS Console, you need to create your own access keys for the backend code:

1. **Navigate to Security Credentials:**
   - Click on your **username** in the top-right corner
   - Select "**Security credentials**" from the dropdown

2. **Create Access Keys:**
   - Scroll down to the "**Access keys**" section
   - Click "**Create access key**"
   - Select "**Application running outside AWS**" or "**Local code**"
   - Click "**Next**"
   - (Optional) Add a description like "TritonScript Backend Development"
   - Click "**Create access key**"

3. **Save Your Credentials:**
   - **⚠️ CRITICAL:** Copy both the **Access Key ID** and **Secret Access Key**
   - You won't be able to see the secret key again after closing this window!
   - Download the CSV file as a backup (store it securely, NOT in the repo)

**Your credentials will look like:**
- **Access Key ID:** Starts with `AKIA...` (e.g., `AKIAIOSFODNN7EXAMPLE`)
- **Secret Access Key:** Long random string (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)

#### Important Notes

⚠️ **Security Reminders:**
- **Never commit these credentials** to Git or share them publicly
- **Keep them in your `.env` file only** (which is gitignored)
- **Don't share screenshots** of your `.env` file
- Each developer generates their **own access keys** from the shared IAM user
- If your keys are compromised, you can delete them and create new ones

💡 **Why This Setup?**
- The IAM username/password is shared among the team (for AWS Console access)
- But each developer creates their own access keys (for code/API access)
- This way, if someone's keys get compromised, only their keys need to be revoked

💡 **Tip:** The S3 bucket and CORS settings shud have been set up but if not contact me or kabir

---

### Step 5: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Open the `.env` file in your text editor:**
   ```bash
   # Use your preferred editor
   code .env        # VS Code
   nano .env        # Terminal editor
   vim .env         # Vim
   ```

3. **Fill in your actual values:**

   ```env
   # Server Configuration
   PORT=5005
   NODE_ENV=development
   
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/tritonscript
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tritonscript
   
   # AWS S3 Configuration (Get these from Kabir or team documentation)
   AWS_ACCESS_KEY_ID=AKIA...get_from_kabir
   AWS_SECRET_ACCESS_KEY=wJalr...get_from_kabir
   AWS_REGION=us-west-1
   S3_BUCKET_NAME=tritonscript-notebucket
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```


---

## 🏃 Running the Backend

### Development Mode (with hot reload)

```bash
npm run dev
```

**What this does:**
- Starts the server using `nodemon`
- Automatically restarts when you make code changes
- Runs TypeScript files directly with `ts-node`

**Expected output:**
```
[nodemon] starting `ts-node src/server.ts`
Connected to MongoDB successfully
Server running on http://localhost:5005
```

### Production Mode

```bash
# Build TypeScript to JavaScript
npm run build

# Start the compiled server
npm start
```

---

## 🧪 Testing Your Setup

Once your backend is running, test these endpoints to make sure everything works correctly.

### 1. Check if the server is running

Open your browser and go to:
```
http://localhost:5005
```

You should see a response (might be a simple message or JSON).

### 2. Check MongoDB connection

Look at your terminal where the backend is running. You should see:
```
Connected to MongoDB successfully
Server running on http://localhost:5005
```

### 3. Verify S3 configuration

The server should start without errors. If there's an S3 configuration issue, you'll see an error message about AWS credentials.

---

## 📝 Testing Note Endpoints

**Note:** Authentication is currently disabled on note endpoints for testing purposes. Once the migration to Better Auth (DB sessions) is complete, authentication will be re-enabled and these examples will be updated.

---

## 📤 Step 1: Upload a Note to S3 (Create Your First Note)

Before you can test retrieving notes, you need to upload at least one note first! Uploading a file to S3 is a **3-step process**:

### 1.1: Get a Pre-signed Upload URL

First, request a pre-signed URL from the backend:

```bash
curl -X POST http://localhost:5005/api/notes/get-upload-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "cse100-notes.pdf",
    "fileType": "application/pdf"
  }'
```

**Expected Response:**
```json
{
  "uploadUrl": "https://tritonscript-notebucket.s3.us-west-1.amazonaws.com/...",
  "fileId": "1234567890-cse100-notes.pdf",
  "key": "notes/1234567890-cse100-notes.pdf"
}
```

**Save the `uploadUrl` and `fileId`** - you'll need them for the next steps!

---

### 1.2: Upload the File to S3

Use the pre-signed URL to upload your PDF directly to S3:

```bash
# Replace with your actual file path and the uploadUrl from Step 1
curl -X PUT "PASTE_UPLOAD_URL_HERE" \
  -H "Content-Type: application/pdf" \
  --upload-file /path/to/your/file.pdf
```

**Example:**
```bash
curl -X PUT "https://tritonscript-notebucket.s3.us-west-1.amazonaws.com/notes/1234567890-cse100-notes.pdf?X-Amz-Algorithm=..." \
  -H "Content-Type: application/pdf" \
  --upload-file ~/Desktop/cse100-notes.pdf
```

**Expected Response:** Empty response with HTTP 200 status (success!)

---

### 1.3: Create the Note Record in Database

After the file is uploaded to S3, save the note metadata to MongoDB:

```bash
curl -X POST http://localhost:5005/api/notes/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "CSE 100 Week 1 Notes",
    "classInfo": "CSE 100",
    "description": "Data structures and algorithms notes",
    "isPublic": true,
    "file_id": "1234567890-cse100-notes.pdf"
  }'
```

**Note:** Use the `fileId` from Step 1.1 as the `file_id` here!

**Expected Response:**
```json
{
  "message": "Note created successfully",
  "note": {
    "note_id": "1",
    "title": "CSE 100 Week 1 Notes",
    "classInfo": "CSE 100",
    "description": "Data structures and algorithms notes",
    "uploader": "testuser",
    "isPublic": true,
    "file_id": "1234567890-cse100-notes.pdf"
  }
}
```

🎉 **Congrats!** You've successfully uploaded your first note to S3 and saved it to MongoDB!

---

## 🔍 Step 2: Retrieve and Manage Notes

Now that you have at least one note in the database, you can test the retrieval endpoints!

### 2.1: Get All Notes

```bash
curl -X GET http://localhost:5005/api/notes
```

**Expected Response:**
```json
{
  "notes": [
    {
      "note_id": "1",
      "title": "CSE 100 Week 1 Notes",
      "classInfo": "CSE 100",
      "description": "Data structures and algorithms notes",
      "uploader": "testuser",
      "isPublic": true,
      "file_id": "1234567890-cse100-notes.pdf"
    }
  ]
}
```

---

### 2.2: Get a Specific Note by ID

```bash
curl -X GET http://localhost:5005/api/notes/1
```

**Expected Response:**
```json
{
  "note": {
    "note_id": "1",
    "title": "CSE 100 Week 1 Notes",
    "classInfo": "CSE 100",
    "description": "Data structures and algorithms notes",
    "uploader": "testuser",
    "isPublic": true,
    "file_id": "1234567890-cse100-notes.pdf"
  }
}
```

---

### 2.3: Download a Note from S3

Get a pre-signed download URL to download the PDF:

```bash
curl -X GET http://localhost:5005/api/notes/1/download
```

**Expected Response:**
```json
{
  "downloadUrl": "https://tritonscript-notebucket.s3.us-west-1.amazonaws.com/notes/1234567890-cse100-notes.pdf?X-Amz-Algorithm=..."
}
```

Copy the `downloadUrl` and paste it in your browser to download the PDF!

---

### 2.4: Delete a Note

```bash
curl -X DELETE http://localhost:5005/api/notes/1
```

**Expected Response:**
```json
{
  "message": "Note deleted successfully"
}
```

---

## 🚀 Complete Automated Test Script

Here's a complete example workflow you can copy-paste (replace the placeholders):

```bash
# 1. Get upload URL (auth currently disabled for testing)
UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:5005/api/notes/get-upload-url \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.pdf","fileType":"application/pdf"}')

echo "Upload Response: $UPLOAD_RESPONSE"

UPLOAD_URL=$(echo $UPLOAD_RESPONSE | grep -o '"uploadUrl":"[^"]*' | cut -d'"' -f4)
FILE_ID=$(echo $UPLOAD_RESPONSE | grep -o '"fileId":"[^"]*' | cut -d'"' -f4)

echo "Upload URL: $UPLOAD_URL"
echo "File ID: $FILE_ID"

# 2. Upload file to S3 (replace with your actual file path)
curl -X PUT "$UPLOAD_URL" \
  -H "Content-Type: application/pdf" \
  --upload-file ~/Desktop/test.pdf

# 3. Create note record
curl -X POST http://localhost:5005/api/notes/create \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Test Note\",\"classInfo\":\"CSE 100\",\"description\":\"Test upload\",\"isPublic\":true,\"file_id\":\"$FILE_ID\"}"
```

**Note:** Once authentication is migrated to Better Auth, authentication will be re-enabled and you'll need to include proper session/auth headers in these requests.

---

## ✅ What to Check

After running these tests, verify:

- ✅ MongoDB connection is successful
- ✅ S3 upload URL is generated successfully
- ✅ Files are uploaded to S3 bucket
- ✅ Note records are created in MongoDB
- ✅ Download URLs work and files can be downloaded
- ✅ All note endpoints respond correctly

**Note:** Authentication verification will be added once the migration to Better Auth is complete.

---

## 🔧 Common Issues & Solutions

### Issue 1: "Cannot find module" errors

**Problem:** Missing dependencies

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

---

### Issue 2: "MongoDB connection failed"

**Problem:** Can't connect to MongoDB

**Solutions:**

**For local MongoDB:**
```bash
# Check if MongoDB is running
# macOS
brew services list | grep mongodb

# Start MongoDB if not running
brew services start mongodb-community
```

**For MongoDB Atlas:**
- Verify your connection string is correct
- Check that your IP address is whitelisted
- Verify username and password are correct
- Make sure you replaced `<password>` in the connection string

---

### Issue 3: "AWS credentials are not configured"

**Problem:** Missing or incorrect AWS credentials

**Solutions:**
- Double-check your `.env` file has `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- Verify there are no extra spaces or quotes around the values
- Make sure you copied the full access key (starts with `AKIA`)
- Verify the secret key is the full long string

---

### Issue 4: "Port 5005 is already in use"

**Problem:** Another process is using port 5005

**Solution:**
```bash
# Find what's using the port (macOS/Linux)
lsof -i :5005

# Kill the process
kill -9 <PID>

# OR change the port in your .env file
PORT=5006
```

---


### Issue 6: TypeScript compilation errors

**Problem:** TypeScript type errors

**Solution:**
```bash
# Make sure you have TypeScript installed
npm install -D typescript

# Check your tsconfig.json exists
ls tsconfig.json

# Try rebuilding
npm run build
```

---

## 📚 Environment Variables Explained

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port number | `5005` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |
| `MONGO_URI` | **Yes** | MongoDB connection string | `mongodb://localhost:27017/tritonscript` |
| `AWS_ACCESS_KEY_ID` | **Yes** | AWS access key (from Kabir) | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | **Yes** | AWS secret key (from Kabir) | Long random string |
| `AWS_REGION` | No | AWS region for S3 | `us-west-1` |
| `S3_BUCKET_NAME` | **Yes** | S3 bucket name (from Kabir) | `tritonscript-notebucket` |
| `FRONTEND_URL` | No | Frontend URL for CORS | `http://localhost:5173` |

---


Congratulations! Your backend is now running. Here's what to do next:

### 1. Set up the Frontend
- Navigate to the `frontend` directory
- Follow the frontend setup instructions in the main README

### 2. Explore the API
- Check the API documentation (ask your team for the Notion link)
- Try making API requests with Postman or curl
- Test user registration and authentication

### 3. Start Contributing
- Read `CONTRIBUTING.md` for development guidelines
- Check the GitHub issues for tasks to work on
- Join your team's communication channel

### 4. Learn the Codebase
- **`src/models/`** - Database schemas (User, Note, etc.)
- **`src/routes/`** - API endpoints
- **`src/controllers/`** - Request handlers
- **`src/middleware/`** - Authentication, validation, rate limiting
- **`src/config/`** - Database and S3 configuration

---

## 🆘 Getting Help

If you're stuck:

5. **Open an issue** - Create a GitHub issue with details about your problem or ASK ME OR THANH OR IN THE GC

---

## 📝 Quick Reference Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check if MongoDB is running (macOS)
brew services list | grep mongodb

# Start MongoDB (macOS)
brew services start mongodb-community

# Check what's using a port
lsof -i :5005
```

---

## ⚠️ Security Reminders

- **Never commit your `.env` file** - It's already in `.gitignore`
- **Never share your AWS credentials** - Keep them secret
- **Rotate credentials regularly** - Especially for production
- **Use environment-specific configs** - Different credentials for dev/staging/production

---

## 🎉 You're All Set!

Your TritonScript backend is now running and ready for development. Happy coding!

If you found this guide helpful, consider improving it and submitting a PR to help future contributors.

---

**Last Updated:** November 2024  
**Maintained by:** TritonScript Team
