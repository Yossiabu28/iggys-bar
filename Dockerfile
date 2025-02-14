# Use official Node.js image from the Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files to the container
COPY . .

# Expose the ports your app will run on
EXPOSE 3000 4000

# Run the application
CMD ["node", "server.js"]
