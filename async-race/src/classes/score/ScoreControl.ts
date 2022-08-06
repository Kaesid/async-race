import { IText } from '../../intefaces';
import store from '../../store';
import { Render } from '../render/Render';
import { ServerController } from '../server/ServerController';

function saveSortOrder(headerElem: HTMLElement) {
  store.curSort = headerElem.dataset.sort as string;
  store.curSortOrder = headerElem.dataset.order as string;
}

export class ScoreControl {
  private readonly render: Render;

  private readonly server: ServerController;

  private readonly sortingData: IText = {
    ascOrder: 'ASC',
    ascClass: 'sort_asc',
    descOrder: 'DESC',
    descClass: 'sort_desc',
  };

  constructor(render: Render) {
    this.render = render;
    this.server = new ServerController();
  }

  public loadLogic(): void {
    this.setScoreListeners();
  }

  private setScoreListeners(): void {
    this.render.score.table.headerWrap.onclick = event => this.tableHeaderControl(event);
    this.render.score.page.navButtonsWrap.onclick = event => this.controlScoreNavButtons(event);
  }

  private removeSortingVisual(): void {
    this.render.score.interactiveHeaders.forEach(header => {
      header.classList.remove(this.sortingData.descClass);
      header.classList.remove(this.sortingData.ascClass);
    });
  }

  private tableHeaderControl(event: MouseEvent): void {
    const header = event.target as HTMLElement;
    if (header.dataset.sort && header.dataset.order) {
      this.removeSortingVisual();

      if (header.dataset.order === this.sortingData.descOrder) {
        this.setAscSortView(header);
      } else {
        this.setDescSortView(header);
      }

      saveSortOrder(header);
      this.loadTableData();
    }
  }

  private async loadTableData(): Promise<void> {
    const usersData = await this.server.setScoreSorting(
      store.curSort,
      store.curSortOrder,
      this.render.score.navButtons.currPage,
    );

    this.render.reGenerateTable(usersData);
  }

  private setAscSortView(headerElem: HTMLElement): void {
    headerElem.classList.add(this.sortingData.ascClass);
    headerElem.dataset.order = this.sortingData.ascOrder;
  }

  private setDescSortView(headerElem: HTMLElement): void {
    headerElem.classList.add(this.sortingData.descClass);
    headerElem.dataset.order = this.sortingData.descOrder;
  }

  private async changeScorePage(elem: HTMLElement): Promise<void> {
    if (elem === this.render.score.navButtons.next) {
      this.render.score.navButtons.currPage++;
    } else {
      this.render.score.navButtons.currPage--;
    }

    const usersData = await this.server.getScorePage(this.render.score.navButtons.currPage);

    this.render.reGenerateTable(usersData);
  }

  private controlScoreNavButtons(event: Event): void {
    const elem = event.target as HTMLElement;

    if (elem === this.render.score.navButtons.next || elem === this.render.score.navButtons.prev) {
      this.changeScorePage(elem);
    }
  }
}
