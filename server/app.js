const express = require('express');
const accounts = require("./routes/usersRoute");
const vibeCheck = require('./routes/vibeCheckRoute')
const authentication = require("./routes/authenticationRoute");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
// comment to make a new commit

app.use("/vibe-checks", vibeCheck);
// middleware

app.use("", authentication)
app.use("/users", accounts);

app.listen(PORT, () => {
  console.log(`Server is running on port which is ${PORT}`);
});
