import ImportCSV from '../config/importCSV';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {


    const loadCSVFile = new ImportCSV();

    const dataFromFile = await loadCSVFile.loadCSV(uploadConfig.directory + '\\' + fileName);

    const createTransactionService = new CreateTransactionService();

    const trans = Object.assign({}, dataFromFile);

    console.log(trans);

    const transaction: Transaction[] = [];

    return transaction;
  }
}

export default ImportTransactionsService;
