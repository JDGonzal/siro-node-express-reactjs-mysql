# Learning Node, Express, React JS , MySQL  JWTfull stack web development

## Learn to create a full stack web application from scratch using React, Redux, Hooks and JWT Authorization 

## Steps to start for all
1. Install NPM and NODEJS in your system 
  [Nodejs Download](https://nodejs.org/en/download/current/)
2. Check in $path or %path% the nodeJS and npm are on it
  ```bash
  C:/Program Files/nodejs
  ```
3. Install Postman
  [Postman Download](https://www.postman.com/downloads/)
4. Install MySQL 5.6.x
  [MySQL Download 5.6.26](https://downloads.mysql.com/archives/community/)
5. Install Visual Studio Code
  [Visual Studio Download](https://code.visualstudio.com/insiders/)
6. Create a DB called "sirodb" and
  You could create the DB using an script
  ```sql
    CREATE DATABASE IF NOT EXISTS sirodb;

    USE sirodb;
  ```
  
## Steps to work the API
  my-app-ui:[Node.js Express: JWT example | Token Based Authentication & Authorization](https://www.bezkoder.com/node-js-jwt-authentication-mysql/)

1. Create a directory called "api" and get in
  ```bash
  mkdir api
  cd ./api
  ```

2. In the working directory activate the environment:
  ```bash
    npm init -y
  ```

3. We need to install necessary modules: express, cors, sequelize, mysql2, jsonwebtoken, bcryptjs, and more<br />
To install all the required modules
  ```bash
  npm install 
  ``` 

4 Install "nodemon" with "-D" in parameter, to not create a new element into "package.json" file.<br />
  The nodemon Module is a module that develop node. js based applications by automatically restarting the node application when file changes in the directory are detected.<br />
  Nodemon does not require any change in the original code and method of development.
  ```bash
  npm install nodemon -D 
  ```

5. Install with npm the "dotenv".<br />
  It loads environment variables from a .env file.
  ```bash
  cd ./api
  npm install dotenv --save
  ```  

6. Install the Heroku-Cli from [Heroku-CLI] (https://devcenter.heroku.com/articles/heroku-cli)<br/>
  check in some Terminals the version
  ```bash
  heroku --version
  ```
7. Create a new git "api" directory point to heroku<br/>
  running this command into "bash" or "powershell" terminal
  ```bash
  cd ./api
  ./create-git-heroku.sh
  ```

8. Login to [Heroku] (https://devcenter.heroku.com/articles/heroku-cli)<br/>
  using the login in the terminal
  ```bash
  cd ./api
  heroku login -i
  ```
9. Run some GIT command to upload to [Heroku-sirio](https://dashboard.heroku.com/apps/siro-node-express-reactjs-mysq)<br/>
  ```bash
  cd ./api
  git status
  git add [each file in status report]
  git commit -m "yyyymmdd. Some explanation of what and why"
  git push heroku master
  ```
10. the last command (pus) is gona to run a build into heroku site, then check the logs.
  ```bash
  cd ./api
  heroku logs --tail
  ```

## Steps to work the MY-APP with REACT
  GUI: [React Redux Login, Logout, Registration example with Hooks](https://www.bezkoder.com/react-hooks-redux-login-registration-example/).<br />
  Repository: https://github.com/bezkoder/react-redux-hooks-jwt-auth .

1. From the root, run this command
```bash
  npx create-react-app my-app
```

2. Change to the aplication directory
```bash
  cd ./my-app
```

3. Install with npm the "react-router-dom".<br />
  Best JavaScript code snippets using react-router-dom.
  ```bash
  cd ./my-app
  npm install react-router-dom --save
  ```
## Note: Run first the API before to run the MY-APP-UI
 At the end, run this command to up the API, to check in Postman 'http://localhost:49146/api/',
  ```bash
  cd ./api
  npm run dev
  ```
And run this command to up the APP, using another Terminal, to check http://localhost:3000/
  ```bash
  cd ./my-app
  npm start
  ```
### If you need to check the installed "node_modules" elements, use this :
  ```bash
    npm list --depth 0
  ```
### To clean Cache run this command:
  ```bash
  npm cache clean --force
  ```

## License
[MIT](https://choosealicense.com/licenses/mit/)
