import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController, Navbar, NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs';

import { CatalogNotificationService } from '../../services/catalog-notification.service';
import { CatalogService } from '../../services/catalog.service';

import { ICatalog } from '../../interfaces/catalog.interface';

import { CatalogEditorPage } from '../catalog-editor/catalog-editor.page';

@Component({
    selector: 'rme-catalog-list-page',
    templateUrl: 'catalog-list.page.html'
})

export class CatalogListPage {
    
    items: Observable<ICatalog[]>;

    private editing: boolean;

    @ViewChild(Navbar) private navBar: Navbar;

    constructor( 
        private notifyService: CatalogNotificationService,
        private catalogService: CatalogService,
        private alertCtrl: AlertController,
        private navCtrl: NavController
    ) {
        this.items = this.notifyService.categoryAnnounced$;
    }

    ionViewDidLoad() {
        this.navBar.setBackButtonText('');
    }

    /*newItem(): void {
        this.catalogService.newCategory(
            () => { this.notifyService.notify(); } 
        );
    }

    addItem(title: string) {
        if (title && title.length > 0) {
            return this.catalogService.addCategory( { name: title } );
        }

        return Promise.resolve(null);
    }*/

    add() : void {
        this.navCtrl.push(CatalogEditorPage);
    }

    delete( item: ICatalog ): void {
        if (item) {
            this.catalogService.removeCategory(item, () => { this.notifyService.notify(); })
        }
    }

    itemSelected( item: ICatalog ): void {
        this.navCtrl.push(CatalogEditorPage, { catalog: item });
    }

    toggleEdit(): void {
        this.editing = !this.editing;
    }
}



@Component( {
    selector: 'rme-categorylist-popover',
    template: `
        <ion-list radio-group [(ngModel)]="selectedItemId"  (ionChange)="updateItem()" no-margin>
            <ion-item *ngFor="let item of items">
                <ion-label>{{ item.name }}</ion-label>
                <ion-radio [checked]="item.id == selectedItemId" [value]="item.id"></ion-radio>
            </ion-item>
        </ion-list>
    `,
    styles: [':host {display: block}']

})
export class CatalogListPopoverPage implements OnInit {

    private items: ICatalog[];
    private selectedItemId: string;

    private initialId: string;

    constructor(
        private catalogService: CatalogService,
        private navParams: NavParams, 
        public viewCtrl: ViewController,
    ) {
        this.items = [];
    }

    ngOnInit() {
        let _id = this.navParams.data.groupId;
        this.selectedItemId = _id;
        this.initialId = _id;
        this.catalogService.getCategories()
            .then(
                vals => { this.items = vals ? vals : []; }
            )
    }

    updateItem() {
        if (this.selectedItemId !== this.initialId) {
            let _index = this.items.findIndex( item => item.id === this.selectedItemId);
            this.viewCtrl.dismiss( { group: this.items[_index] } );
        }
    }
}