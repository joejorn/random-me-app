import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ICategory } from '../interfaces/category.interface';
import { CategoryDataService } from './category-data.service';

@Injectable()
export class CategoryNotifyService {

    private categoriesSubject: BehaviorSubject<ICategory[]>;

    public categoryAnnounced$: Observable<ICategory[]>;

    constructor( private dataService: CategoryDataService ) {
        this.categoriesSubject = new BehaviorSubject<ICategory[]>([]);
        this.syncDB();
        
        this.categoryAnnounced$ = this.categoriesSubject.asObservable();
    }

    // trigger sync()
    public notify(): void {
        console.log('notify()');
        this.syncDB();
    }

    private syncDB(): void {
        this.dataService.getCategories()
            .then(
                (vals: ICategory[]) => {
                    if (vals) {

                        // sort by id
                        vals.sort(
                            (catA: ICategory, catB: ICategory) => {
                                let valA = catA.name;
                                let valB = catB.name;

                                let pos = 0;
                                if (valA < valB) 
                                    pos = -1;
                                else if (valA > valB) 
                                    pos = 1;

                                return pos;
                            }
                        )
                        this.categoriesSubject.next(vals);
                    }
                }
            )
    }
}