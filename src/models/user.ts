import { Model, DataTypes, Sequelize } from 'sequelize';
import { db } from '../config/database';

class User extends Model {
  public id!: number;
  public email!: string;
  public name!: string;
  public password!: string;

  public static initModel(sequelize: Sequelize): void {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
      }
    );
  }

  public static associate(): void {
    // Define associations here if needed
    // For example: User.hasMany(HealthcareInfo);
  }
}

User.initModel(db);

export { User };