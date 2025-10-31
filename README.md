# TritonScript

TritonScript is a collaborative note-taking application designed for UCSD students for sharing courses materials for academic purposes. The application is built with MERN technologies.

## Features

- Secure user authentication with JWT
- Collaboration on shared notes
- Permission-based access control
- UCSD email validation for institutional access
- Cloud storage integration with AWS S3
- Responsive design for all devices

## Tech Stack

### Backend

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (configured in [`database.ts`](backend/src/config/database.ts))
- **Storage:** AWS S3 for file uploads
- **Authentication:** JWT
- **Validation:** UCSD email SSO

### Frontend

- **Build Tool:** Vite
- **Framework:** React with TypeScript
- **Package Manager:** pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v7 or higher) - Install with `npm install -g pnpm`
- **MongoDB**
- **AWS Account**
- **Git**

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/CSES-Open-Source/tritonscript
cd tritonscript
```

---

## Backend Setup

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5005
NODE_ENV=development

# Database Configuration
Please check credentials on Notion to see MongoDB account

# JWT Configuration (I will update this after our first meeting)
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# AWS S3 Configuration (I will update later)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-west-1
S3_BUCKET_NAME=...

```

**Important Security Notes:**

- Never commit the `.env` file to version control


### 4. Start the Backend Server

For development with hot reload:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

The backend server will start on **`http://localhost:5005`**

### 6. Test the Backend 

(We might discuss during the meeting)
---

## Frontend Setup

### 1. Navigate to the Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables (Optional)

If you need to customize the backend URL, create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5005
VITE_R2_DEV_URL=https://pub-c4bcfcae9e554e6299c18086ac5b349a.r2.dev/
```

The default configuration is already set in [`config.ts`](frontend/src/utils/config.ts).

### 4. Start the Development Server

```bash
pnpm dev
```

The frontend will start on **`http://localhost:5173`**

### 5. Build for Production (Optional)

```bash
pnpm build
```
---

## Running the Full Application

To run both frontend and backend concurrently:

### Option 1: Using Two Terminal Windows

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
pnpm run dev
```

---

## Project Structure

```
tritonscript/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and S3 configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, rate limiting
│   │   ├── models/          # Database models (User, Note, Permission)
│   │   └── routes/          # API route definitions
│   └── tests/               # Backend tests
├── frontend/
│   ├── src/
│   │   └── assets/           # images and icons
│   │   └── components/
│   │   └── pages/ 
│   │   └── utils/ 
│   └── public/              # Static assets
```

---

## API Documentation

Please check out the Notion
---

## Troubleshooting

### Backend Issues

**Database connection error:**

- Check your `DATABASE_URL` in `.env`
- Check if MongoDB is running
- Check firewall settings

**S3 upload error:**

- Verify AWS credentials in `.env`
- Check bucket permissions and CORS settings

**Port already in use:**

```bash
# Change PORT in backend/.env to a different value
PORT=5006
```

### Frontend Issues

**API connection error:**

- Verify the backend is running on `http://localhost:5005`
- Check [`config.ts`](frontend/src/utils/config.ts) for correct domain
- Verify CORS settings in backend

**Build errors:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Development workflow
- Code style guidelines
- Commit message conventions
- How to submit pull requests

Before contributing, please read our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For issues or questions:

- **Open an issue:** [GitHub Issues](https://github.com/CSES-Open-Source/tritonscript)
- **Email:** (Should I keep this?)
- **Organization:** UC San Diego CSES Open Source Society

---

## Acknowledgments

- Built with ❤️ by UC San Diego students
