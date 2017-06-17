import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

// page
import { HomePage } from '../pages/home/home.page';
import { PlayPage } from '../pages/play/play.page';
import { CatalogListPage, CatalogListPopoverPage } from '../pages/catalog-list/catalog-list.page';
import { CatalogEditorPage } from '../pages/catalog-editor/catalog-editor.page';
import { ColorEditorPage } from '../pages/color-editor/color-editor.page';

// pipe
import { NoIgnorePipe } from '../pipes/filter.pipe';
// component
import { RandomizerComponent } from '../components/randomizer/randomizer.component';

// injectable
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CatalogNotificationService } from '../services/catalog-notification.service'
import { CatalogService } from '../services/catalog.service'
import { CatalogItemService } from '../services/catalog-item.service'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlayPage,
    CatalogListPage,
    CatalogListPopoverPage,
    CatalogEditorPage,
    ColorEditorPage,
    NoIgnorePipe,
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
    CatalogListPage,
    CatalogListPopoverPage,
    CatalogEditorPage,
    ColorEditorPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CatalogNotificationService,
    CatalogService,
    CatalogItemService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
