import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

import { StorageService  } from './storage.service';
import { CatalogItemService } from './catalog-item.service';
import { ICatalog } from '../interfaces/catalog.interface';

@Injectable()
export class CatalogService extends StorageService {

    public DEFAULT_TABLE_NAME: string = 'categories';

    constructor( 
        protected storage: Storage,
        private itemDataService: CatalogItemService,
        private alertCtrl: AlertController
    ) {
        super(storage);

        this.namespace = this.DEFAULT_TABLE_NAME;
        this.prepareStorage();
    }

    removeCategory( category: ICatalog, callback?: any ) {
        let prompt = this.alertCtrl.create({
						title: 'Delete Catalog',
						message: 'Are you sure you want to delete this catalog?',
						buttons: [
							{ text: 'Cancel', role: 'cancel' },
							{
								text: 'OK',
								handler: data => {
									
									this.deleteCategory(category)
										.then( () => { 
											prompt.dismiss({success: true});
										} );
									return false;
								}
							},
						]
					});
        prompt.present();
        prompt.onWillDismiss((data: any, role: string) => {
            if (data.success) {
                callback();
            }
        });
    }

    getCategory( categoryId: string): Promise<ICatalog> {
        return this.getEntry( categoryId );
    }

    getDetailCategory( categoryId: string): Promise<ICatalog> {
        return Promise.all([ 
                    this.getEntry( categoryId ), 
                    this.itemDataService.getItems( categoryId ) 
                ]).then(
                    vals => {
                        let cat = vals[0];
                        cat.items = vals[1];

                        return Promise.resolve(cat);
                    }
                ).catch( (err) => Promise.reject(err) );
            }

    getCategories(): Promise<ICatalog[]> {
        return this.getEntries();
    }

    addCategory( category: Object ): Promise<any> {
        return this.setEntry( category );
    }

    editCategory( category: ICatalog ): Promise<any> {
        return this.setEntry( category );
    }

    // cascading deletion
    private deleteCategory( category: ICatalog ): Promise<any> {
        return this.itemDataService.deleteItemsByCategory(category)
                    .then( () => this.removeEntry(category) );
    }
}

/*
newCategory(callback?: any): void {
        let prompt = this.alertCtrl.create({
                    title: 'New Catalog',
                    inputs: [ { name: 'name', placeholder: 'Title' } ],
                    buttons: [
                        { text: 'Cancel', role: 'cancel' },
                        {
                            text: 'OK',
                            handler: data => {

                                this.setEntry( { name: data.name } )
                                    .then(
                                        (val) => { 
                                            if (val) {
                                                prompt.dismiss({success: true});
                                            }
                                        }
                                    );

                                return false;
                            }
                        }
                    ]
                });
        prompt.present();
        prompt.onWillDismiss((data: any, role: string) => {
            if (data.success) {
                callback();
            }
        });
    }
*/

/*
    // SQLite

    initTable(): Promise<any> {
        // default categories
        return this.db.executeSql(`
                    CREATE TABLE IF NOT EXISTS 
                        ${this.DEFAULT_TABLE_NAME} (
                            id INTEGER PRIMARY KEY AUTOINCREMENT, 
                            name TEXT
                        )
                `, []);
    }

    getCategory( categoryId: string): Promise<ICatalog> {
        return this.getEntry( this.DEFAULT_TABLE_NAME, categoryId );
    }

    addCategory( category: Object ): Promise<any> {
        return this.addEntry( this.DEFAULT_TABLE_NAME, category);
    }

    editCategory( category: ICatalog ): Promise<any> {
        return this.updateEntry(this.DEFAULT_TABLE_NAME, category);
    }

    deleteCategory( category: ICatalog ): Promise<any> {
        return this.removeEntry(this.DEFAULT_TABLE_NAME, category);
    }

*/