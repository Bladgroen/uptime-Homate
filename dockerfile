# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the entire project directory to the working directory
COPY . .

# Install dependencies
RUN npm install

# Build the Vue project (assuming you have a build script in your package.json)
RUN npm run build

# Expose the desired port (if your app runs on a specific port)
EXPOSE 3001 7070

# Start the application
CMD [ "npm", "start" ]
