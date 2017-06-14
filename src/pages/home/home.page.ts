import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';

import { CategoryNotifyService } from '../../services/category-notify.service';
import { ICategory } from '../../interfaces/category.interface';

import { PlayPage } from '../play/play.page';

@Component({
    selector: 'rme-home',
    templateUrl: 'home.page.html'
})

export class HomePage {
    
    // categories: ICategory[];
    categories: Observable<ICategory[]>;

    constructor( 
        private notifyService: CategoryNotifyService,
        private navCtrl: NavController
    ){
        this.categories = this.notifyService.categoryAnnounced$;
    }

    onItemSelected(category: ICategory): void {
        this.navCtrl.push(PlayPage, { category: category } );
    }
}