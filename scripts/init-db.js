import sequelize from "../config/database.js";

const initDb = async () => {
  try {
    await sequelize.sync({ force: true }); // Use { force: true } only in development
    console.log("Database synced!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

initDb();
