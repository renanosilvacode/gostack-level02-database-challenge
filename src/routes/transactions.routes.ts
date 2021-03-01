import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';


const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {

  const transactionsRepository = new TransactionsRepository();

  const transactionsAndBalance = await transactionsRepository.getTransactions();

  response.json(transactionsAndBalance);

});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category
  })

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {

  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute(id);

  return response.status(204).json();
});

transactionsRouter.post('/import', upload.single('transaction'), async (request, response) => {

  const importTransactionService = new ImportTransactionsService();

  const transactions = await importTransactionService.execute(request.file.filename);

  return response.status(200).json(transactions);

});

export default transactionsRouter;
