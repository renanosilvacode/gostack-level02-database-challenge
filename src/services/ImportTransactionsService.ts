import ImportCSV from '../config/importCSV';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {


    const loadCSVFile = new ImportCSV();

    const dataFromFile = await loadCSVFile.loadCSV(uploadConfig.directory + '\\' + fileName);

    const createTransactionService = new CreateTransactionService();

    const transactions: Transaction[] = [];
    dataFromFile.forEach((element: any) => {
      transactions.push(element)
    });

    transactions.sort((t1) => (t1.type === 'income') ? 1: -1);

    const { title, type, value, category } = transactions[0];
    const transaction  = await createTransactionService.execute({ title, type, value, category: category.title });

    return transactions;
  }
}

export default ImportTransactionsService;
