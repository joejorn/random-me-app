import { Component } from '@angular/core';

import { CategoryListPage } from '../category-list/category-list.page';
import { HomePage } from '../home/home.page';
// import { PlayPage } from '../play/play.page';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CategoryListPage;

  constructor() {}
}
