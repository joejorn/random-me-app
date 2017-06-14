import { Component, ViewChild } from '@angular/core';
import { Alert, AlertController, NavParams, NavController, Navbar } from 'ionic-angular';

import { ICategory } from '../../interfaces/category.interface';
import { ICategoryItem } from '../../interfaces/category-item.interface';

import { CategoryNotifyService } from '../../services/category-notify.service';
import { CategoryDataService } from '../../services/category-data.service';
import { ItemDataService } from '../../services/item-data.service';

@Component({
  selector: 'rme-item-list',
  templateUrl: 'item-list.page.html',
  styles: [`.spacer { height: 5em }`]
})
export class ItemListPage {

	category: ICategory;
	items: ICategoryItem[];
	editing: boolean;

	@ViewChild(Navbar) private navBar: Navbar;

	constructor(
		private navParams: NavParams, 
		private navCtrl: NavController,
		private alertCtrl: AlertController,
		private catNotifyService: CategoryNotifyService,
		private categoryService: CategoryDataService,
		private itemService: ItemDataService
	) {
		this.editing = false;
		this.items = [];
	}

	ngOnInit() {
		this.category = this.navParams.data.category;
		this.loadItems();
	}

	ionViewDidLoad() {
        this.navBar.setBackButtonText('');
    }

	loadItems() {
		this.itemService.getItems(this.category.id)
			.then( (vals) => { 
				this.items = vals? vals: []; 
			} );
	}

	toggleEditMode(){
		this.editing = !this.editing;
		this.navBar.hideBackButton = this.editing;
	}

	newItem() {
		this.openPrompt(
			'New Item', 
			null, 
			null,
			(newName: string, ctx: Alert) => {
				if (newName && newName.length > 0) {
					this.itemService.addItem( { name: newName, categoryId: this.category.id } )
								.then( (val) => {
									this.loadItems();
									return true;
								} );
				}
				return false;
			}
		);
	}
	editItem(item) {
		this.openPrompt(
			'Edit Item', 
			null,
			'' + item.name,
			(newName: string, ctx: Alert) => {
				if (newName && newName.length > 0) {
					//merge changes
					let newItem = Object.assign({}, item, {name: newName} );
					this.itemService.editItem(newItem)
						.then( () => { 
							item.name = newName;	// tricky update
							return true
						} );
				}

				return false;
			}
		);
	}
	removeItem(item: ICategoryItem, e?:Event) {
		if (e)
			e.stopPropagation();

		this.itemService.deleteItem(item).then(
			() => {
				this.loadItems();
			}
		);
	}

	editCategory(category: ICategory) {
		this.openPrompt(
			'Edit Category', 
			null, 
			'' + category.name, 
			(newName: string, ctx: Alert) => {
				if (newName && newName.length > 0) {
					let newCategory = Object.assign({}, category, {name: newName} );
					this.categoryService.editCategory(newCategory)
						.then( () => { 
							category.name = newName;	// tricky update
							this.catNotifyService.notify();
							return true;
						} );
				}

				return false;
			}
		);
	}

	removeCategory(category: ICategory) {

		let prompt = this.alertCtrl.create({
						title: 'Delete Category',
						message: 'Are you sure you want to delete this category?',
						buttons: [
							{ text: 'Cancel', role: 'cancel' },
							{
								text: 'OK',
								handler: data => {
									
									// remove and go back to previous page
									this.categoryService.deleteCategory(category)
										.then( () => { 
											this.catNotifyService.notify();
											prompt.dismiss();
											this.navCtrl.pop();
										} );
									
								}
							},
						]
					});
        prompt.present();
	}


	private openPrompt(title: string, description: string, inputTitle: string, callback?:any) {
        let prompt = this.alertCtrl.create({
                    title: title,
                    message: description,
                    inputs: [
                        { name: 'name', placeholder: 'Title', value: inputTitle },
                    ],
                    buttons: [
                        { text: 'Cancel', role: 'cancel' },
                        {
                            text: 'OK',
                            handler: data => {
								if (callback) {
                                	callback(data.name, prompt);
								}
                            }
                        },
                    ]
                });
        prompt.present();
	}


}
