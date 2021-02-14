# Backend Setup
1. Download the latest Node installer for your system on [Node's official website](https://nodejs.org/en/download/) and run it to install Node. Check **"Automatically install the necessary tools..."** if it appears in the installer window, and leave the rest as default.
2. Clone the repository and navigate to the repository root folder in ***cmd*** or ***Windows Terminal***.
3. Run `npm install`. It should automatically install the packages specified in our project.
4. Run `node app.js`. The terminal should output a line saying `Example app listening at http://localhost:80`, and if you visit http://localhost/, you should see a single line output `Hello World!`

This is an example Node application in Node's official documentation. In future development, app.js should be the point of entry for our application, from which we can develop multiple routes to serve our backend API.
