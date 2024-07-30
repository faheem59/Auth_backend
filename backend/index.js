const express = require("express");
const app = express();
const sequelize = require("./db/conn");
const otp = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const user = require('./routes/userRoutes');
const serverConfig = require("./config/server-config");
const logger = require("./config/logger-cofing");
const morganLogger = require("./config/morgan-config");


sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });

app.use(morganLogger);
app.use(cors());
app.use(bodyParser.json());


app.use("/api", otp);
app.use('/api', user)

app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info("Succcessfully started the server")
});
