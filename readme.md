# Australia Football Team Player Registration and AI Analysis API

This is a Node.js Express application built with TypeScript for managing football player registrations and performing AI-based analysis. It utilizes MongoDB, ChromaDB, and JWT authentication.

## Tech Stack

- **Node.js** + **Express** (Backend API)
- **TypeScript** (Strongly typed JavaScript)
- **MongoDB** + **Mongoose** (Database & ORM)
- **ChromaDB** (Vector database for AI analysis)
- **JWT (JSON Web Token)** (Authentication & Security)
- **OpenAI API** (AI-based player analysis)
- **Twilio API** (For SMS notifications)
- **SendGrid API** (For email communication)

## Environment Variables (`.env` file)

To configure the application, create a `.env` file in the root directory and include the following variables (replace with your actual values):

### Database Configuration

- `MONGO_URL` - MongoDB connection URL.
- `BASE_URL` - Base URL of the application.
- `PORT` - Port number on which the server runs.
- `NODE_ENV` - Environment mode (e.g., `development`, `production`).

### Security Keys

- `JWT_SECRET` - Secret key for signing JWT tokens.
- `REFRESH_SECRET` - Secret key for refresh tokens.

### AI API Key

- `OPENAI_API_KEY` - API key for OpenAI to enable AI-based analysis.

### Twilio API Keys (For SMS notifications)

- `TWILIO_ACCOUNT_SID` - Twilio Account SID.
- `TWILIO_AUTH_TOKEN` - Twilio authentication token.

### SendGrid API Key (For Email Notifications)

- `SENDGRID_API_KEY` - API key for SendGrid.

## Installation & Setup

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file and add the required variables.

4. Start the development server:
   ```sh
   npm run dev
   ```

## API Endpoints

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | `/user/signup` | Register a new user |
| GET    | `/user/signin` | login user          |

## Features

- Secure authentication using JWT
- MongoDB for storing player details
- AI-based analysis of player performance using OpenAI
- ChromaDB for vector-based similarity searches
- Twilio integration for SMS notifications
- SendGrid integration for email notifications

## Contributing

Feel free to fork the project and submit pull requests with improvements.

## License

This project is licensed under the MIT License.
