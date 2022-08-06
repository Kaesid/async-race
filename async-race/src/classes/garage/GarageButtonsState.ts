import { IFlags } from '../../intefaces';
import store, { disableNavButtons, setNavButtonsState, toggleAccesstoForm } from '../../store';
import { Render } from '../render/Render';

export class GarageButtonsState {
  private readonly render: Render;

  public isRacesAvialable: IFlags = {};

  constructor(render: Render) {
    this.render = render;
  }

  public buttonsStateOnLoad(): void {
    toggleAccesstoForm(this.render.garage.carUpdateForm);
    this.setRaceCarsButtonState();
  }

  private disableControlButtons(): void {
    disableNavButtons(this.render.garage.navButtons);
    this.disableModifyButtons();
    this.disableGenerationCars();
  }

  private disableModifyButtons(): void {
    toggleAccesstoForm(this.render.garage.carUpdateForm);
    toggleAccesstoForm(this.render.garage.carCreateForm);
  }

  public enableGenerationCarsButton(): void {
    this.render.garage.global.createCars.classList.remove('disabled-button');
  }

  private setGlobalRaceButtonState(): void {
    let isAllCarsReady = true;

    this.render.garage.carsData.ids.forEach(id => {
      if (this.render.garage.carsButtons.race[id].classList.contains('disabled-button')) {
        isAllCarsReady = false;
      }
    });

    if (isAllCarsReady) {
      this.render.garage.winnerMessage.classList.add('hidden');
      this.setRaceReadyMode();
    }
  }

  public setResetsButtonsState(id: number): void {
    this.enableReset(id);

    let isAllCarRacing = true;

    this.render.garage.carsData.ids.forEach(curId => {
      if (this.render.garage.carsButtons.reset[curId].classList.contains('disabled-button')) {
        isAllCarRacing = false;
      }
    });

    if ((isAllCarRacing && store.isRaceMode) || !store.isRaceMode) {
      this.enableResetAll();
      this.render.garage.winnerMessage.classList.add('hidden');
    }
  }

  private setRaceReadyMode(): void {
    this.enableRaceAll();
    this.render.header.section.content.classList.remove('inactive');
    this.disableResetAll();
    this.enableGenerationCarsButton();
    this.enableSelectionBoxes();
    setNavButtonsState(this.render.garage.navButtons, store.totalCars);
    toggleAccesstoForm(this.render.garage.carCreateForm, true);
  }

  private setRaceCarsButtonState(): void {
    if (this.render.garage.carsData.ids.length) {
      this.enableRaceAll();
    } else {
      this.disableRaceAll();
    }
  }

  public setSoloRaceMode(id: number): void {
    this.isRacesAvialable[id] = false;
    this.disableRaceAll();
    this.disableRace(id);
    this.disableControlButtons();
    this.disableSelectionBoxes();
    this.uncheckCheckBox(id);
  }

  public checkRaceButton(id: number): void {
    if (this.isRacesAvialable[id]) {
      this.enableRace(id);
    } else {
      this.isRacesAvialable[id] = true;
    }

    this.setGlobalRaceButtonState();
  }

  private uncheckCheckBox(id: number): void {
    if (this.render.garage.carsButtons.select[id].checked) {
      this.render.garage.carsButtons.select[id].checked = false;
    }
  }

  private enableSelectionBoxes(): void {
    this.render.garage.carsData.ids.forEach(id => {
      this.render.garage.carsButtons.select[id].parentElement?.classList.remove('inactive');
    });
  }

  private disableSelectionBoxes(): void {
    this.render.garage.carsData.ids.forEach(id =>
      this.render.garage.carsButtons.select[id].parentElement?.classList.add('inactive'),
    );
  }

  public enableRaceMode(id: number): void {
    this.render.garage.carsButtons.reset[id].classList.add('disabled-button_race');
  }

  public disableRaceMode(id: number): void {
    this.render.garage.carsButtons.reset[id].classList.remove('disabled-button_race');
  }

  public disableReset(id: number): void {
    this.render.garage.carsButtons.reset[id].classList.add('disabled-button');
  }

  private enableReset(id: number): void {
    this.render.garage.carsButtons.reset[id].classList.remove('disabled-button');
  }

  private enableRace(id: number): void {
    this.render.garage.carsButtons.race[id].classList.remove('disabled-button');

    if (!store.isRaceMode) {
      this.render.garage.carsData.msgBox[id].classList.add('hidden');
    }
  }

  private disableRace(id: number): void {
    this.render.garage.carsButtons.race[id].classList.add('disabled-button');
  }

  public disableResetAll(): void {
    this.render.garage.global.resetAll.classList.add('disabled-button');
  }

  private enableResetAll(): void {
    this.render.garage.global.resetAll.classList.remove('disabled-button');
  }

  public disableRaceAll(): void {
    this.render.garage.global.raceAll.classList.add('disabled-button');
  }

  private enableRaceAll(): void {
    this.render.garage.global.raceAll.classList.remove('disabled-button');
  }

  public disableGenerationCars(): void {
    this.render.garage.global.createCars.classList.add('disabled-button');
  }
}
