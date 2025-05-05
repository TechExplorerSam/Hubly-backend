# Hubly-backend
This is the backend API built with Node.js, Express, and MongoDB, supporting all core functionalities of the Ticketing System including authentication, ticket & team management, chat, chatbot integration, analytics, and admin-team isolation.

Project Structure
src/
├── controllers/        # Request handlers
├── services/           # Business logic
├── models/             # Mongoose models
├── routes/             # API route handlers
├── middleware/         # Auth, validation, etc.
└── server.js           # Entry point

1 . Clone this repo 
  https://github.com/TechExplorerSam/Hubly-backend.git
2.  Install dependencies:
    npm install
3. Run the server:
   npm run dev
   
 Key API Features
-JWT Authentication for Admins & Team

- Ticket APIs: Create, assign, resolve, search, filter

-Team APIs: Invite, validate email(Check wheather they are assigned by the admin into the sysyeem or not in login page they can enter their username or admin assinged email address ), manage roles

- Chat APIs: Support conversation per ticket

-Chatbot API: Widget customization and fallback handling

-Missed Chat Logic: Automatic missed tag based on inactivity

- Analytics APIs: Resolution time, team stats, daily/weekly

-Polling-optimized chat fetch to avoid excessive API hits

- Multi-admin Isolation: Admins only manage their own team & data


