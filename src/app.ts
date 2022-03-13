import "dotenv/config";
import express from "express";
import { appConfig } from "./config/app-config";
import { errorHandlingMiddleware } from "./middleware/errorHandlerMiddleWare";
import createError from "http-errors";
import { authRoute } from "./routes/authRoutes";
import { healthMiddleware } from "./middleware/healthMiddleware";

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.initializeRoutes();
    this.initializeErrorHandler();
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

  public listen() {
    this.app.listen(appConfig.app.port, () => {
      console.log(`Server started on port ${appConfig.app.port}`);
    });
  }
}

export default App;
