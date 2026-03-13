import bcrypt from 'bcryptjs';
import { db } from '../_helpers/db';
import { Role } from '../_helpers/role';
import { Account, AccountCreationAttributes } from './account.model';

export const accountService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll(): Promise<Account[]> {
  return await db.Account.findAll();
}

async function getById(id: number): Promise<Account> {
  return await getAccount(id);
}

async function create(params: AccountCreationAttributes & { password: string }): Promise<void> {
  const existing = await db.Account.findOne({ where: { email: params.email } });
  if (existing) {
    throw new Error(`Email "${params.email}" is already registered`);
  }

  const passwordHash = await bcrypt.hash(params.password, 10);

  await db.Account.create({
    ...params,
    passwordHash,
    role: params.role || Role.User,
    status: params.status || 'Active'
  } as AccountCreationAttributes);
}

async function update(id: number, params: Partial<AccountCreationAttributes> & { password?: string }): Promise<void> {
  const account = await getAccount(id);

  if (params.password) {
    (params as any).passwordHash = await bcrypt.hash(params.password, 10);
    delete params.password;
  }

  await account.update(params as Partial<AccountCreationAttributes>);
}

async function _delete(id: number): Promise<void> {
  const account = await getAccount(id);
  await account.destroy();
}

async function getAccount(id: number): Promise<Account> {
  const account = await db.Account.scope('withHash').findByPk(id);
  if (!account) {
    throw new Error('Account not found');
  }
  return account;
}
