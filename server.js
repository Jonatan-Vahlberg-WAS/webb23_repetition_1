const app = require("./app/app");

// use the PORT environment variable if it exists
const port = process.env.PORT || 3000;

console.log("ENV; ",process.env.PORT);

app.listen(port, () => {
  console.log("Server is running on port" + port);
})