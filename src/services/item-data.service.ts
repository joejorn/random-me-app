import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'

import { StorageService  } from './storage.service';
import { ICategoryItem } from '../interfaces/category-item.interface';

@Injectable()
export class ItemDataService extends StorageService {

    public DEFAULT_TABLE_NAME: string = 'category_item';

    constructor( protected storage: Storage ) {
        super(storage);

        this.namespace = this.DEFAULT_TABLE_NAME;
        this.prepareStorage();
    }

    getItem( itemId: string): Promise<ICategoryItem> {
        return this.getEntry( itemId );
    }

    getItems( categoryId: string): Promise<ICategoryItem[]> {
        return this.getEntries( 'categoryId', categoryId);
    }

    addItem( item: Object ): Promise<any> {
        return this.setEntry( item );
    }

    editItem( item: ICategoryItem ): Promise<any> {
        return this.setEntry( item );
    }

    deleteItem( item: ICategoryItem ): Promise<any> {
        return this.removeEntry( item );
    }

    // filterParams should contain 'id'-property
    deleteItemsByCategory( category: any) {
        return this.removeComparedEntry( (val: ICategoryItem) => {
                    let bool = (category) ? val.categoryId === category.id : false;
                    return bool;
                });
    } 

}