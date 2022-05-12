const express = require("express"); 
const morgan = require("morgan");
const router = require("./routes");

const port = 3001;

const app = express();

app.use(morgan("dev"));

app.use(router);

// 404 Handler
app.use((req, res, next) => {
    try {
        res.status(404).send("Route doesn't exist");
    } catch (err) {
        next(err);
    }
}); 

// Error Handler
app.use((err, req, res, next) => {
    res.status(500).send(err.message); 
}); 

app.listen(port, () => console.log(`Server running on port ${port}`));