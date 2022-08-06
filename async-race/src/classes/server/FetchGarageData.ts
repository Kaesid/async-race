import { IText, IValues } from '../../intefaces';
import store from '../../store';

export class FetchGarageData {
  public base = 'http://127.0.0.1:3000';

  public page = 'garage';

  public method = 'GET';

  public totalElements = 0;

  public data = {};

  public address = '';

  private inputType: IText = {
    id: 'number',
    params: 'string',
  };

  public fetchMethods: IText = {
    get: 'GET',
    put: 'PUT',
    delete: 'DELETE',
    post: 'POST',
  };

  public request(id?: number | string): Promise<IValues | Array<IValues>> {
    this.compileAddress(id);

    return new Promise((resolve, reject) => {
      fetch(this.address, {
        method: this.method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      })
        .then(async response => {
          if (response.headers.get('X-Total-Count')) {
            this.totalElements = +(response.headers.get('X-Total-Count') as string);
          }
          resolve(response.json());
        })
        .catch(e => reject(e));
    });
  }

  public async requestWithData(data: IValues, id?: number | string): Promise<void> {
    this.compileAddress(id);
    return new Promise((resolve, reject) => {
      fetch(this.address, {
        method: this.method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  public compileAddress(input?: number | string): void {
    this.address = `${this.base}/${this.page}`;

    if (typeof input === this.inputType.id) {
      this.address += `/${input}`;
    }
    if (typeof input === this.inputType.params) {
      this.address += `${input}`;
    }
  }

  public async getAll(): Promise<Array<IValues>> {
    this.method = this.fetchMethods.get;

    return (await this.request()) as Array<IValues>;
  }

  public async getPageByLimit(page = 1, limit = 7): Promise<IValues[] | IValues> {
    this.method = this.fetchMethods.get;

    const params = `?_page=${page}&_limit=${limit}`;

    const data = await this.request(params);

    store.totalCars = this.totalElements;

    return data;
  }

  public async getByID(id: number): Promise<IValues> {
    this.method = this.fetchMethods.get;

    return (await this.request(id)) as IValues;
  }

  public async deleteByID(id: number): Promise<IValues> {
    this.method = this.fetchMethods.delete;

    return (await this.request(id)) as IValues;
  }

  public async add(data: IValues): Promise<void> {
    this.method = this.fetchMethods.post;

    await this.requestWithData(data);
  }

  public async updateByID(data: IValues, id: number): Promise<void> {
    this.method = this.fetchMethods.put;

    await this.requestWithData(data, id);
  }
}
