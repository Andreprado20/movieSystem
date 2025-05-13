# MovieSystem Backend

A FastAPI-based backend for the MovieSystem application, providing movie information, user management, and social features.

## Features

- Movie information retrieval from TMDB API
- Local database storage for movies
- User authentication and authorization
- Social features (forums, ratings, watchlists)
- Event management
- Community features

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **PostgreSQL**: Relational database for data storage
- **Prisma**: Database ORM for type-safe database access
- **Firebase**: Authentication and real-time features
- **Docker**: Containerization for consistent deployment

## Project Structure

```
backend/
├── app/
│   ├── v1/
│   │   ├── movies/         # Movie-related endpoints
│   │   ├── users/          # User management
│   │   ├── auth/           # Authentication
│   │   └── ...
│   ├── core/               # Core application code
│   ├── models/             # Data models
│   └── services/           # Business logic
├── prisma/                 # Database schema and migrations
├── .env                    # Environment variables
├── pyproject.toml          # Project dependencies
└── run.py                  # Application entry point
```

## Getting Started

### Prerequisites

- Python 3.12+
- PostgreSQL
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   pip install -e .
   ```
3. Set up environment variables in `.env`
4. Run database migrations:
   ```
   prisma migrate dev
   ```
5. Start the application:
   ```
   python run.py
   ```

### Docker Deployment

Build the Docker image:
```
docker build -t moviesystem-backend .
```

Run the container:
```
docker run -p 8000:8000 moviesystem-backend
```

## API Documentation

Once the application is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Population

To populate the database with popular movies from TMDB:
```
curl -X POST http://localhost:8000/v1/movies/import-popular
```

## License

This project is licensed under the MIT License.
