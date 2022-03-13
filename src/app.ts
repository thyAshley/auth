import "dotenv/config";
import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import "reflect-metadata";
import { appConfig } from "./config/app-config";
import { dbConnection } from "./db/dbConnection";
import { errorHandlingMiddleware, healthMiddleware } from "./middleware";
import { authRoute } from "./routes/authRoutes";

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.connectToDb();
    this.initializeLogger();
    this.initializeRoutes();
    this.initializeErrorHandler();
  }

  private initializeLogger() {
    console.log("initialising logger");
    this.app.use(morgan("dev"));
  }

  private initializeErrorHandler() {
    console.log("initialising errorhandling");
    this.app.use((req, res, next) => {
      next(new createError.NotFound("This route does not exist"));
    });

    this.app.use(errorHandlingMiddleware);
  }

  private initializeRoutes() {
    console.log("initialising routes");
    this.app.use("/auth", authRoute);
    this.app.get("/health", healthMiddleware);
  }

  private async connectToDb() {
    console.log("connecting to db...");
    await dbConnection();
  }

  public listen() {
    this.app.listen(appConfig.app.port, () => {
      console.log(`Server started on port ${appConfig.app.port}`);
    });
  }
}

export default App;
