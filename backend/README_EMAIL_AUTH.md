# Email-Based Authentication Routes

This extension provides alternative API routes that use email-based authentication instead of JWT Bearer tokens, making it easy to test the API without the frontend authentication flow.

## Overview

For development and testing purposes, you can now use the email header instead of a bearer token to authenticate requests. This simplifies the process of testing the API directly using tools like curl, Postman, or Swagger UI.

The routes are available at the `/v1/email/` prefix, for example:
- Regular route: `/v1/users/`
- Email auth route: `/v1/email/users/`

## How to Use

### 1. Make sure you have a valid user in the database

Your email must be registered in the `Usuario` table in Supabase. If you don't have a user, you can create one using the regular route:

```bash
curl -X POST "http://localhost:8000/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "display_name": "Test User"}'
```

### 2. Make API calls using the email header

Instead of using a JWT Bearer token, simply include your email in the `email` header:

```bash
curl -X GET "http://localhost:8000/v1/email/movies/" \
  -H "email: test@example.com"
```

## Available Routes

The following routes support email-based authentication:

### User Routes
- `GET /v1/email/users/list_all`
- `GET /v1/email/users/{uid}`
- `PUT /v1/email/users/{uid}`
- `DELETE /v1/email/users/{uid}`
- `POST /v1/email/users/sync`
- `POST /v1/email/users/sync/{uid}`

### Movies Routes
- `GET /v1/email/movies/find?movie_id={id}`
- `GET /v1/email/movies/{movie_id}`
- `POST /v1/email/movies/`
- `PUT /v1/email/movies/{movie_id}`
- `DELETE /v1/email/movies/{movie_id}`
- `GET /v1/email/movies/?page={page}&limit={limit}`

### Movie List Routes
- `GET /v1/email/movielist/status/{filme_id}?perfil_id={perfil_id}`
- `POST /v1/email/movielist/favorites`
- `POST /v1/email/movielist/watched`
- `POST /v1/email/movielist/watch-later`
- `DELETE /v1/email/movielist/{list_type}/{filme_id}?perfil_id={perfil_id}`
- `GET /v1/email/movielist/{list_type}?perfil_id={perfil_id}`
- `POST /v1/email/movielist/batch`

## Example Curl Commands

### Get Movies List
```bash
curl -X GET "http://localhost:8000/v1/email/movies/?page=1&limit=10" \
  -H "email: test@example.com"
```

### Add Movie to Favorites
```bash
curl -X POST "http://localhost:8000/v1/email/movielist/favorites" \
  -H "Content-Type: application/json" \
  -H "email: test@example.com" \
  -d '{"filme_id": 123, "perfil_id": 456}'
```

### Get Status of a Movie
```bash
curl -X GET "http://localhost:8000/v1/email/movielist/status/123?perfil_id=456" \
  -H "email: test@example.com"
```

## Security Considerations

⚠️ **Warning**: This authentication method is intended for development and testing purposes only. It is not secure for production use for the following reasons:

1. Email headers can be easily spoofed
2. No verification is done to ensure the email owner is actually making the request
3. No encryption is applied to the email

For production use, always use the JWT Bearer token authentication provided by the regular routes.

## Implementation Details

The email-based authentication is implemented using a FastAPI dependency that:

1. Extracts the email from the request header
2. Queries the Supabase database to find the user with that email
3. If found, returns the user object with properties similar to what the Firebase authentication would return

This allows the rest of the application code to work unchanged, as it receives a user object with the same structure. 