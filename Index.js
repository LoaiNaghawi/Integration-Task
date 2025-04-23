const express = require("express");
const app = express();
const logger = require("pino")();
const Routes = require("./router.js");

// logger middleware
app.use((req, res, next) => {
  logger.info(
    `Method: ${req.method}, Path: ${req.path}, User: ${req.query.user}`
  );
  next();
});

app.use(Routes);
app.listen(3001);
