import { IAnimations, IValues, INumber, IText } from '../../intefaces';
import store, { setNavButtonsState, toggleAccesstoForm } from '../../store';
import { MiscAlgorithms } from '../shared/MiscAlgorithms';
import { Render } from '../render/Render';
import { ServerController } from '../server/ServerController';
import { GarageButtonsState } from './GarageButtonsState';

export class GarageControl {
  private readonly server: ServerController;

  private readonly render: Render;

  private readonly calc: MiscAlgorithms;

  private readonly garageButtons: GarageButtonsState;

  private readonly carsClasses: IText = {
    go: 'garage__race__field__main__button__go',
    reset: 'garage__race__field__main__button__stop',
    select: `garage__race__field__main__select`,
    delete: 'garage__race__field__main__remove',
  };

  private readonly animParams = {
    from: 'translateX(0)',
    easing: 'cubic-bezier(0.29, 0.01, 0.62, 0.99)',
    delay: 500,
    otherElemsWidth: 200,
  };

  private animations: IAnimations = {};

  private racersTime: INumber = {};

  private selectedID = 0;

  private readonly systemMsg: IText = {
    awaiting: 'Awaiting server response...',
  };

  private readonly msInSecond = 1000;

  constructor(render: Render) {
    this.server = new ServerController();

    this.garageButtons = new GarageButtonsState(render);

    this.render = render;

    this.calc = new MiscAlgorithms();
  }

  loadLogic(): void {
    this.setRaceFieldListeners();
    this.setFormListener();
    this.navButtonsListener();

    if (!this.render.garage.global.raceAll.classList.contains('disabled-button')) {
      setNavButtonsState(this.render.garage.navButtons, store.totalCars);
    }
  }

  private setFormListener(): void {
    this.render.garage.public.form.onclick = event => this.checkFormTarget(event);
  }

  private setRaceFieldListeners(): void {
    this.render.garage.public.raceField.onclick = e => this.checkRaceFieldTarget(e);
  }

  private navButtonsListener(): void {
    this.render.garage.public.navButtonsWrap.onclick = e => this.checkNavButtonsTarget(e);
  }

  private checkNavButtonsTarget(event: Event) {
    const clickOn = event.target as HTMLElement;

    switch (clickOn) {
      case this.render.garage.navButtons.next:
        this.getNextPage();
        break;

      case this.render.garage.navButtons.prev:
        this.getPrevPage();
        break;

      default:
    }
  }

  private getNextPage(): void {
    this.render.garage.navButtons.currPage++;
    this.reloadGarage();
  }

  private getPrevPage(): void {
    this.render.garage.navButtons.currPage--;
    this.reloadGarage();
  }

  private checkFormTarget(event: Event): void {
    const clickOn = event.target as HTMLElement;

    switch (clickOn) {
      case this.render.garage.global.createCars:
        this.generate100Cars();
        break;

      case this.render.garage.global.raceAll:
        this.setCarsRace();
        break;

      case this.render.garage.global.resetAll:
        this.setCarsReset();
        break;

      case this.render.garage.carCreateForm.button:
        this.createCar();
        break;

      case this.render.garage.carUpdateForm.button:
        this.updateCar(this.selectedID);
        break;

      default:
    }
  }

  private checkRaceFieldTarget(event: Event): void {
    const clickOn = event.target as HTMLElement;

    if (!clickOn.dataset.id) {
      return;
    }

    const id = +clickOn.dataset.id;

    if (clickOn.classList.contains(this.carsClasses.go)) {
      this.raceOneCar(id);
    }

    if (clickOn.classList.contains(this.carsClasses.reset)) {
      this.resetOneCar(id);
    }

    if (clickOn.classList.contains(this.carsClasses.select)) {
      this.selectOneCar(clickOn as HTMLInputElement);
    }

    if (clickOn.classList.contains(this.carsClasses.delete)) {
      this.deleteOneCar(id);
    }
  }

  private async raceOneCar(id: number): Promise<void> {
    this.garageButtons.setSoloRaceMode(id);

    this.racersTime[id] = await this.server.calculateRaceTime(id);

    this.setRaceAimation(id);
    this.garageButtons.setResetsButtonsState(id);

    this.server.car
      .go(id)
      .then(finisherID => this.handleFinishedCar(finisherID))
      .catch(brokeID => this.handleBrokenCar(brokeID));
  }

  private async resetOneCar(id: number): Promise<void> {
    if (!store.isRaceMode) {
      this.render.garage.carsData.msgBox[id].classList.remove('hidden');
    }

    this.garageButtons.disableReset(id);
    this.garageButtons.disableResetAll();

    await this.server.car.stop(id);

    this.garageButtons.checkRaceButton(id);

    if (this.animations[id]) {
      this.animations[id].cancel();
    }

    this.removeBrokenStatus(id);
  }

  private selectOneCar(element: HTMLInputElement): void {
    this.selectedID = +(element.dataset.id as string);
    toggleAccesstoForm(this.render.garage.carUpdateForm, element.checked);
  }

  private async deleteOneCar(id: number): Promise<void> {
    await this.server.deleteUser(id);
    await this.reloadGarage();
  }

  private async reloadGarage(): Promise<void> {
    await this.render.reloadCars();

    setNavButtonsState(this.render.garage.navButtons, store.totalCars);
    this.garageButtons.buttonsStateOnLoad();
  }

  private async generate100Cars(): Promise<void> {
    this.garageButtons.disableGenerationCars();

    await this.server.generateCars();
    await this.reloadGarage();

    this.garageButtons.enableGenerationCarsButton();
  }

  private setCarsRace(): void {
    store.isRaceMode = true;
    this.render.header.section.content.classList.add('inactive');

    this.garageButtons.disableRaceAll();

    this.render.garage.carsData.ids.forEach(id => {
      this.render.garage.carsButtons.race[id].click();
      this.garageButtons.enableRaceMode(id);
    });
  }

  private setCarsReset(): void {
    this.render.header.section.content.classList.add('inactive');

    if (store.isRaceMode) {
      this.showMessage(this.systemMsg.awaiting);
      store.isRaceMode = false;
    }

    this.garageButtons.disableResetAll();

    this.render.garage.carsData.ids.forEach(id => {
      this.render.garage.carsButtons.reset[id].click();
      this.garageButtons.disableRaceMode(id);
    });

    this.render.garage.carsData.cars.forEach(car => car.classList.remove('car-broken'));
  }

  private async createCar(): Promise<void> {
    const car: IValues = this.calc.generateCarData(
      this.render.garage.carCreateForm.input,
      this.render.garage.carCreateForm.colorInput,
    );

    await this.server.garage.add(car);
    await this.reloadGarage();
  }

  private async updateCar(id: number): Promise<void> {
    const car: IValues = this.calc.generateCarData(
      this.render.garage.carUpdateForm.input,
      this.render.garage.carUpdateForm.colorInput,
    );

    await this.server.garage.updateByID(car, id);
    await this.reloadGarage();
  }

  private getSelectedCar(id: number): HTMLElement {
    return this.render.garage.carsData.cars.find(x => x.dataset.id === String(id)) as HTMLElement;
  }

  setRaceAimation(id: number): void {
    const car = this.getSelectedCar(id);

    const raceWidth = car.parentElement?.clientWidth as number;

    this.animations[id] = car.animate(
      [
        { transform: this.animParams.from },
        { transform: `translateX(${raceWidth - this.animParams.otherElemsWidth}px)` },
      ],
      {
        fill: 'forwards',
        easing: this.animParams.easing,
        duration: this.racersTime[id],
        delay: this.animParams.delay,
      },
    );
  }

  handleFinishedCar(id: number): void {
    if (store.isRaceMode) {
      store.isRaceMode = false;
      this.getWinner(id);
    }
    this.render.header.section.content.classList.remove('inactive');
    this.garageButtons.checkRaceButton(id);
  }

  handleBrokenCar(id: number): void {
    const car = this.getSelectedCar(id);

    if (!this.garageButtons.isRacesAvialable[id]) {
      car.classList.add('car-broken');
    }

    this.garageButtons.checkRaceButton(id);
    this.animations[id].pause();
  }

  showMessage(text: string): void {
    this.render.garage.winnerMessage.innerText = text;
    this.render.garage.winnerMessage.classList.remove('hidden');
  }

  async getWinner(id: number): Promise<void> {
    const time = (this.racersTime[id] / this.msInSecond).toFixed(2);

    const car = await this.server.garage.getByID(id);

    this.showMessage(`${car.name} won in ${time} seconds!`);

    await this.server.addWinner(id, +time);
  }

  removeBrokenStatus(id: number): void {
    const car = this.getSelectedCar(id);

    car.classList.remove('car-broken');
  }
}
