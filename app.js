const express = require('express');
const accounts = require("./routes/usersRoute");
const vibeCheck = require('./routes/vibeCheckRoute');
const friendsRoute = require("./routes/friendsRoute");
const authentication = require("./routes/authenticationRoute");
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
// redeploy pipeline
app.use(cors());
// comment to make a new commit

app.use("/vibe-checks", vibeCheck);
// middleware

app.use("", authentication)
app.use("/users", accounts);
app.use("/friends", friendsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port which is ${PORT}`);
});
