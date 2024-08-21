# GraphDB Management Web Service

This project is a web service for managing graph databases, specifically utilizing Blazegraph for graph data management. It features a frontend for user interaction and a backend for handling graph database operations. The service allows users to connect to, create, and manage databases, as well as upload data in `.ttl` format.

## Deployment

The frontend and backend are deployed online using free services for demonstration purposes. 

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Heroku

## Frontend

The frontend is built with React.js and provides two main pages:

- **Settings Page**: Allows users to configure database connections.
- **Data Upload Page**: Users can upload `.ttl` files to add data to the connected database.

## Backend

The backend is implemented in Python using Flask and connects to an SQL database for managing user data and Blazegraph for graph data operations.

### Features

- **Database Connection**: Users can connect to an existing database using Blazegraph.
- **Database Creation**: Users can create new databases directly through the web service.
- **Data Upload**: Supports uploading `.ttl` files to add data to the connected database.
- **Namespace Management**: Users can add new namespaces to the connected database.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the Repository**


2. **Set Up the Backend**

Navigate to the backend directory and install the required packages:
```pip install -r requirements.txt```


Start the backend server:


3. **Set Up the Frontend**

Navigate to the frontend directory and install the dependencies:
```npm install```

Start the frontend application:
```npm start```




4. **Access the Web Service**

Open your web browser and go to `http://localhost:3000` to access the web service.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to improve the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.