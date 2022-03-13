import { createConnection } from "typeorm";
import ormConfig from "../config/ormconfig";

export const dbConnection = async () => {
  await createConnection(ormConfig);
};
