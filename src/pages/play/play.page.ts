import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, NavParams, Navbar, NavController } from 'ionic-angular';

import { CategoryDataService } from '../../services/category-data.service';
import { ItemDataService } from '../../services/item-data.service';
import { ICategory } from '../../interfaces/category.interface';
import { ICategoryItem } from '../../interfaces/category-item.interface';

import { CategoryListPopoverPage } from '../category-list/category-list.page';
import { RandomizerComponent } from '../../components/randomizer/randomizer.component';

@Component({
    selector: 'rme-play',
    templateUrl: 'play.page.html'
})

export class PlayPage implements OnInit {
    
    items: ICategoryItem[];
    category: ICategory;

    private dummyCounter: number;   // trigger for pipe

    private editing: boolean;

    @ViewChild(RandomizerComponent) private randomizer: RandomizerComponent;
    @ViewChild(Navbar) private navBar: Navbar;

    constructor( 
        private popoverCtrl: PopoverController,
        private categoryService: CategoryDataService,
        private itemService: ItemDataService,
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
                .then( (cats: ICategory[]) => {
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

    updateCategory(category: ICategory, items?:ICategoryItem[]) {
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

    onItemSelected(item: ICategoryItem) {
        item.ignore = !item.ignore;
        if (item.ignore) {
            this.dummyCounter++;
        } else {
            this.dummyCounter--;
        }
    }


    // TODO: remove this
    toggleEditMode() {
        // do something
        this.editing = !this.editing;
        this.navBar.hideBackButton = !this.navBar.hideBackButton;
    }

    // TODO: remove this
    // display Popover
    togglePopover(e: any) {

        // stop randomizer-process
        this.randomizer.stop();

        let popover = this.popoverCtrl.create(
                                CategoryListPopoverPage, 
                                { groupId: this.category.id }
                            );
                            
        // callback
        popover.onWillDismiss( data => {
            if (data && data.group)
                this.updateCategory(data.group);
        });

        popover.present({ev: e});
    }

    // TODO: remove this
    // assign user-specific start index
    setStartIndex( index: number ) {
        if (!this.randomizer.playing) {
            this.randomizer.activeIndex = index;
        }
    }
}