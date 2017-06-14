import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs';

import { CategoryNotifyService } from '../../services/category-notify.service';
import { CategoryDataService } from '../../services/category-data.service';
import { ICategory } from '../../interfaces/category.interface';

import { ItemListPage } from '../item-list/item-list.page';

@Component({
    selector: 'rme-category-page',
    templateUrl: 'category-list.page.html'
})

export class CategoryListPage {
    
    items: Observable<ICategory[]>;

    constructor( 
        private notifyService: CategoryNotifyService,
        private dataService: CategoryDataService,
        private alertCtrl: AlertController,
        private navCtrl: NavController
    ) {
        this.items = this.notifyService.categoryAnnounced$;
    }

    newItem(): void {

        let prompt = this.alertCtrl.create({
                    title: 'New Category',
                    inputs: [ { name: 'name', placeholder: 'Title' } ],
                    buttons: [
                        { text: 'Cancel', role: 'cancel' },
                        {
                            text: 'OK',
                            handler: data => {

                                this.addItem(data.name)
                                    .then(
                                        (val) => { 
                                            if (val) {
                                                this.notifyService.notify();
                                                prompt.dismiss();
                                            }
                                        }
                                    );

                                return false;
                            }
                        }
                    ]
                });
        prompt.present();

    }

    addItem(title: string) {
        if (title && title.length > 0) {
            return this.dataService.addCategory( { name: title } );
        }

        return Promise.resolve(null);
    }

    itemSelected( item: ICategory ) {
        this.navCtrl.push(ItemListPage, { category: item });
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
export class CategoryListPopoverPage implements OnInit {

    private items: ICategory[];
    private selectedItemId: string;

    private initialId: string;

    constructor(
        private dataService: CategoryDataService,
        private navParams: NavParams, 
        public viewCtrl: ViewController,
    ) {
        this.items = [];
    }

    ngOnInit() {
        let _id = this.navParams.data.groupId;
        this.selectedItemId = _id;
        this.initialId = _id;
        this.dataService.getCategories()
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