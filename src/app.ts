import "dotenv/config";
import express from "express";
import { appConfig } from "./config/app-config";
import { errorHandlingMiddleware } from "./middleware/errorHandlerMiddleWare";
import createError from "http-errors";

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.use();
    this.initializeErrorHandler();
  }

  private initializeErrorHandler() {
    console.log("initialise errorhandling");
    this.app.use(errorHandlingMiddleware);
  }

  public listen() {
    this.app.listen(appConfig.app.port, () => {
      console.log(`Server started on port ${appConfig.app.port}`);
    });
  }

  public use() {
    this.app.get("/health", async (req, res, next) => {
      return res.sendStatus(200);
    });
    // catch all
    this.app.use((req, res, next) => {
      next(new createError.NotFound("This route does not exist"));
    });
  }
}

export default App;
