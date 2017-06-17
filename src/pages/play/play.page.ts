import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, NavParams, Navbar, NavController } from 'ionic-angular';

import { CatalogService } from '../../services/catalog.service';
import { CatalogItemService } from '../../services/catalog-item.service';
import { ICatalog } from '../../interfaces/catalog.interface';
import { ICatalogItem } from '../../interfaces/catalog-item.interface';

import { CatalogListPopoverPage } from '../catalog-list/catalog-list.page';
import { RandomizerComponent } from '../../components/randomizer/randomizer.component';

@Component({
    selector: 'rme-play',
    templateUrl: 'play.page.html'
})

export class PlayPage implements OnInit {
    
    items: ICatalogItem[];
    category: ICatalog;

    private dummyCounter: number;   // trigger for pipe

    private editing: boolean;

    @ViewChild(RandomizerComponent) private randomizer: RandomizerComponent;
    @ViewChild(Navbar) private navBar: Navbar;

    constructor( 
        private popoverCtrl: PopoverController,
        private categoryService: CatalogService,
        private itemService: CatalogItemService,
        private navParams: NavParams,
        private navCtrl: NavController
    ){
        this.items = [];
        this.editing = false;
        this.dummyCounter = 0;
    }

    ngOnInit() {
        let _cat = this.navParams.get('category');
        let _items = this.navParams.get('items');   

        if (_cat) {

            this.updateCategory(_cat, _items);

        } else {    
            // no category 
            // -> choose one if available
            this.categoryService.getCategories()
                .then( (cats: ICatalog[]) => {
                    if (cats && cats.length > 0)
                    this.updateCategory(cats[0]);
                });
        }
    }

    ionViewDidLoad() {
        this.navBar.setBackButtonText('');
    }

    ionViewWillLeave() {
        if (this.randomizer.playing) {
            this.randomizer.stop();
        }
    }

    ionViewDidLeave() {
        // prevent data-inconsistency
        this.navCtrl.popTo(this.navCtrl.getPrevious());
    }

    updateCategory(category: ICatalog, items?:ICatalogItem[]) {
        if (category && category.id) {
            this.category = category;
            
            if (items) {
                this.items = items;
            } else {
                this.itemService.getItems(category.id)
                    .then( _items => { this.items = _items; });
            }
        }
    }

    onItemSelected(item: ICatalogItem) {
        item.ignore = !item.ignore;
        if (item.ignore) {
            this.dummyCounter++;
        } else {
            this.dummyCounter--;
        }
    }

    toggleFilter() {
        // do something
        if (this.randomizer.playing)
            this.randomizer.stop();

        this.editing = !this.editing;
        this.navBar.hideBackButton = !this.navBar.hideBackButton;
    }

}


/*

*/