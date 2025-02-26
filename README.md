# One-Time-Secret-Application
<p>This angular application allows users to generate secrt links for sharing sensitive information securely. Secrets are stored in Redis and are accessible only once through a unique link. the application supports passphrase protection, expiration options, and the ability to burn secret before they are viewd. </p>

## Project Structure
The project consists of two main components:

- **Frontend**: Angular application that provides the user interface.
- **Backend**: Express API that handles secret generation, retrieval, verification, and expiration.
  
## Features
- **Generate Secret Link**: Users can generate a unigue link to share a secret message.
- **One-Time View**: Secrets can only be viewed once; after retrieval, the secret is deleted from the server.
- **Passphrase Protection**: Optionally, users can seta passphrase to protect the secret. Validation occurs at the backend, ensuring better scurity.
- **Expiration Options**: The secret link can be set to expire after a specified time (ee.g. 30 minutes, 1 hour, 7 days, 14 dayes).
- **Burn Secret**: Users can burn the secret, making it inaccessible, even before it is viewed.
- **Passphrase validation**: If a passphrase is required, the recipient must eneter it to view the secret. Backend vaildation is used to ensure only correct passphrase reveal the secret.
- **Copy to Clipboard**: Users can copy secret links and the secret itself directly to the clipboard without clicking on the link to prevent accidental navigation.

## Technologies Used
- **Frontend**: Angular with standalone components, including `GenerateSecretComponent`, `SecretPreviewComponent`, and `RetrieveSecretComponent`.
- **Backend**: Express.js server with Redis for storing secrets.
- **Database**: Redis is used as a temporary store, automatically deleting secrets after expiration or retrieval.
- **UUID**: Each secret is identified by a unique UUID generated using the uuid library.
- **Clipboard**: The Angular app uses the Clipboard service to allow users to copy secret links.
- **HTTP Client**: Angular's HttpClient is used to make API requests to the backend.
- **Containerization**: Docker.
- **Web Server**: Nginx.
  
## Software Dependencies
- **Node.js** (v14.x or higher)
- **Angular** (v18.x or higher)
- **Express**: Web framework for Node.js
```
npm install express
```
- **Redis**: In-memory data structure store
```
npm install redis
```
- **ioredis**: Redis client for Node.js
```
npm install ioredis
```
- **cors**: Middleware for enabling CORS
```
npm install cors
```

## Installation Process
To get the One-Time Secret app running on your local system, follow these steps:

### Prerequisites
- Node.js and npm installed
- Docker and Docker Compose installed
  
### Backend Setup
1. Navigate to the express-app directory:
```
cd express-app
```
2. Install dependencies:
```
npm install
```
3. Start the backend server:
```
node server.js
```
### Frontend Setup
1. Navigate to the src directory:
```
cd src
```
2. Install Angular CLI (if not installed):
bash
Copy
Edit
npm install -g @angular/cli
Install dependencies:
```
npm install
```
3. Start the Angular application:
```
ng serve
```
### Running with Docker
1. Build and run the application using Docker Compose:
```
docker-compose up --build
```
2. Access the application at http://localhost:4200 and the API at http://localhost:3000.

## API Endpoints
You can refer to the API documentation for detailed usage and examples: 
|Method|Endpoint|Description|
|----------|--------|-----------|
|POST|/`api/secrets`|Create a new secret with an optional passphrase.|
|GET|/`api/secrets/:uuid`|Retrieve a secret by UUID, with optional passphrase.|
|POST|`/api/secrets/verify-passphrase/:uuid`|Verify the passphrase for a secret.|
|DELETE|`/api/secrets/burn/:uuid`|Permanently delete a secret.|
|GET|`/api/secrets/:uuid/accessed`|Check if a secret has already been accessed.|

More information can be found in the `server.js` file, where the backend API is defined.

## Build and Test
To build the project, run:
```
ng build
```

To test the project, run:
```
ng test
```

## Acknowledgments
-Inspiration for this project was drawn from the need for a secure and simple method to share sensitive information.
> You can adjust the links and details based on your actual repository and project details.
