import { ICar, IValues } from '../../intefaces';
import { FetchScoreData } from './FetchScoreData';
import { FetchGarageData } from './FetchGarageData';
import { FetchCarData } from './FetchCarData';
import store from '../../store';
import { MiscAlgorithms } from '../shared/MiscAlgorithms';

export class ServerController {
  garage: FetchGarageData;

  score: FetchScoreData;

  car: ICar;

  private calc: MiscAlgorithms;

  private order = 'ASC';

  private sortBy = 'time';

  private carsToGenerate = 100;

  private winnersPerPage = 10;

  constructor() {
    this.garage = new FetchGarageData();

    this.score = new FetchScoreData();

    this.car = new FetchCarData();

    this.calc = new MiscAlgorithms();
  }

  async updateCar(id: number, name?: string, color?: string): Promise<void> {
    const updateCar: IValues = (await this.garage.getByID(id)) as IValues;

    if (name) {
      updateCar.name = name;
    }

    if (color) {
      updateCar.color = color;
    }

    await this.garage.updateByID(updateCar, id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.garage.deleteByID(id);

    await this.score.deleteByID(id);
  }

  async addWinner(id: number, time: number): Promise<void> {
    const user = await this.score.getByID(id);

    if (user.id) {
      this.updateUserScore(user, time);
    } else {
      this.createNewWinner(id, time);
    }
  }

  async getGaragePage(page = 1): Promise<IValues[]> {
    store.garagePage = page;

    const carsOnPage = (await this.garage.getPageByLimit(page)) as IValues[];

    return carsOnPage;
  }

  async setScoreSorting(sortBy: string, order: string, page: number): Promise<IValues[]> {
    this.sortBy = sortBy;
    this.order = order;

    return this.getScorePage(page);
  }

  async getScorePage(page = 1): Promise<IValues[]> {
    const scores = (await this.score.getPageByLimit(page, this.winnersPerPage, this.sortBy, this.order)) as IValues[];

    const promises: Promise<IValues>[] = [];

    const users: IValues[] = [];

    scores.forEach(winner => promises.push(this.garage.getByID(winner.id as number)));

    const carsData = await Promise.all(promises);

    scores.forEach((winner, i) => users.push(Object.assign(winner, carsData[i])));

    return users;
  }

  async generateCars(): Promise<void> {
    const promises: Promise<void>[] = [];

    const carsData: IValues[] = Array.from({ length: this.carsToGenerate }, () => ({
      name: this.calc.getCarName(),
      color: this.calc.getCarColor(),
    }));

    carsData.forEach(carData => promises.push(this.garage.add(carData)));

    await Promise.all(promises);
  }

  private async createNewWinner(id: number, time: number) {
    const newWinner = {
      id,
      wins: 1,
      time,
    };

    this.score.add(newWinner);
  }

  private async updateUserScore(user: IValues, newTime: number): Promise<void> {
    if (newTime < user.time) {
      user.time = newTime;
    }

    (user.wins as number)++;

    this.score.updateByID(user, user.id as number);
  }

  async calculateRaceTime(id: number): Promise<number> {
    const race = await this.car.start(id);

    const speed: number = race.velocity as number;

    const distance: number = race.distance as number;

    return distance / speed;
  }
}
