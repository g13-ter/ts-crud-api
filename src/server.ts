import express, { Application } from 'express';
import core from 'cors';
import { errorHandler } from './_middleware/errorHandler';
import { initialize } from './_helpers/db';
import departmentsController from './departments/departments.controller';
import employeesController from './employees/employees.controller';
import requestsController from './requests/requests.controller';
import accountsController from './accounts/accounts.controller';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(core());

// API Routes
app.use('/departments', departmentsController);
app.use('/employees', employeesController);
app.use('/requests', requestsController);
app.use('/accounts', accountsController);

// Global Error Handler (must be last)
app.use(errorHandler);

// Start server + initialize database
const PORT = process.env.PORT || 4000;

initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📝 Test with: POST /users with { email, password, ... }`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });
