import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface RequestItem {
  name: string;
  qty: number;
}

export interface RequestAttributes {
  id: number;
  type: string;
  employeeId: string;
  items: RequestItem[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestCreationAttributes extends Optional<RequestAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Request
  extends Model<RequestAttributes, RequestCreationAttributes>
  implements RequestAttributes {

  public id!: number;
  public type!: string;
  public employeeId!: string;
  public items!: RequestItem[];
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Request {
  Request.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: 'employees', key: 'employeeId' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      items: {
        type: DataTypes.JSON,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Request',
      tableName: 'requests',
      timestamps: true
    }
  );

  return Request;
}
