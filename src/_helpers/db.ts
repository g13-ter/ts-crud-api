import config from '../../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

export interface Database {
  User?: any;
  Department: any;
  Employee: any;
  Request: any;
  Account: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
  const { host, port, user, password, database } = config.database;

  const connection = await mysql.createConnection({ host, port, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();

  const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

  const { default: departmentModel } = await import('../departments/department.model');
  db.Department = departmentModel(sequelize);

  const { default: employeeModel } = await import('../employees/employee.model');
  db.Employee = employeeModel(sequelize);

  const { default: requestModel } = await import('../requests/request.model');
  db.Request = requestModel(sequelize);

  const { default: accountModel } = await import('../accounts/account.model');
  db.Account = accountModel(sequelize);

  // Associations
  db.Account.hasOne(db.Employee, { foreignKey: 'accountId' });
  db.Employee.belongsTo(db.Account, { foreignKey: 'accountId' });

  db.Department.hasMany(db.Employee, { foreignKey: 'departmentId' });
  db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId' });

  db.Employee.hasMany(db.Request, { foreignKey: 'employeeId', sourceKey: 'employeeId' });
  db.Request.belongsTo(db.Employee, { foreignKey: 'employeeId', targetKey: 'employeeId' });

  await sequelize.sync({ alter: true });

  // Seed initial departments if table is empty
  const count = await db.Department.count();
  if (count === 0) {
    await db.Department.bulkCreate([
      { name: 'Engineering', description: 'Software development team' },
      { name: 'Marketing', description: 'Marketing team' }
    ]);
    console.log('✅ Departments seeded');
  }

  console.log('✅ Database initialized and models synced');
}
