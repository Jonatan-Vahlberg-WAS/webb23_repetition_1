const app = require("./app/app");

// use the PORT environment variable if it exists
const port = process.env.PORT || 3000;

// start the server and listen on the port
app.listen(port, () => {
  console.log("Server is running on port " + port);
})