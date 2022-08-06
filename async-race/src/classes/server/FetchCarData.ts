import { ICar, IText, IValues } from '../../intefaces';
import { FetchGarageData } from './FetchGarageData';

export class FetchCarData extends FetchGarageData implements ICar {
  public page = 'engine';

  public method = 'GET';

  private  statuses: IText = {
    start: 'started',
    stop: 'stopped',
    drive: 'drive',
  };

  private status = '';

  public async  start(id: number): Promise<IValues> {
    this.status = this.statuses.start;

    return this.toggleCommand(id);
  }

  public  async stop(id: number): Promise<number> {
    this.status = this.statuses.stop;

    await this.toggleCommand(id);

    return id;
  }

  public  async go(id: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.status = this.statuses.drive;

      this.toggleCommand(id)
        .then(() => resolve(id))
        .catch(() => reject(id));
    });
  }

  public  async toggleCommand(id: number): Promise<IValues> {
    const params = `/?id=${id}&status=${this.status}`;

    const data = (await this.request(params)) as IValues;

    return data;
  }
}
