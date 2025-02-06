# Stage 1: Build the Angular application
FROM node:18 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for both Angular and Express
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source files for Angular
COPY . . 

# Build the Angular app
RUN npm run build -- --configuration=production

# Stage 2: Serve the Angular app using NGINX
FROM nginx:latest AS nginx-stage

# Copy the built Angular app from the previous stage
COPY --from=build /usr/src/app/dist/one-time-secret/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the NGINX server
EXPOSE 4200

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

# Stage 3: Setup and run the Express API
FROM node:18 AS express-stage

WORKDIR /usr/src/app

# Copy the Express API files
COPY ./express-app/package*.json ./
RUN npm install

COPY ./express-app /usr/src/app

# Expose port 3000 for the Express API
EXPOSE 3000

# Start the Express API
CMD ["node", "server.js"]



