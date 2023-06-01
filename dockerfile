# Use an official Node.js runtime as the base image
FROM node:14-buster

# Set the working directory in the container
WORKDIR /app

# Copy the entire project directory to the working directory
COPY . .

# Copy the .env file
COPY secret.env .

# Install dependencies
RUN npm install

# Build the Vue project (assuming you have a build script in your package.json)
RUN npm run build

# Expose the desired ports (if your app runs on specific ports)
EXPOSE 3001 7070

# Start the application
CMD [ "npm", "start" ]
