const bcrypt = require("bcryptjs");
var express = require('express');
var app = express();
var router = express.Router();


router.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;
  const allowedRoles = ["user", "content-creator"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).send("Invalid role");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const request = new sql.Request();

  try {
    await request.query(
      `INSERT INTO Users (username, password, role) VALUES ('${username}', '${hashedPassword}', '${role}')`
    );
    res.send("Signup successful");
    console.log(`User ${username} signed up with role ${role}`);
  } catch (err) {
    res.status(500).send("Error signing up");
    console.error("Error signing up:", err);
  }
});

module.exports = router;