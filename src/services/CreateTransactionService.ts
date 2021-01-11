// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}
class CreateTransactionService {
  public async execute({ title, value, type, category } : Request): Promise<Transaction> {

    const transactionRepository = getRepository(Transaction);

    const categoryRepository = getRepository(Category);

    var checkCategoryExists = await categoryRepository.findOne({
      where: {title: category}
    })


    if(!checkCategoryExists){
      checkCategoryExists = categoryRepository.create({
        title: category,
      })

      await categoryRepository.save(checkCategoryExists);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: checkCategoryExists.id,
    });

    await transactionRepository.save(transaction);

    return transaction;

  }
}

export default CreateTransactionService;
