const express = require("express");
const app = express();
const logger = require("pino")();
const Routes = require("./router.js");
const rateLimit = require("express-rate-limit");
const port = 3001;

//limiter middleware
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
app.use(limiter);

// logger middleware
app.use((req, res, next) => {
  logger.info(
    `Method: ${req.method}, Path: ${req.path}, User: ${req.query.user}`
  );
  next();
});

app.use(Routes);
app.listen(port);
console.log(`Application is running on port ${port}`);
