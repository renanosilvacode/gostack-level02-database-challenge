import { EntityRepository, getRepository, Repository } from 'typeorm';
import Category from '../models/Category';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Transactions{
  id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: Category;
  created_at: Date;
  updated_at: Date;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
  }

  public async getTransactions(): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    console.log(transactions);

  }
}

export default TransactionsRepository;
