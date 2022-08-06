import { ICarGeneration, IDOM, INavButtons, IValues } from './intefaces';

import svg from './assets/images/car.svg';

export default {
  totalCars: 0,
  totalWinners: 0,
  garagePage: 1,
  curSort: 'time',
  curSortOrder: 'ASC',
  isRaceMode: false,
  ServerIsDown: `Please turn on async-race-api. And please,
  make sure that you are using latest Google Chrome without any extensions`,
  header: document.createElement('header'),
  ScoreTable: document.createElement('section'),
};

export function goToGaragePage(): void {
  window.location.hash = '#/Garage/';
}

export function goToScorePage(): void {
  window.location.hash = '#/Score/';
}

export function toggleAccesstoForm({ input, colorInput, button }: ICarGeneration, isDisable?: boolean): void {
  input.disabled = !isDisable;
  colorInput.disabled = !isDisable;

  if (isDisable) {
    button.classList.remove('disabled-button');
  } else {
    button.classList.add('disabled-button');
  }
}

export function setNavButtonsState({ next, prev, maxElemsOnPage, currPage }: INavButtons, totalElems: number): void {
  const pagesNumber = Math.ceil(totalElems / maxElemsOnPage);

  const isFirstPage = currPage === 1;

  const isLastPage = pagesNumber <= currPage;

  if (isFirstPage) {
    prev.classList.add('disabled-button');
  } else {
    prev.classList.remove('disabled-button');
  }

  if (isLastPage || !pagesNumber) {
    next.classList.add('disabled-button');
  } else {
    next.classList.remove('disabled-button');
  }
}

export function getCarSvg(): IDOM {
  const carSvg: IDOM = {
    tag: 'object',
    classes: 'svg',
    parent: document.body,
    attributes: [
      {
        attribute: 'data',
        value: `${svg}`,
      },
      {
        attribute: 'type',
        value: `image/svg+xml`,
      },
    ],
  };

  return carSvg;
}

export function paintCars(carsData: IValues[]): void {
  const svgsList: NodeListOf<HTMLObjectElement> = document.querySelectorAll('.svg');

  svgsList?.forEach((carSvg, i) => {
    carSvg.addEventListener('load', () => {
      const car = carSvg.getSVGDocument();

      const base = car?.querySelector('.car-base');

      base?.setAttribute('fill', `${carsData[i].color}`);

      const wing = car?.querySelector('.car-wing');

      wing?.setAttribute('fill', `${carsData[i].color}`);

      const hood = car?.querySelector('.car-hood');

      hood?.setAttribute('fill', `${carsData[i].color}`);

      const spoiler = car?.querySelector('.car-spoiler');

      spoiler?.setAttribute('fill', `${carsData[i].color}`);
    });
  });
}

export function disableNavButtons({ next, prev }: INavButtons): void {
  prev.classList.add('disabled-button');
  next.classList.add('disabled-button');
}
