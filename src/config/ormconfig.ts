import { ConnectionOptions } from "typeorm";
import { appConfig } from "./app-config";

const ormConfig: ConnectionOptions = {
  type: "mysql",
  host: appConfig.db.host,
  port: Number(appConfig.db.port),
  username: appConfig.db.username,
  password: appConfig.db.password,
  database: appConfig.db.name,
  synchronize: false,
  entities: ["src/db/entity/*.entity.ts"],
  migrations: ["src/db/migration/*.ts"],
  cli: {
    migrationsDir: "src/db/migration/records",
  },
  migrationsRun: true,
};

export default ormConfig;
