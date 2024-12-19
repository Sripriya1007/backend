# Step 1: Set the base image
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (to install dependencies first)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the backend source code into the container
COPY . .

# Step 6: Expose the backend API port (adjust this as needed)
EXPOSE 5000

# Step 7: Command to run the server
CMD ["node", "server.js"]
