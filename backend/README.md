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

## Testing

The application includes a comprehensive test suite with benchmarking capabilities to help identify performance bottlenecks.

### Setting up the Test Environment

1. Install test dependencies:
   ```bash
   pip install -r test/requirements-test.txt
   ```

2. Set up test directories:
   ```bash
   python test/setup.py
   ```

### Running Tests

Run the test suite using the included script:

```bash
# Run all tests
python test/run_tests.py

# Run with detailed output
python test/run_tests.py --verbose

# Run specific test module
python test/run_tests.py --module test_users

# Generate test report
python test/run_tests.py --html

# Generate coverage report
python test/run_tests.py --coverage
```

Test results and benchmark data are stored in the `test/results` directory.

### Test Suite Features

- Integration tests for all API endpoints
- Performance benchmarking to track response times
- Mocking for external dependencies (Firebase, Supabase, TMDB)
- HTML reports for detailed test results
- Code coverage analysis

For more details, see the [test README](test/README.md).

## License

This project is licensed under the MIT License.
