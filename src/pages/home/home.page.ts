import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';

import { CatalogService } from '../../services/catalog.service'; 
import { CatalogNotificationService } from '../../services/catalog-notification.service';
import { ICatalog } from '../../interfaces/catalog.interface';

import { PlayPage } from '../play/play.page';
import { CatalogListPage } from '../catalog-list/catalog-list.page';
import { CatalogEditorPage } from '../catalog-editor/catalog-editor.page';

@Component({
    selector: 'rme-home',
    templateUrl: 'home.page.html'
})

export class HomePage {
    
    catalogs: Observable<ICatalog[]>;

    constructor( 
        private notifyService: CatalogNotificationService,
        private categoryService: CatalogService,
        private navCtrl: NavController
    ){
        this.catalogs = this.notifyService.categoryAnnounced$;
    }

    onItemSelected(category: ICatalog): void {
        this.navCtrl.push(PlayPage, { category: category } );
    }

    edit(): void {
        this.navCtrl.push(CatalogListPage);
    }

    add(): void {
        this.navCtrl.push(CatalogEditorPage);
    }
}