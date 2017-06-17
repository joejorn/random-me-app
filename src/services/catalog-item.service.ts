import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'

import { StorageService  } from './storage.service';
import { ICatalogItem } from '../interfaces/catalog-item.interface';

@Injectable()
export class CatalogItemService extends StorageService {

    public DEFAULT_TABLE_NAME: string = 'category_item';

    constructor( protected storage: Storage ) {
        super(storage);

        this.namespace = this.DEFAULT_TABLE_NAME;
        this.prepareStorage();
    }

    getItem( itemId: string): Promise<ICatalogItem> {
        return this.getEntry( itemId );
    }

    // Ionic's storage get items by modification timestamp
    // -> Sort func is required to keep them in original order
    getItems( categoryId: string): Promise<ICatalogItem[]> {
        return this.getEntries( 'categoryId', categoryId)
                    .then(
                        (vals: ICatalogItem[]) => {
                            let sorted = vals.sort(
                                (a, b) => {
                                    let valA = a.id;
                                    let valB = b.id;
                                    let pos = 0;
                                    if (valA < valB) pos = -1;
                                    else if (valA > valB) pos = 1; 
                                    return pos;
                                }
                            );
                            return Promise.resolve(sorted);
                        }
                    ).catch( err => Promise.reject(err) );
    }

    addItem( item: Object ): Promise<any> {
        return this.setEntry( item );
    }

    editItem( item: ICatalogItem ): Promise<any> {
        return this.setEntry( item );
    }

    deleteItem( item: ICatalogItem ): Promise<any> {
        return this.removeEntry( item );
    }

    // filterParams should contain 'id'-property
    deleteItemsByCategory( category: any) {
        return this.removeComparedEntry( (val: ICatalogItem) => {
                    let bool = (category) ? val.categoryId === category.id : false;
                    return bool;
                });
    } 

}