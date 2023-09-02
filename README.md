# SEA Assignment

This project contains 3 main components, API, UI and Database. Continue reading for more details on each component.

## API

### Technology

The API is written and tested in Python 3 using the Flask framework and various extensions and libraries, which are as follows:

- Flask SQL Alchemy
- Flask Login
- Flask CORS
- JSON Schema
- Argon2

### Structure

The application is structured in the "application factory" pattern which allows for increased modularity, testability and scalability.

### Validation

The API uses JSONSchema to validate request data, this allows for better modularity, readability and mutability.

### Database Interface

The APU uses Flask SQL Alchemy to connect to and interact with the database, this allows for more concise, pythonic and secure code.

### Security

To authenticate users, the API hashes password using Argon2 which was the winner of the 2015 Password Hashing Competition. It is very simple yet very secure.

Once authenticated, Flask Login sends and receives cookies to restrict access to certain resources.

## UI

### Technology

The UI is written in TypeScript and uses the React library to render HTML in the browser on the client side.

Various other libraries were used, they are as follows:

- Headless UI
- Hero Icons
- CLSX
- React Router
- React Hook Form
- React Markdown
- DnD Kit

### Styling

To style the app, the UI makes use of a library called TailwindCSS which provides a vast set of utility classes to simplify the styling process.

## Database

The database can be either SQLite, MySQL, or PostgreSQL. The current deployment makes use of MySQL.
