const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const session = require("express-session");
const displayRoutes = require("express-routemap");
const viewsRoutes = require("./routes/views.routes");
const productRoutes = require("./routes/product.routes");
const sessionRoutes = require("./routes/session.routes");
const cartRoutes = require('./routes/carts.routes');
const mockingRouter = require('./routes/mock.routes');
const loggerRouter = require('./routes/logger.routes');
const userRoutes = require('./routes/user.routes');
const mongoStore = require("connect-mongo");
const passport = require("passport");
const { initialize } = require("passport");
const initializePassport = require("./config/passport.config");
const { mongoDBconnection , configConnection } = require("./config/mongo.config");
const errorHandler = require("./middleware/error.middleware")
const {setLogger, infoLogger} = require("./utils/logger");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOpts = require('./config/swagger.config.js');

const specs = swaggerJSDoc(swaggerOpts);

const app = express();

const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: configConnection.url,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 3600,
    }),
    secret: "secretSession",
    resave: false,
    saveUninitialized: false,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(setLogger);

app.use("/static", express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const connection = mongoose.connect(configConnection.url,configConnection.options)
  .then((conn) => {
    console.log("🚀 CONECTADO!:");
  })
  .catch((err) => {
 
    console.log("🚀 ~ file: app.js:20 ~ err:", err);
  });

app.use("/", viewsRoutes);
app.use("/api/session/", sessionRoutes);
app.use("/api/products/", productRoutes);
app.use('/api/carts/', cartRoutes);
app.use('/api/mocking/', mockingRouter);
app.use('/api/loggerTest/', loggerRouter);
app.use('/api/users/', userRoutes);
app.use("/api/docs/", swaggerUI.serve, swaggerUI.setup(specs))

app.use(errorHandler);


app.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Listening on ${PORT}`);
});