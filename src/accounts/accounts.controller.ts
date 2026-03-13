import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import Joi from 'joi';
import { Role } from '../_helpers/role';
import { validateRequest } from '../_middleware/validateRequest';
import { accountService } from './account.service';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
  accountService.getAll()
    .then((accounts) => res.json(accounts))
    .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
  accountService.getById(Number(req.params.id))
    .then((account) => res.json(account))
    .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
  accountService.create(req.body)
    .then(() => res.json({ message: 'Account created' }))
    .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
  accountService.update(Number(req.params.id), req.body)
    .then(() => res.json({ message: 'Account updated' }))
    .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
  accountService.delete(Number(req.params.id))
    .then(() => res.json({ message: 'Account deleted' }))
    .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid(Role.Admin, Role.User).default(Role.User),
    status: Joi.string().valid('Active', 'Inactive').default('Active')
  });
  validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
  const schema = Joi.object({
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    email: Joi.string().email().empty(''),
    password: Joi.string().min(6).empty(''),
    confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
    role: Joi.string().valid(Role.Admin, Role.User).empty(''),
    status: Joi.string().valid('Active', 'Inactive').empty('')
  });
  validateRequest(req, next, schema);
}
