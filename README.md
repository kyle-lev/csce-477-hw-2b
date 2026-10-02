# Mock Juice Shop Login

This project implements a simple login page for a hypothetical OWASP Juice Shop login replacement. The form contains additional password and database defenses, namely hashing and salting with SHA-256 and parameterizing SQL queries.

It contains a login page and a sign up page. You can make a new account by signing up, and you can log in to the accounts that you make. That's all.

This uses ExpressJS, with help from the builtin SQLite and Crypto modules in Node.js.

# Building and running

This project requires the Node.js runtime. (Developed and tested on v24.21.0)

After cloning the repository, run the `npm install` command to install the necessary packages.

Then run `node server.js` to start the server. This will start the server on port 3000, which can be accessed in your web browser at `http://localhost:3000`.

No user accounts are in the SQLite database by default, so you will have to use the signup page to create a user.