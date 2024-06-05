Course-fullstack

Project Setup

Clone or download the project.
In the project directory, run npm install to install dependencies.
Running the Project

Start the development server with npm run dev.
Local Development: Cookie Storage

Modify cookie options in src/controllers/session.controllers.js and src/middlewares/deserializeUser.middleware.js.
Set domain to localhost for local development.
Note:

Replace localhost with your production domain in domain for deployment.
Consider using environment variables for sensitive configuration.

GOOGLE_CLIENT_ID = 328249712432-bg3ke8p5b81ut2v7s35hlame10ko48qo.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET= 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

GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/users/sessions/oauth/google
