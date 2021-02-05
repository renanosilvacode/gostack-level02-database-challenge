import ImportCSV from '../config/importCSV';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {


    const loadCSVFile = new ImportCSV();

    const transactionsFromFile = await loadCSVFile.loadCSV(uploadConfig.directory + '\\' + fileName);

    return transactionsFromFile;
  }
}

export default ImportTransactionsService;
