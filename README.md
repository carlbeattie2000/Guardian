# Guardian

Guardian is an Australian community policing application, essentially an online portal which enables reporting crimes and contacting your local force.

### Running the backend for development
```bash 
# Clone the repo
git clone https://github.com/carlbeattie2000/Guardian.git ~/some/location/guardian

# cd into the project
cd ~/some/location/guardian/backend

# Install dependencies
npm install

# Set env variables -- Replace vim with your preferred text editor
cp .env.example .env
vim .env

# Train the model
npm run model:train

# Start the development server
npm run dev
```

You can then visit `localhost:2699/api-docs` and view all available endpoints
