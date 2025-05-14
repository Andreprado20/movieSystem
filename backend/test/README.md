# Movie System API Tests

This directory contains comprehensive tests for the Movie System API, including benchmarking features to help optimize performance.

## Test Suite Features

- **Comprehensive API Testing**: Tests all endpoints and functionalities
- **Performance Benchmarking**: Measures response times and tracks performance over time
- **Advanced Mocking**: Properly mocks external dependencies (Firebase, Supabase, etc.)
- **Detailed Reports**: Generates HTML and JSON reports for easy analysis
- **Code Coverage Analysis**: Tracks how much of the codebase is covered by tests

## Requirements

Install the required packages:

```bash
pip install pytest pytest-asyncio pytest-html coverage
```

## Running Tests

### Using the run_tests.py Script

The simplest way to run the tests is using the provided script:

```bash
# Run all tests
python run_tests.py

# Run with detailed output
python run_tests.py --verbose

# Run a specific test module
python run_tests.py --module test_users

# Generate HTML report
python run_tests.py --html

# Generate coverage report
python run_tests.py --coverage

# All options combined
python run_tests.py --module test_users --verbose --html --coverage --junit
```

### Directly with pytest

You can also run the tests directly with pytest:

```bash
# Run all tests
pytest

# Run with detailed output
pytest -v

# Run a specific test file
pytest test_users.py

# Run a specific test class
pytest test_users.py::TestUserRoutes

# Run a specific test
pytest test_users.py::TestUserRoutes::test_create_user
```

## Benchmark Results

Benchmark results are automatically saved in the `results` directory. Each test run generates:

- JSON files with detailed timing information
- Console summary of test execution times
- HTML reports (if requested)

The benchmark data includes:
- Execution time for each test
- Success/failure status
- Timestamp for tracking performance over time

## Debugging Failed Tests

For failed tests, check:

1. The console output for immediate error information
2. The HTML report for detailed test failure information
3. The logs in the results directory

## Adding New Tests

When adding new tests:

1. Create a new test file or add to an existing one following the class-based pattern
2. Use the `Timer` context manager to benchmark performance
3. Add comprehensive assertions to validate functionality
4. Mock external dependencies appropriately

Example:

```python
def test_new_feature(self, client, mock_dependency):
    with Timer("new_feature"):
        # Setup
        payload = {"key": "value"}
        
        # Execute
        response = client.post("/api/endpoint", json=payload)
        data = response.json()
        
        # Assert
        assert response.status_code == 200
        assert "expected_key" in data
``` 