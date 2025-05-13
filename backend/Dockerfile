# Build stage
FROM python:3.12-slim as builder

RUN pip install poetry

WORKDIR /app

# Copy project files
COPY ./pyproject.toml ./README.md ./

RUN poetry lock
# Create package structure
RUN mkdir -p app && touch app/__init__.py

# Install dependencies using pip
RUN pip install --no-cache-dir -e .

# Final stage
FROM python:3.12-slim

WORKDIR /app

# Copy installed dependencies from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code and environment file
COPY ./app ./app
COPY ./run.py .
COPY ./.env /app/.env

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV DEV_MODE=true

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "run.py"]