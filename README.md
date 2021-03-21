# PMA SERVER
### UPT SOFTWARE ENGINEERING FUNDAMENTALS PROJECT

#### Description 📝:
This is the server of the Project Management App for Software Engineering Fundamentals Laboratory.

#### Team members 👨‍🔧:
- Marius-Adrian Florescu
- Victor-Alexandru Cerna

#### Structure ⛩:
- All the models are placed in the 'entities' folder (typeorm default)
- All the middlewares are placed in the 'middleware' folder
- All the routes are placed in the 'routes' folder. 
* Note: Every file found in the routes folder contains a collection of API endpoints related to the name of the file (e.g: auth contains register,login,me). Any API endpoint which is not related to any group should be placed in the misc route.
- Any function that is required in multiple places/functions should be placed in the utils folder (DRY).

#### API endpoints ⚡️:
- '/' -> Hello World
- '/api/register'
- '/api/login'
- '/api/me'
- '/api/users/' (get all users regardless of the type)
- '/api/users/students'
- '/api/users/companies'
- 'api/users/student/:id'
- '/api/users/company/:id' 

#### UML Case Diagram:
- [Click here](https://lucid.app/lucidchart/invitations/accept/4d821252-69c9-4bee-8bfa-3a42326eedf4)

#### SQL Diagram:
- [Click here](https://drawsql.app/me-38/project-management-app)

#### How to run ⚙️:
- You need to have PostgreSQL,Nodejs installed on your local machine.
- Clone the repository
- npm install
- change in the ormconfig.json the username, password and the database name
- copy the content of .env.example file, create a .env file and fill with your data (e.g: PORT=5000).
- npm run dev in your terminal
