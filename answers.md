# Answers For Part 1, 2, 3.4, 4.2, 5.3, and 7





## Part 1 Answers



##### 

### Authentication vs. Authorization

Authentication is the process of verifying that the client is who they say they are, while authorization is the process of determining whether the client has permission to access certain information, perform a task, or use specific features. If a request does not contain valid authentication credentials, the API should return a 401 Unauthorized status code because the user's identity cannot be verified. If the caller is authenticated but does not have permission to perform the requested operation, the API should return a 403 Forbidden status code because the user has been identified but is not authorized to access that resource.



### Passwords, Sessions, and Tokens

The reason why a password stored as plain text is dangerous is that if a hacker gains access to the database, they would be able to see every user's password.



The server should instead store a hashed and salted version of the password. A unique salt is added before the password is hashed, making it much harder for an attacker to determine the original password if the database is compromised.



Session-based logins are when the server stores the user's session and then sends back a session ID to the client, often using cookies to identify the user on future requests. A token-based login is when the client receives a signed token that is verified by the server instead of looking up a stored session. This token is often a JWT (JSON Web Token).



One advantage of the session-based login approach is that sessions are easy to revoke by simply deleting the session from the server. One advantage of the token-based login approach is that it is easier to scale because the server does not need to store session information for every logged-in user.



### JSON Web Tokens

JSON Web Tokens (JWTs) are used to identify a user that has already been authenticated and logged in. Instead of requiring the user to enter their username and password every time they make a request, the client sends the JWT to the API, and the server verifies the token before allowing the user to access protected resources.



A JWT has three main parts to its structure:



* The header
* The payload
* The signature



The header contains information about the token itself, such as the type of token and the signing algorithm being used. The payload contains claims such as the user's identity, role, and expiration time. Finally, the signature is used to verify that the token came from a trusted source and has not been modified.



The difference between signing and encryption is that signing verifies that the JWT came from a trusted source and has not been changed, while encryption hides the information inside the token from unauthorized users.



A server must validate a JWT before trusting its claims because it needs to verify that the token is authentic, has not expired, and has not been tampered with. If it does not check these details, an attacker could use a modified or forged token to gain unauthorized access to protected resources.



One of the risks of allowing JWTs to have long expiration times is that if a token is stolen, it gives an attacker more time to use it before it expires. This is especially dangerous because the attacker could continue accessing protected resources while pretending to be the legitimate user until the token is no longer valid.



### OAuth

OAuth is what allows a user to give an application permission to access certain resources without needing to share the user's username or password. This is done by the user logging into an authorization server, which then sends back an access token that the application can use to access only the resources the user has given permission to use. A good example of OAuth is when you sign into Instagram using your Google account. Instead of giving Instagram your Google password, Google verifies your login and sends Instagram an access token that allows it to confirm your identity.



The Resource Owner is the person using the application who owns the account and its information. The Client Application is the application requesting permission to access the user's resources. The Authorization Server verifies the user's identity and, if the login is successful, issues an access token. The Resource Server stores the protected resources and verifies the access token before allowing access. The Access Token is what proves that the client has been given permission to access the requested resources.



It is safer to give a third-party application an OAuth access token because the application never has access to the user's password, so it never sees or stores it. If the access token is ever compromised, it can be revoked without requiring the user to change their password.



### PKI and Certificates

PKI is a short way of saying Public Key Infrastructure. It is the system that uses public and private keys along with digital certificates to establish a secure connection between a client and a server. The server's public key is shared with anyone and is used to help establish the secure encrypted connection, while the server's private key is kept secret and is used to prove the server's identity.



A digital certificate contains the server's public key and helps verify that the server is who it says it is. This allows the client and server to communicate securely over an encrypted HTTPS connection. The Certificate Authority (CA) verifies the server's identity before issuing the digital certificate. When the client connects to the server, it verifies that the certificate was issued by a trusted CA, has not expired, and belongs to the correct server.



If certificate validation is skipped, attackers could pretend to be the server and intercept or modify information being sent between the client and the server. This could allow attackers to steal sensitive information such as usernames, passwords, or access tokens.



### Databases, Messages, and Asynchronous Processing

When an API receives a request to generate a large report, it should use asynchronous processing instead of keeping the HTTP request open because the report could take several minutes to finish. Keeping the request open for that long would waste server resources and could cause the request to time out. Instead, the API should immediately accept the request and process the report in the background.



After receiving the request, the API should create a database record for the report job that contains information such as the job ID, the user's ID, the current status, and eventually the download URL. The API should then place a message on a message queue so that a background worker knows there is a report waiting to be generated. The background worker retrieves the message, generates the report, and updates the database record to show whether the report was completed successfully or failed.



The API should immediately return a 202 Accepted response to let the client know the request was accepted for processing. The client can later check the status of the report by sending a GET request for that report job, which should return a 200 OK response with the current job status.





# Part 2 Answers





### Authentication and Authorization



|Request|Allowed/Rejected|Decision and Status Code|
|-|-|-|

|A request contains no access token|Rejected|401|
|-|-|-|
|A request contains an expired JWT|Rejected|401|
|A student requests one of their own tasks|Allowed|200|
|A student requests another student’s task|Rejected|403|
|An instructor requests a task belonging to any student|Allowed|200|



Authentication ends when the API has verified that the JWT is valid and confirms the identity of the user. Authorization begins after authentication and determines whether that authenticated user has permission to access or modify the requested task based on their role. For example, a student is only allowed to view or update their own tasks, while an instructor is allowed to view or update any student's task.





### OAuth, JWT, and PKI Design

When pertaining to the Course Task Tracker system, the token should be issued by the institution's authorization server after the student has successfully logged into their account. Once the token has been issued, the client sends the JWT to the API with each protected request.



Prior to trusting the JWT, the API needs to verify if the token's signature is valid or not, if it's expired, and that it hasn't been modified. Once those have been verified, the API can continue because it is now a trusted token with the users information and role stored in the token.



HTTPS protects the connection between the client and the API by encrypting the data being sent. The server's digital certificate, which is issued by a Certificate Authority (CA), allows the client to verify that it is communicating with the correct server before sending sensitive information.



The API should never trust a role supplied in the request body because the client can modify the request before it is sent. If the API trusted the role provided in the request body, a user could falsely claim to be an instructor or another authorized user. Instead, the API should only trust the role stored inside the verified JWT because it was issued by the institution's authorization server and has already been validated.





### Database and Asynchronous Report Processing

Every time that a report is requested to be made, the API will use the POST /reports route because this will submit the requests. Once the request is received, the API should make a database record which will have the report ID, student ID, current status, and have a download URL that is initially set to null



After the database record is created, the API should place a message on the message queue containing the report job ID and the student ID. This allows the background worker to know there is a report waiting to be generated.



During the time the report is being generated, the API should return a 202 Accepted response along with the job ID and a status of "pending." The client can later check the report's progress by sending a GET /reports/{id} request, which returns the current status of the report.



After the background worker receives the message from the queue, it begins generating the report. If the report is generated successfully, it updates the database record by changing the status to completed and saving the download URL. If an error occurs while generating the report, the worker updates the database record by changing the status to failed.





## Part 3.4 Answers





### Error Classification

|Situation|Status Code|
|-|-|
|No access token was provided|401|
|The JWT has expired|401|
|The JWT signature is invalid|401|
|A validly authenticated student attempts an instructor-only operation|403|







## Part 4.2 Answers





### Database and Asynchronous Behavior

The reason the task ID should be supplied as a query parameter instead of being inserted directly into the SQL string is because parameterized queries keep the user input separate from the SQL command. This helps prevent SQL injection attacks and allows the database to safely process the task ID without treating it as part of the SQL statement.



The reason the route uses await is because db.query() is asynchronous and returns a Promise. Using await allows the route to wait for the query to finish before attempting to access result.rows and return a response.





## Part 5.3 Answers





### Queue Behavior

It should return a 202 Accepted response because that status code indicates that the request has been accepted and the work is ready to begin, even though it has not finished yet. If it returned a 200 OK, it would indicate that the entire operation had already completed successfully. If it returned a 201 Created, it would indicate that a new resource had been created, which is not the main purpose of this request since the report is still being generated.

The advantage of doing the work in the reportWorker is that the API is able to respond immediately to the HTTP request instead of keeping the request open while the report is being generated. This allows the server to continue handling other requests while the report is processed in the background.





## Part 7 Answers





### Following a Request Through the System

Request Trace: DELETE /tasks/123



When a client sends a DELETE /tasks/123 request with a Bearer JWT, it moves through the system in the following order:



HTTP – The client sends an HTTPS DELETE request to /tasks/123 with an Authorization: Bearer <token> header.

Express Routing – Express matches the request to tasksRouter.delete('/:id', ...) and stores the task ID (123) in req.params.id.

Authentication – The authenticateToken middleware extracts the JWT, verifies it using config.jwtSecret, and stores the decoded user information in req.user.

Authorization – The requireRole("instructor") middleware checks the user's role. If the user is an instructor, the request continues to the route handler.

Database Access – The route executes db.run("DELETE FROM tasks WHERE id = ?", \[req.params.id]) to remove the task from the database.

Error Handling – If an unexpected database error occurs, the route catches the error and passes it to the Express error-handling middleware using next(error).

Point of Failure



If a user sends a valid JWT but their role is "student", the requireRole middleware stops the request before it reaches the database and returns a 403 Forbidden response because the user does not have permission to delete tasks.



### Synchronous vs. Asynchronous Processing

Synchronous Operation: GET /tasks/{id}



Why it is appropriate:

Retrieving a task only requires a single database query, so the client expects an immediate response.



Client Response:

The client receives a 200 OK response with the requested task, or a 404 Not Found response if the task does not exist.



Failure Handling:

Any database errors are caught immediately by the route and returned as the appropriate HTTP error response.



Database Usage:

The database is queried directly during the request to retrieve the task information.



Asynchronous Operation: POST /reports



Why it is appropriate:

Generating a report can take a long time, so it should run in the background instead of keeping the HTTP request open.



Client Response:

The client immediately receives a 202 Accepted response with a jobId, an initial status of "pending", and a URL for checking the report status.



Failure Handling:

If report generation fails, the background worker updates the report status to "failed" in the database without crashing the application. The client can see the failure by checking the report status.



Database Usage:

The database tracks the report through each stage of processing (pending, processing, completed, or failed) and stores the final download URL when the report is complete.



### Lessons Learned

Practice 1: Parameterized SQL Queries



Problem Prevented: SQL Injection



Using parameterized SQL queries prevents attackers from injecting SQL commands into database queries. By using placeholders (?) instead of inserting user input directly into SQL statements, the database treats user input as data instead of executable SQL.



Practice 2: JWT Authentication and Role-Based Authorization



Problem Prevented: Unauthorized Access



Verifying JWTs ensures that users are properly authenticated before accessing protected resources. After authentication, role-based authorization checks whether the user has permission to perform the requested action, helping prevent unauthorized access.



Practice 3: Message Queues and Background Workers



Problem Prevented: Request Timeouts and Slow API Responses



Moving long-running tasks, such as report generation, to a background worker allows the API to return a 202 Accepted response immediately. This keeps the API responsive, allows it to continue handling other requests, and prevents long-running operations from blocking HTTP requests.

