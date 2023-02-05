# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the React project files
COPY . .

# Build the React project
RUN npm run build

# Use Nginx as the web server
FROM nginx

# Copy the build files to the Nginx web root directory
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]