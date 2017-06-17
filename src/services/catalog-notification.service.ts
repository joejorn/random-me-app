import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ICatalog } from '../interfaces/catalog.interface';
import { CatalogService } from './catalog.service';

@Injectable()
export class CatalogNotificationService {

    private categoriesSubject: BehaviorSubject<ICatalog[]>;

    public categoryAnnounced$: Observable<ICatalog[]>;

    constructor( private dataService: CatalogService ) {
        this.categoriesSubject = new BehaviorSubject<ICatalog[]>([]);
        this.syncDB();
        
        this.categoryAnnounced$ = this.categoriesSubject.asObservable();
    }

    // trigger sync()
    public notify(): void {
        // console.log('notify()');
        this.syncDB();
    }

    private syncDB(): void {
        this.dataService.getCategories()
            .then(
                (vals: ICatalog[]) => {
                    if (vals) {

                        // sort by id
                        vals.sort(
                            (catA: ICatalog, catB: ICatalog) => {
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