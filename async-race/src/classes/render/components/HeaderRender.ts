import { IDOM, IHTML } from '../../../intefaces';

import { InjectorDOM } from '../../shared/InjectorDOM';

export class HeaderRender {
  private readonly dom: InjectorDOM;

  public section: IHTML = {
    content: document.createElement('header'),
    wrap: document.createElement('div'),
    nav: document.createElement('nav'),
    navList: document.createElement('ul'),
    navItem: document.createElement('li'),
  };

  public navLinks: IHTML = {
    garage: document.createElement('a'),
    score: document.createElement('a'),
  };

  constructor() {
    this.dom = new InjectorDOM();
  }

  public addHeader(): void {
    const header: IDOM = {
      tag: 'header',
      classes: 'header',
      parent: document.body,
    };

    this.section.content = this.dom.push(header);
    this.addWorkZone();
    this.addAppHeader();
  }

  private addWorkZone(): void {
    const headerWorkingZone: IDOM = {
      tag: 'div',
      classes: 'working-zone header__wrap',
      parent: this.section.content,
    };

    this.section.wrap = this.dom.push(headerWorkingZone);
    this.addNav();
  }

  private addNav(): void {
    const headerNav: IDOM = {
      tag: 'nav',
      classes: 'header__nav',
      parent: this.section.wrap,
    };

    this.section.nav = this.dom.push(headerNav);
    this.addNavList();
  }

  private addNavList(): void {
    const headerNavList: IDOM = {
      tag: 'ul',
      classes: 'header__nav__list',
      parent: this.section.nav,
    };

    this.section.navList = this.dom.push(headerNavList);
    this.addNavItem(1);
    this.addNavItem(2);
  }

  private addNavItem(linkNumber: number): void {
    const headerNavItem: IDOM = {
      tag: 'li',
      classes: 'header__nav__list__item',
      parent: this.section.navList,
    };

    this.section.navItem = this.dom.push(headerNavItem);

    switch (linkNumber) {
      case 1:
        this.addNavLinkGarage();
        break;
      case 2:
        this.addNavLinkScore();
        break;

      default:
    }
  }

  private addNavLinkGarage(): void {
    const headerNavLink: IDOM = {
      tag: 'a',
      classes: 'header__nav__list__item__link',
      parent: this.section.navItem,
      innerText: 'Garage',
      attributes: [
        {
          attribute: 'href',
          value: '#',
        },
        { attribute: 'onclick', value: `return false;` },
        { attribute: 'id', value: 'nav-about' },
        {
          attribute: 'data-link',
          value: '#/Garage/',
        },
      ],
    };

    this.navLinks.garage = this.dom.push(headerNavLink);
  }

  private addNavLinkScore(): void {
    const headerNavLink = {
      tag: 'a',
      classes: 'header__nav__list__item__link',
      parent: this.section.navItem,
      innerText: 'Score',
      attributes: [
        {
          attribute: 'href',
          value: '#',
        },
        { attribute: 'onclick', value: `return false;` },

        {
          attribute: 'data-link',
          value: '#/Score/',
        },
      ],
    };

    this.navLinks.score = this.dom.push(headerNavLink);
  }

  private addAppHeader(): void {
    const appHeader: IDOM = {
      tag: 'h1',
      classes: 'invisible',
      parent: this.section.content,
      innerText: 'Async race',
    };

    this.dom.push(appHeader);
  }
}
