import { IDOM, IHTML, INavButtons, IValues } from '../../../intefaces';

import { InjectorDOM } from '../../shared/InjectorDOM';

import { getCarSvg, paintCars } from '../../../store';

export class ScoreRender {
  private readonly dom: InjectorDOM;

  public content: HTMLElement | null = null;

  public interactiveHeaders: HTMLElement[] = [];

  public table: IHTML = {
    content: document.createElement('table'),
    body: document.createElement('tb'),
    header: document.createElement('tr'),
    field: document.createElement('tr'),
    headerWrap: document.createElement('thead'),
  };

  public page: IHTML = {
    workZone: document.createElement('div'),
    header: document.createElement('h2'),
    navButtonsWrap: document.createElement('div'),
    navButtonsHeader: document.createElement('h3'),
  };

  public navButtons: INavButtons = {
    prev: document.createElement('button'),

    next: document.createElement('button'),

    maxElemsOnPage: 10,

    currPage: 1,
  };

  constructor() {
    this.dom = new InjectorDOM();
  }

  public createPage(): void {
    this.interactiveHeaders = [];

    const scoreTable: IDOM = {
      tag: 'section',
      classes: 'score',
      parent: document.body,
    };

    this.content = this.dom.push(scoreTable);
    this.addWorkZone();
  }

  public addTableBodyContent(usersInfo: IValues[]): void {
    const limit = Math.min(this.navButtons.maxElemsOnPage, usersInfo.length);

    for (let i = 0; i < limit; i++) {
      this.addUser();

      const UserPosition: IDOM = {
        tag: 'td',
        classes: 'score__table__body__user__data',
        parent: this.table.field,
        innerText: `${i + 1}`,
      };

      this.dom.push(UserPosition);

      const carSvgWrap = this.dom.push({ ...UserPosition, innerText: `` });

      this.dom.push({ ...UserPosition, innerText: `${usersInfo[i].name}` });
      this.dom.push({ ...UserPosition, innerText: `${usersInfo[i].wins}` });
      this.dom.push({ ...UserPosition, innerText: `${usersInfo[i].time}` });

      const carSvg = getCarSvg();

      this.dom.push({ ...carSvg, parent: carSvgWrap });
    }

    paintCars(usersInfo);
  }

  public removeTableBodyContent(): void {
    while (this.table.body.firstChild) {
      this.table.body.removeChild(this.table.body.firstChild);
    }
  }

  private addWorkZone(): void {
    const workZone: IDOM = {
      tag: 'div',
      classes: 'working-zone',
      parent: this.content as HTMLElement,
    };

    this.page.workZone = this.dom.push(workZone);
    this.addHeader();
    this.addTable();
  }

  private addHeader(): void {
    const header: IDOM = {
      tag: 'h2',
      classes: 'score__header',
      parent: this.page.workZone,
      innerText: 'Best players',
    };

    this.page.header = this.dom.push(header);
  }

  private addTable(): void {
    const table: IDOM = {
      tag: 'table',
      classes: 'score__table',
      parent: this.page.workZone,
    };

    this.table.content = this.dom.push(table);
    this.addTableHeaderWrap();
    this.addTableBody();
    this.addNavButtonsWrap();
  }

  private addTableHeaderWrap(): void {
    const tableHeaderWrap: IDOM = {
      tag: 'thead',
      parent: this.table.content,
    };

    this.table.headerWrap = this.dom.push(tableHeaderWrap);
    this.addTableHeader();
  }

  private addTableHeader(): void {
    const tableHeader: IDOM = {
      tag: 'tr',
      parent: this.table.headerWrap,
    };

    this.table.header = this.dom.push(tableHeader);
    this.addTableHeaderContent();
  }

  private addTableHeaderContent(): void {
    const headerElem: IDOM = {
      tag: 'th',
      classes: 'score__table__header',
      parent: this.table.header,
      innerText: 'Position',
      attributes: [
        {
          attribute: 'data-sort',
          value: '',
        },
      ],
    };

    this.dom.push(headerElem);

    this.addHeaderCarField(headerElem);
    this.addHeaderNameField(headerElem);
    this.addHeaderWinsField(headerElem);
    this.addHeaderTimeField(headerElem);
  }

  private addHeaderCarField(headerElem: IDOM) {
    const header = {
      ...headerElem,
      innerText: 'Car',
    };

    this.dom.push(header);
  }

  private addHeaderNameField(headerElem: IDOM) {
    const header = {
      ...headerElem,
      innerText: 'Name',
    };

    this.dom.push(header);
  }

  private addHeaderWinsField(headerElem: IDOM) {
    const header = {
      ...headerElem,
      innerText: 'Wins',
      attributes: [
        {
          attribute: 'data-sort',
          value: 'wins',
        },
        {
          attribute: 'data-order',
          value: 'DESC',
        },
      ],
    };

    this.interactiveHeaders.push(this.dom.push(header));
  }

  private addHeaderTimeField(headerElem: IDOM) {
    const header = {
      ...headerElem,
      innerText: 'Best time',
      attributes: [
        {
          attribute: 'data-sort',
          value: 'time',
        },
        {
          attribute: 'data-order',
          value: 'ASC',
        },
      ],
    };

    const headerTime = this.dom.push(header);

    headerTime.classList.add('sort_asc');
    this.interactiveHeaders.push(headerTime);
  }

  private addTableBody(): void {
    const tableBody: IDOM = {
      tag: 'tbody',
      classes: 'score__table__body',
      parent: this.table.content,
    };

    this.table.body = this.dom.push(tableBody);
  }

  private addUser(): void {
    const user: IDOM = {
      tag: 'tr',
      classes: 'score__table__body__user',
      parent: this.table.body,
    };

    this.table.field = this.dom.push(user);
  }

  private addNavButtonsWrap(): void {
    const popupNavButtons: IDOM = {
      tag: 'div',
      classes: 'garage__page-navigation',
      parent: this.page.workZone,
    };

    this.page.navButtonsWrap = this.dom.push(popupNavButtons);
    this.addNavButtonsHeader();
    this.addNavPageButtons();
  }

  private addNavButtonsHeader(): void {
    const navButtonsHeader: IDOM = {
      tag: 'h3',
      classes: 'garage__page',
      parent: this.page.navButtonsWrap,
      innerText: `Page #${this.navButtons.currPage}`,
    };

    this.page.navButtonsHeader = this.dom.push(navButtonsHeader);
  }

  private addNavPageButtons(): void {
    const nextPageButton: IDOM = {
      tag: 'button',
      classes: 'register-button garage__settings__form__button disabled-button',
      parent: this.page.navButtonsWrap,
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
