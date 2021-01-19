import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {

    const transactionRepository = getRepository(Transaction);

    const transactionToRemove = await transactionRepository.findOne({ where: { id } });

    if(!transactionToRemove){
      throw new AppError('Transaction cannot be deleted', 400);
    } else {

      await transactionRepository.remove(transactionToRemove);
    }
  }
}

export default DeleteTransactionService;
