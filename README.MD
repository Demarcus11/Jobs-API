#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.js
- jobs.js

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### Mongoose Errors

- Validation Errors
- Duplicate (Email)
- Cast Error

#### Security

- helmet
- cors (Cross origin resource sharing) used to make the API accessible to the public
- xss-clean
- express-rate-limit

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```

Explained:

We have a register route, a login route, and the jobs routes.

## Register Route

The register route is public and recieves POST requests.

When a user enters a username, email, and password a POST request is made to the route: `/api/v1/register`. The backend then runs the `register()` controller function which creates a new user in the User collection, creates a new JWT token for that user, and passes the name and token to the frontend. The token will be stored in local storage, that way when a protected jobs route tries to be accessed, in a POST request we can access to token in local storage and send it in the header of a request to the protected route with the Authorization: Bearer <token> syntax.

## Login Route

The login route is public and recieves POST requests.

When a user enters a username, email, and password a POST request is made to the route `/api/v1/login`. The backend then runs the `login()` controller function which validates the email and password because they don't need to enter their name to login, finds a user with that email in the DB, checks password for a match, creates a JWT token and passes the name and token to the frontend.

## Jobs Routes

The job routes are protected.

The auth middleware function will run when these routes are tried to be accessed. This function will check the Authorization: Bearer <token> header, verify the token, then add a property 'user' on the request object, so that the jobs controllers can access the userId and name of the user that was just verified.

Each job controller gets the userId and jobId from the request. When a request is made it search the jobs collection in the DB by the 'createdBy' property with the userId, that way these CRUD operations are only performed on the user that currently logged in.
