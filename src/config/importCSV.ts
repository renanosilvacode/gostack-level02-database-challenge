import csvParse from 'csv-parse';
import fs from 'fs';
import transactionsRouter from '../routes/transactions.routes';

export default class ImportCSV {

  public async loadCSV(filePath: string): Promise<any>{

    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: any[] = [];

    parseCSV.on('data', line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      lines.push({title, type, value, category});

    })

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    return lines;
  }
}
