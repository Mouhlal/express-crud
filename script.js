const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
const USERS_FILE = "users.json";
// Serve the JSON file
app.get("/userss", (req, res) => {
fs.readFile(USERS_FILE, "utf8", (err, data) => {
if (err) {
return res.status(500).send({ error: "Error reading file" });
}
res.send(JSON.parse(data));
});
});
// Save users to JSON file
app.post("/userss", (req, res) => {
const users = req.body;
fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
if (err) {
return res.status(500).send({ error: "Error saving file" });
}
res.send({ message: "Users saved successfully!" });
});
});
app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});