# Use an official Node runtime as the parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install sqlite3
RUN apt-get update && apt-get install -y sqlite3

# Copy the rest of the application code
COPY . .

# Create SQLite database directory and set permissions
RUN mkdir -p /usr/src/app/data && chmod 777 /usr/src/app/data

# Build the TypeScript code
RUN npm run build

# Ensure views are copied to the correct location
RUN cp -R src/views dist/

# Make port 8880 available outside the container
EXPOSE 8880

# Run the app when the container launches
CMD ["node", "dist/app.js"]