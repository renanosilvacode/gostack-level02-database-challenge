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

interface ResponseDTO{
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {

    const transactionsRepository = getRepository(Transaction);
    const transactions = await transactionsRepository.find();

    const income = transactions.filter(type => type.type === 'income').reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
    const outcome = transactions.filter(type => type.type === 'outcome').reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
    const total = income - outcome;

    const balance : Balance = ({
      income,
      outcome,
      total
    })

    return balance;

  }

  public async getTransactions(): Promise<ResponseDTO> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find({ relations: ['category']});
    const balance = await this.getBalance();

    return ({transactions, balance});

  }
}

export default TransactionsRepository;
