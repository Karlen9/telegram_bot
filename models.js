import sequelize from "sequelize";
import DataTypes from "sequelize";

const User = sequelize.define("user", {
  id: { type: DataTypes.UUIDV4, primaryKey: true, unique: true },
  chatId: { type: DataTypes.STRING, unique: true },
  enterDate: { type: DataTypes.STRING },
  exitDate: { type: DataTypes.STRING },
});
