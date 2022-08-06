import { IValues } from '../../intefaces';
import store from '../../store';
import { FetchGarageData } from './FetchGarageData';

export class FetchScoreData extends FetchGarageData {
  page = 'winners';

  async getPageByLimit(page = 1, limit = 10, sort = 'id', order = 'ASC'): Promise<IValues[] | IValues> {
    this.method = this.fetchMethods.get;

    const params = `?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`;

    const data = await this.request(params);

    store.totalWinners = this.totalElements;

    return data;
  }
}
