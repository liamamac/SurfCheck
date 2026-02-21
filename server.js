const express = require('express');
const app = express();

app.get("/app", function(req,res) {
    res.send("home")
});

app.listen(3000);

