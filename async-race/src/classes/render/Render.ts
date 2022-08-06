import store, { setNavButtonsState } from '../../store';
import { HeaderRender } from './components/HeaderRender';
import { GarageRender } from './components/GarageRender';
import { ScoreRender } from './components/ScoreRender';
import { ServerController } from '../server/ServerController';
import { IValues } from '../../intefaces';

async function checkStoredPage(page: GarageRender | ScoreRender): Promise<void> {
  if (page.content) {
    document.body.appendChild(page.content);
  } else {
    await page.createPage();
  }
}

export class Render {
  readonly header: HeaderRender;

  readonly garage: GarageRender;

  readonly score: ScoreRender;

  private readonly server: ServerController;

  constructor() {
    this.score = new ScoreRender();

    this.garage = new GarageRender();

    this.header = new HeaderRender();

    this.server = new ServerController();
  }

  createHeader(): void {
    this.header.addHeader();
  }

  async createGarage(): Promise<void> {
    this.createHeader();
    this.header.navLinks.garage.classList.add('link-active');
    await checkStoredPage(this.garage);
  }

  async reloadCars(): Promise<void> {
    await this.garage.reloadCars();
  }

  async createScorePage(): Promise<void> {
    this.createHeader();
    this.header.navLinks.score.classList.add('link-active');
    await checkStoredPage(this.score);

    try {
      const usersData = await this.server.setScoreSorting(
        store.curSort,
        store.curSortOrder,
        this.score.navButtons.currPage,
      );

      this.reGenerateTable(usersData);
    } catch {
      alert(store.ServerIsDown);
    }
  }

  reGenerateTable(usersData: IValues[]): void {
    this.score.removeTableBodyContent();
    this.score.addTableBodyContent(usersData);
    this.score.page.navButtonsHeader.innerText = `Page #${this.score.navButtons.currPage}`;
    this.score.page.header.innerText = `Best Players(${store.totalWinners})`;
    setNavButtonsState(this.score.navButtons, store.totalWinners);
  }
}
