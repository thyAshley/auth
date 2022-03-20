import "dotenv/config";
import express, { Request } from "express";
import createError from "http-errors";
import morgan from "morgan";
import "reflect-metadata";
import { appConfig } from "./config/app-config";
import { dbConnection } from "./db/dbConnection";
import {
  errorHandlingMiddleware,
  healthMiddleware,
  protectMiddleware,
} from "./middleware";
import { authRoute } from "./auth/authRoutes";
import "./redis/client";

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.connectToDb();
    this.initializeMiddlewares();
    this.initializeLogger();
    this.initializeRoutes();
    this.initializeErrorHandler();
  }

  private initializeMiddlewares() {
    console.log("initialising middleware");
    this.app.use(express.json());
  }

  private initializeLogger() {
    console.log("initialising logger");
    morgan.token("body", (req: Request) => {
      if (req.body.password) {
        req.body.password = "********";
      }
      return JSON.stringify(req.body);
    });

    this.app.use(morgan(":method :url :body"));
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
    this.app.get("/", protectMiddleware, (req, res, next) => {
      return res.json("Welcome to the protected route");
    });
  }

  private async connectToDb() {
    await dbConnection();
  }

  public listen() {
    this.connectToDb()
      .then(() => {
        console.log("connected to database...");
        this.app.listen(appConfig.app.port, async () => {
          console.log(`Server started on port ${appConfig.app.port}`);
        });
      })
      .catch((error) => {
        console.log("failed to connect to db", error);
      });
  }
}

export default App;
