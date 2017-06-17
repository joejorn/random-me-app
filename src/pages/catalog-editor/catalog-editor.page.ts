import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewController, NavController, Navbar, NavParams } from 'ionic-angular';

// service
import { CatalogNotificationService } from '../../services/catalog-notification.service';
import { CatalogService } from '../../services/catalog.service';
import { CatalogItemService } from '../../services/catalog-item.service';

// interfaces
import { ICatalog } from '../../interfaces/catalog.interface';
import { ICatalogItem } from '../../interfaces/catalog-item.interface';

// page
import { ColorEditorPage } from '../color-editor/color-editor.page'

@Component({
    selector: 'rme-catalog-editor',
    templateUrl: 'catalog-editor.page.html'
})

export class CatalogEditorPage implements OnInit {

    catalog: ICatalog;
    items: ICatalogItem[];

    // context: catalog
    private editMode: boolean;

    // context: catalog-item
    private itemEditing: boolean;   // editing items
    private adding: boolean;   // adding item

    @ViewChild(Navbar) private navBar: Navbar;

    constructor( 
        private notificationService: CatalogNotificationService,
        private categoryService: CatalogService,
        private itemService: CatalogItemService,
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private navParams: NavParams,
    ) {
        this.editMode = false;
        this.catalog = { id: null, name: '' };
        this.items = [];
    }

    ngOnInit() {
        let _catalog: ICatalog = this.navParams.get('catalog');
        let _id = _catalog ? _catalog.id : null;

        if (_id) {  // edit an existing catalog
            this.categoryService.getDetailCategory(_id)
                .then(
                    val => {
                        this.items = val.items;
                        delete val.items;

                        this.catalog = val;
                        this.editMode = true;
                    }
                );
        } 
    }

    ionViewDidLoad() {
        this.navBar.setBackButtonText('');
    }

    // navigate back
    dismiss(): void {
        console.log('dismiss this view');
        this.viewCtrl.dismiss();
    }

    // navigate to color-list page
    selectColor(): void {
        // console.log('show colors');
        this.navCtrl.push(ColorEditorPage, {catalog: this.catalog});
    }

    // add / update catalog
    setCatalog(e: Event): void {

        // check keyboard active?
        // yes -> do: hide keyboard -> (auto) trigger blur()
        // no -> (on-blur event) do: update catalog
        let inputEl = e.target as HTMLInputElement;
        let title = inputEl.value;
        
        if (title !== '') {
            
            if (this.catalog.name !== title) {
                this.catalog.name = title;

                if (!this.editMode) {
                    // create catalog
                    // console.log('create new catalog: ', this.catalog);
                    this.categoryService.addCategory(this.catalog)
                        .then( 
                            (val) => {
                                this.catalog = val;
                                this.notificationService.notify();
                            }
                        );
                } else {
                    // update catalog
                    // console.log('update catalog: ', this.catalog);
                    this.categoryService.editCategory(this.catalog)
                        .then( () => this.notificationService.notify() );
                }

                this.editMode = true;
            }


        } else if (this.editMode) {  
            
            // empty title in edit-mode -> reset field value
            (e.srcElement as any).value = this.catalog.name;
            
        }
    }

    // update an existing item
    setItem(e: Event, item: ICatalogItem ): void {
        
        let inputEl = e.target as HTMLInputElement;
        let title = inputEl.value;

        if (!item) return;  // nothing to do

        if (item && title !== '') {    // blur + non-empty value

            if (item.name == title)    // update the item
                return;
            
            console.log('update item: "%s" -> "%s"', item.name, title);
            item.name = title;

            // do something 
            // -> data service
            this.itemService.editItem(item);
                

        } else if (title === '') {    

            // reset name
            (e.srcElement as any).value = item.name;

        }
    }

    // add new item
    addItem(e: Event): void {

        let title = (e.target as HTMLInputElement).value;

        if (title === '') return;   // nothing to get added
        
        // do something

        let _item = { 
            id: null,
            name: title, 
            categoryId: this.catalog.id
        }
        this.itemService.addItem(_item)
            .then( (val) => { 
                console.log('add item: ', val);
                (e.srcElement as any).value = '';
                this.items.push(val) 
            });
        
        // reset name

    }

    toggleItemEdit() {
        this.itemEditing = !this.itemEditing;
    }

    deleteItem( item: ICatalogItem ): void {
        if (item) {
            this.itemService.deleteItem( item )
                .then(
                    () => {
                        console.log('remove item: ', item);
                        this.items.splice( this.items.indexOf(item), 1 );
                    }
                )
        }
    }

    // handles enter-key pressing
    setBlur(el: HTMLElement) {
        el.blur();
    }

    // handle tapping on add-icon -> focus the inner input element
    setFocus(el: any) {
        if (!this.adding) {
            el._elementRef.nativeElement.children[0].focus();
        }
    }

    // remove catalog and navigate back
    delete() {
        if (this.catalog.id) {

            this.categoryService.removeCategory(
                this.catalog, 
                () => { 
                    this.notificationService.notify();  // trigger change
                    this.dismiss(); 
                }
            );

        }
    }

}