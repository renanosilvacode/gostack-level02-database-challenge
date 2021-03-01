import { getRepository, In } from 'typeorm';

import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';


interface CSVTransaction{
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
export default class ImportCSV {

  public async loadCSV(filePath: string): Promise<Transaction[]>{

    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = []

    parseCSV.on('data', line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if(!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });

    })

    await new Promise(resolve => { parseCSV.on('end', resolve);});

    const categoriesRepository = getRepository(Category);
    const existsCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      }
    });

    const existsCategoriesTitles = existsCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories.filter(
      category => !existsCategoriesTitles.includes(category),
    ).filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existsCategories];

    console.log(`finalCategories: ${JSON.stringify(finalCategories)}`)

    const transactionRepository = getRepository(Transaction);
    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(category => category.title === transaction.category)
      })),
    );

    await transactionRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}
