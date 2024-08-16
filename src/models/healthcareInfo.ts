import { Model, DataTypes, Sequelize } from 'sequelize';
import { db } from '../config/database';
import { User } from './user';

class HealthcareInfo extends Model {
  public id!: number;
  public patientName!: string;
  public diagnosis!: string;
  public treatment!: string;
  public userId!: number;

  public static initModel(sequelize: Sequelize): void {
    HealthcareInfo.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        patientName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        diagnosis: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        treatment: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: 'id',
          },
        },
      },
      {
        sequelize,
        modelName: 'HealthcareInfo',
      }
    );
  }

  public static associate(): void {
    HealthcareInfo.belongsTo(User);
  }
}

HealthcareInfo.initModel(db);

export { HealthcareInfo };