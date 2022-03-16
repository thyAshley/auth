export const appConfig = {
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
  },
  app: {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
  },
};
