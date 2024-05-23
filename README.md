
# Deal
## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contact Information](#contact-information)
## Introduction
Deal is a Node.js and TypeScript based real estate management system designed to handle property transactions and provide statistics on property requests and administrative data. It offers a platform for real estate agents and clients.

## Features
**CI/CD Integration**: Automated deployments using GitHub Actions CI/CD, leveraging ECR, and EC2 for infrastructure management.
- **Containerization**: The API is containerized with Docker and Docker Compose, simplifying deployment and scaling.
-   **Testcontainers**: Features good test coverage, including end-to-end tests via Testcontainers and Jest.
-   **Documentation**: Documented with Swagger for easy understanding and integration.
- **Authentication and Authorization**: Secures endpoints using JWT-based authentication to protect user data.
- **Property Management**: Allows agents to create, update, and manage property listings.
- **Statistics**: Offers admins insights into user activities.

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (preferably the latest stable version)
- PNPM (Package Manager)
- Docker and Docker Compose (for containerization and local deployment)
## Setup and Installation
### Environment Variables
Create a `.env` file in the root directory of the project and populate it with the necessary environment variables:
```
MONGO_URI=mongodb://mongo:27017/test
SECRET=32876qihsdh76@&#!742(*#HG&#28702y&##@^!()(&^#))jhscbd
ACCESS_TOKEN_EXPIRY=1d
``` 
### Docker Setup
To run the application using Docker, execute:
`docker-compose up --build`
This command builds the Docker image for the application and starts all services defined in the `docker-compose.yml` file, including the MongoDB service.
## Testing
Run the following command to install project dependencies:
`pnpm install`
To verify functionality and stability, run the tests with:
`pnpm run test`
To generate and view coverage reports, use:
`pnpm run test:cov`
## API Documentation
Access the API documentation through Swagger UI at `http://ec2-54-160-168-56.compute-1.amazonaws.com:8080/api-docs/`.
## Contact Information
-   Email: [contact@alifadda.me](mailto:contact@alifadda.me) or [silvertechguy@gmail.com](mailto:silvertechguy@gmail.com)
-   LinkedIn: [Ali Fadda](https://www.linkedin.com/in/alifadda)
