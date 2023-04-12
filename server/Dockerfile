# Use an official Node.js base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the backend application will run on
EXPOSE 3000

# Start the backend application
CMD ["node", "app.js"]
