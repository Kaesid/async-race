import { MiscAlgorithms } from './shared/MiscAlgorithms';
import { IText } from '../intefaces';
import { goToGaragePage } from '../store';
import { GarageControl } from './garage/GarageControl';
import { Render } from './render/Render';
import { ScoreControl } from './score/ScoreControl';

export function clearPage(): void {
  document.body.innerHTML = '';
}

export class Controller {
  private readonly render: Render;

  private readonly calc: MiscAlgorithms;

  private readonly garage: GarageControl;

  private readonly score: ScoreControl;

  private readonly headerLinkClass = 'header__nav__list__item__link';

  private readonly pages: IText = {
    score: 'score',
    garage: 'garage',
  };

  private headerClickTarget: HTMLElement | undefined;

  constructor() {
    this.render = new Render();

    this.calc = new MiscAlgorithms();

    this.garage = new GarageControl(this.render);

    this.score = new ScoreControl(this.render);
  }

  start(): void {
    this.changePage(window.location.hash);
    this.hashListener();
  }

  hashListener(): void {
    window.onhashchange = () => this.changePage(window.location.hash);
  }

  async changePage(location: string): Promise<void> {
    clearPage();

    if (this.calc.checkAdress(this.pages.score, location)) {
      this.loadScorePage();
    } else if (this.calc.checkAdress(this.pages.garage, location)) {
      this.loadGaragePage();
    } else {
      goToGaragePage();
    }

    this.render.header.section.nav.onclick = event => this.headerNavigation(event);
  }

  headerNavigation(event: Event): void {
    this.headerClickTarget = event.target as HTMLElement;

    if (this.headerClickTarget.classList.contains(this.headerLinkClass)) {
      this.setNewAddress();
    }
  }

  setNewAddress(): void {
    window.location.hash = this.headerClickTarget?.dataset.link as string;
  }

  async loadGaragePage(): Promise<void> {
    await this.render.createGarage();

    this.garage.loadLogic();
  }

  async loadScorePage(): Promise<void> {
    await this.render.createScorePage();

    this.score.loadLogic();
  }
}
