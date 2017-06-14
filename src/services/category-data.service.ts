import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'

import { StorageService  } from './storage.service';
import { ItemDataService } from './item-data.service';
import { ICategory } from '../interfaces/category.interface';

@Injectable()
export class CategoryDataService extends StorageService {

    public DEFAULT_TABLE_NAME: string = 'categories';

    constructor( 
        protected storage: Storage,
        private itemDataService: ItemDataService
    ) {
        super(storage);

        this.namespace = this.DEFAULT_TABLE_NAME;
        this.prepareStorage();
    }

    getCategory( categoryId: string): Promise<ICategory> {
        return this.getEntry( categoryId );
    }

    getCategories(): Promise<ICategory[]> {
        return this.getEntries();
    }

    addCategory( category: Object ): Promise<any> {
        return this.setEntry( category );
    }

    editCategory( category: ICategory ): Promise<any> {
        return this.setEntry( category );
    }

    // cascading deletion
    deleteCategory( category: ICategory ): Promise<any> {
        return this.itemDataService.deleteItemsByCategory(category)
                    .then( () => this.removeEntry(category) );
    }
}


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

    getCategory( categoryId: string): Promise<ICategory> {
        return this.getEntry( this.DEFAULT_TABLE_NAME, categoryId );
    }

    addCategory( category: Object ): Promise<any> {
        return this.addEntry( this.DEFAULT_TABLE_NAME, category);
    }

    editCategory( category: ICategory ): Promise<any> {
        return this.updateEntry(this.DEFAULT_TABLE_NAME, category);
    }

    deleteCategory( category: ICategory ): Promise<any> {
        return this.removeEntry(this.DEFAULT_TABLE_NAME, category);
    }

*/