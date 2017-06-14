import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

// page
import { HomePage } from '../pages/home/home.page';
import { PlayPage } from '../pages/play/play.page';
import { CategoryListPage, CategoryListPopoverPage } from '../pages/category-list/category-list.page';
import { ItemListPage } from '../pages/item-list/item-list.page';
import { TabsPage } from '../pages/tabs/tabs';

// pipe
import { NoIgnorePipe } from '../pipes/filter.pipe';
// component
import { RandomizerComponent } from '../components/randomizer/randomizer.component';

// injectable
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoryNotifyService } from '../services/category-notify.service'
import { CategoryDataService } from '../services/category-data.service'
import { ItemDataService } from '../services/item-data.service'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlayPage,
    CategoryListPage,
    CategoryListPopoverPage,
    ItemListPage,
    NoIgnorePipe,
    TabsPage,
    RandomizerComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '_rme_db',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlayPage,
    CategoryListPage,
    CategoryListPopoverPage,
    ItemListPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CategoryNotifyService,
    CategoryDataService,
    ItemDataService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
