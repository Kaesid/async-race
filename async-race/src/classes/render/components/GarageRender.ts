import {
  ICarsData,
  IDOM,
  IValues,
  ICarGeneration,
  INavButtons,
  IHTML,
  IButtonsGroup,
  ICarsButtons,
} from '../../../intefaces';

import { InjectorDOM } from '../../shared/InjectorDOM';

import store, { getCarSvg, paintCars } from '../../../store';

import { ServerController } from '../../server/ServerController';

export class GarageRender {
  private readonly dom: InjectorDOM;

  private readonly server: ServerController;

  public content: HTMLElement | null = null;

  private carIndex = 0;

  private data: IValues[] = [];

  private page: IHTML = {
    workZone: document.createElement('div'),

    header: document.createElement('h2'),

    settings: document.createElement('div'),

    fieldsetCarsCreate: document.createElement('fieldset'),

    fieldsetCarsUpdate: document.createElement('fieldset'),

    carsCreatorWrap: document.createElement('div'),

    raceControlWrap: document.createElement('div'),

    moveContentMenu: document.createElement('div'),

    carField: document.createElement('div'),

    carContentMenu: document.createElement('div'),

    carFieldContent: document.createElement('div'),
  };

  public public: IHTML = {
    navButtonsWrap: document.createElement('div'),

    raceField: document.createElement('article'),

    navButtonsHeader: document.createElement('h3'),

    form: document.createElement('form'),
  };

  public carsButtons: ICarsButtons = {
    race: {},

    reset: {},

    select: {},
  };

  public carsData: ICarsData = {
    cars: [],

    msgBox: {},

    ids: [],
  };

  public global: IButtonsGroup = {
    createCars: document.createElement('button'),

    raceAll: document.createElement('button'),

    resetAll: document.createElement('button'),
  };

  public navButtons: INavButtons = {
    prev: document.createElement('button'),

    next: document.createElement('button'),

    maxElemsOnPage: 7,

    currPage: 1,
  };

  public carUpdateForm: ICarGeneration = {
    input: document.createElement('input'),

    colorInput: document.createElement('input'),

    button: document.createElement('button'),
  };

  public carCreateForm: ICarGeneration = {
    input: document.createElement('input'),

    colorInput: document.createElement('input'),

    button: document.createElement('button'),
  };

  constructor() {
    this.dom = new InjectorDOM();

    this.server = new ServerController();
  }

  async createPage(): Promise<void> {
    try {
      this.data = await this.server.getGaragePage();

      const garage: IDOM = {
        tag: 'section',
        classes: 'garage',
        parent: document.body,
      };

      this.content = this.dom.push(garage);

      this.addWorkZone();
    } catch {
      alert(store.ServerIsDown);
    }
  }

  removeCars(): void {
    while (this.public.raceField.firstChild) {
      this.public.raceField.removeChild(this.public.raceField.firstChild);
    }
  }

  private changeHeaders(): void {
    this.page.header.innerText = `Garage (${store.totalCars}) `;
    this.public.navButtonsHeader.innerText = `Page #${this.navButtons.currPage}`;
  }

  async reloadCars(): Promise<void> {
    this.data = await this.server.getGaragePage(this.navButtons.currPage);

    this.changeHeaders();
    this.removeCars();
    this.resetCarsData();
    this.generateCars();
  }

  private resetCarsData(): void {
    this.carsData.ids = [];

    this.carsData.cars = [];

    this.carsButtons.reset = {};

    this.carsButtons.race = {};
  }

  private generateCars(): void {
    const limit = Math.min(this.navButtons.maxElemsOnPage, this.data.length);

    for (this.carIndex = 0; this.carIndex < limit; this.carIndex++) {
      this.addCarField();
    }

    this.setRaceCarButtonState();
    paintCars(this.data);
  }

  private setRaceCarButtonState(): void {
    if (this.carsData.ids.length) {
      this.global.raceAll.classList.remove('disabled-button');
    } else {
      this.global.raceAll.classList.add('disabled-button');
    }
  }

  private addWorkZone(): void {
    const workZone: IDOM = {
      tag: 'div',
      classes: 'working-zone garage__wrapper',
      parent: this.content as HTMLElement,
    };

    this.page.workZone = this.dom.push(workZone);

    this.addHeader();
    this.addSettings();
    this.addWinnerMessage();
    this.addRaceField();
    this.addNavButtonsWrap();
  }

  public winnerMessage: HTMLElement = document.createElement('h2');

  private addWinnerMessage(): void {
    const message: IDOM = {
      tag: 'h2',
      classes: 'garage__winner-message hidden',
      parent: this.page.workZone,
      innerText: '',
    };

    this.winnerMessage = this.dom.push(message);
  }

  private addSettings(): void {
    const settings: IDOM = {
      tag: 'article',
      classes: 'garage__settings',
      parent: this.page.workZone,
    };

    this.page.settings = this.dom.push(settings);
    this.addSettingsForm();
  }

  private addSettingsForm(): void {
    const garageForm: IDOM = {
      tag: 'form',
      classes: 'garage__settings__form',
      parent: this.page.settings,
      attributes: [
        {
          attribute: 'action',
          value: '#',
        },
      ],
    };

    this.public.form = this.dom.push(garageForm) as HTMLFormElement;
    this.addCarsCreator();
    this.addRaceControl();
  }

  private addRaceControl(): void {
    const raceControl: IDOM = {
      tag: 'div',
      classes: 'garage__settings__form__control',
      parent: this.public.form,
    };

    this.page.raceControlWrap = this.dom.push(raceControl);
    this.addRaceControlButtons();
  }

  private addRaceControlButtons(): void {
    const raceButton: IDOM = {
      tag: 'button',
      classes: 'register-button garage__settings__form__control__race',
      parent: this.page.raceControlWrap,
      innerText: 'Race',
      attributes: [
        {
          attribute: 'onclick',
          value: 'return false;',
        },
      ],
    };

    this.global.raceAll = this.dom.push(raceButton) as HTMLButtonElement;

    const resetButton: IDOM = {
      ...raceButton,
      classes: 'register-button race-stop-button',
      innerText: 'Reset',
    };

    this.global.resetAll = this.dom.push(resetButton) as HTMLButtonElement;
    this.global.resetAll.classList.add('disabled-button');

    const generateButton: IDOM = {
      ...raceButton,
      classes: 'register-button garage__settings__form__control__generate',
      innerText: 'Generate cars',
    };
    this.global.createCars = this.dom.push(generateButton) as HTMLButtonElement;
  }

  private addCarsCreator(): void {
    const carsCreatorWrap: IDOM = {
      tag: 'div',
      classes: 'garage__settings__add-upd',
      parent: this.public.form,
    };

    this.page.carsCreatorWrap = this.dom.push(carsCreatorWrap);
    this.addFieldsetsCarsCreator();
  }

  private addFieldsetsCarsCreator(): void {
    const fieldsetCarsCreator: IDOM = {
      tag: 'fieldset',
      classes: 'garage__settings__form__fieldset',
      parent: this.page.carsCreatorWrap,
    };

    this.page.fieldsetCarsCreate = this.dom.push(fieldsetCarsCreator);
    this.page.fieldsetCarsUpdate = this.dom.push(fieldsetCarsCreator);
    this.addInputsCarsCreator();
  }

  private addInputsCarsCreator(): void {
    const inputCarsCreator: IDOM = {
      tag: 'input',
      classes: 'garage__settings__form__input',
      parent: this.page.fieldsetCarsCreate,
      attributes: [
        {
          attribute: 'type',
          value: 'text',
        },
        { attribute: 'maxlength', value: '30' },
        {
          attribute: 'placeholder',
          value: `Car's name`,
        },
      ],
    };

    this.carCreateForm.input = this.dom.push(inputCarsCreator) as HTMLInputElement;

    this.carUpdateForm.input = this.dom.push({
      ...inputCarsCreator,
      parent: this.page.fieldsetCarsUpdate,
    }) as HTMLInputElement;

    this.carUpdateForm.input.disabled = true;
    this.addColorCarCreator();
  }

  private addColorCarCreator(): void {
    const colorInputCarsCreator: IDOM = {
      tag: 'input',
      classes: 'garage__settings__form__color',
      parent: this.page.fieldsetCarsCreate,
      attributes: [
        {
          attribute: 'type',
          value: 'color',
        },
      ],
    };

    this.carCreateForm.colorInput = this.dom.push(colorInputCarsCreator) as HTMLInputElement;

    this.carUpdateForm.colorInput = this.dom.push({
      ...colorInputCarsCreator,
      parent: this.page.fieldsetCarsUpdate,
    }) as HTMLInputElement;

    this.carUpdateForm.colorInput.disabled = true;
    this.addButtonsCarCreator();
  }

  addButtonsCarCreator(): void {
    const buttonCarCreate: IDOM = {
      tag: 'button',
      classes: 'register-button garage__settings__form__button',
      parent: this.page.fieldsetCarsCreate,
      innerText: 'Create',
      attributes: [
        {
          attribute: 'onclick',
          value: 'return false;',
        },
      ],
    };

    const buttonCarUpdate: IDOM = {
      ...buttonCarCreate,
      classes: 'register-button garage__settings__form__button disabled-button',
      parent: this.page.fieldsetCarsUpdate,
      innerText: 'Update',
    };

    this.carCreateForm.button = this.dom.push(buttonCarCreate) as HTMLButtonElement;
    this.carUpdateForm.button = this.dom.push(buttonCarUpdate) as HTMLButtonElement;
  }

  private addHeader(): void {
    const header: IDOM = {
      tag: 'h2',
      classes: 'garage__header',
      parent: this.page.workZone,
      innerText: `Garage (${store.totalCars}) `,
    };

    this.page.header = this.dom.push(header);
  }

  private addRaceField(): void {
    const raceField: IDOM = {
      tag: 'article',
      classes: 'garage__race',
      parent: this.page.workZone,
    };

    this.public.raceField = this.dom.push(raceField);
    this.generateCars();
  }

  private addCarField(): void {
    const carField: IDOM = {
      tag: 'div',
      classes: 'garage__race__field',
      parent: this.public.raceField,
    };

    this.page.carField = this.dom.push(carField);
    this.addCarFieldHeader();
    this.addCarFieldContent();
    this.addRoad();
  }

  private addCarFieldHeader(): void {
    const carFieldHeader: IDOM = {
      tag: 'p',
      classes: 'garage__race__field__header__name',
      parent: this.page.carField,
      innerText: `${this.data[this.carIndex].name}`,
    };

    const header = this.dom.push(carFieldHeader);

    const msgPlaceholder: IDOM = {
      tag: 'span',
      classes: 'garage__race__field__header__name_msg hidden',
      parent: header,
      innerText: 'Awaiting server response...',
    };

    const id = this.data[this.carIndex].id as number;

    this.carsData.msgBox[id] = this.dom.push(msgPlaceholder);
  }

  private addCarFieldContent(): void {
    const carFieldContent: IDOM = {
      tag: 'div',
      classes: 'garage__race__field__main',
      parent: this.page.carField,
    };

    this.page.carFieldContent = this.dom.push(carFieldContent);
    this.addCarContentMenu();
    this.addMoveContentMenu();
    this.addCar();
    this.addFinishLine();
  }

  private addCar(): void {
    const car: IDOM = {
      tag: 'div',
      classes: 'garage__race__field__main__car',
      parent: this.page.carFieldContent,
      attributes: [
        {
          attribute: 'data-id',
          value: `${this.data[this.carIndex].id}`,
        },
      ],
    };

    this.carsData.ids.push(this.data[this.carIndex].id as number);

    const carWrap = this.dom.push(car);

    const carSvg = getCarSvg();

    this.dom.push({ ...carSvg, parent: carWrap });

    this.carsData.cars.push(carWrap);
  }

  private addFinishLine(): void {
    const finishLine: IDOM = {
      tag: 'div',
      classes: 'garage__race__field__main__finish',
      parent: this.page.carFieldContent,
    };

    this.dom.push(finishLine);
  }

  private addRoad(): void {
    const finishLine: IDOM = {
      tag: 'hr',
      classes: 'garage__race__field__road',
      parent: this.page.carField,
    };

    this.dom.push(finishLine);
  }

  addMoveContentMenu(): void {
    const moveContentMenu: IDOM = {
      tag: 'div',
      classes: 'garage__race__field__main__buttons-container',
      parent: this.page.carFieldContent,
    };

    this.page.moveContentMenu = this.dom.push(moveContentMenu);
    this.addCarMoveButton();
    this.addCarResetButton();
  }

  addMoveButtonWrapper(): HTMLElement {
    const moveButtonWrapper: IDOM = {
      tag: 'div',
      classes: 'garage__race__field__main__button',
      parent: this.page.moveContentMenu,
    };

    return this.dom.push(moveButtonWrapper);
  }

  addCarMoveButton(): void {
    const goButton: IDOM = {
      tag: 'button',
      classes: 'register-button garage__race__field__main__button__go',
      innerText: 'Go',
      parent: this.addMoveButtonWrapper(),
      attributes: [
        {
          attribute: 'data-id',
          value: `${this.data[this.carIndex].id}`,
        },
      ],
    };

    const id = this.data[this.carIndex].id as number;

    this.carsButtons.race[id] = this.dom.push(goButton) as HTMLButtonElement;
  }

  addCarResetButton(): void {
    const resetButton: IDOM = {
      tag: 'button',
      innerText: 'Stop',
      classes: 'register-button garage__race__field__main__button__stop',
      parent: this.addMoveButtonWrapper(),
      attributes: [
        {
          attribute: 'data-id',
          value: `${this.data[this.carIndex].id}`,
        },
      ],
    };

    const reset = this.dom.push(resetButton) as HTMLButtonElement;

    reset.classList.add('disabled-button');

    const id = this.data[this.carIndex].id as number;

    this.carsButtons.reset[id] = reset;
  }

  addCarContentMenu(): void {
    const carContentMenu: IDOM = {
      tag: 'div',
      classes: 'garage__race__field__main__select-delete',
      parent: this.page.carFieldContent,
    };

    this.page.carContentMenu = this.dom.push(carContentMenu);
    this.addSelectCarCheckbox();
    this.addDeletCarButton();
  }

  addSelectCarCheckbox(): void {
    const selectCarCheckBox: IDOM = {
      tag: 'input',
      classes: 'garage__race__field__main__select',
      parent: this.page.carContentMenu,
      attributes: [
        {
          attribute: 'type',
          value: 'radio',
        },
        {
          attribute: 'name',
          value: 'checkbox',
        },
        {
          attribute: 'data-id',
          value: `${this.data[this.carIndex].id}`,
        },
      ],
    };

    const id = this.data[this.carIndex].id as number;

    this.carsButtons.select[id] = this.dom.push(selectCarCheckBox) as HTMLInputElement;
  }

  addDeletCarButton(): void {
    const deleteCarButton: IDOM = {
      tag: 'button',
      classes: 'garage__race__field__main__remove',
      parent: this.page.carContentMenu,
      attributes: [
        {
          attribute: 'data-id',
          value: `${this.data[this.carIndex].id}`,
        },
      ],
    };

    this.dom.push(deleteCarButton);
  }

  private addNavButtonsWrap(): void {
    const popupNavButtons: IDOM = {
      tag: 'div',
      classes: 'garage__page-navigation',
      parent: this.page.workZone,
    };

    this.public.navButtonsWrap = this.dom.push(popupNavButtons);
    this.addNavButtonsHeader();
    this.addNavPageButtons();
  }

  private addNavButtonsHeader(): void {
    const navButtonsHeader: IDOM = {
      tag: 'h3',
      classes: 'garage__page',
      parent: this.public.navButtonsWrap,
      innerText: `Page #${this.navButtons.currPage}`,
    };

    this.public.navButtonsHeader = this.dom.push(navButtonsHeader);
  }

  private addNavPageButtons(): void {
    const nextPageButton: IDOM = {
      tag: 'button',
      classes: 'register-button garage__settings__form__button disabled-button',
      parent: this.public.navButtonsWrap,
      innerText: 'Next',
    };

    const prevPageButton: IDOM = {
      ...nextPageButton,
      innerText: 'Prev',
    };

    this.navButtons.prev = this.dom.push(prevPageButton) as HTMLButtonElement;
    this.navButtons.next = this.dom.push(nextPageButton) as HTMLButtonElement;
  }
}
