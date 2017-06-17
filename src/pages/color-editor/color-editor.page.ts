import { Component, ViewChild } from '@angular/core';
import { NavParams, Navbar } from 'ionic-angular';

import { CatalogService } from '../../services/catalog.service';
import { CatalogNotificationService } from '../../services/catalog-notification.service';

import { ICatalog } from '../../interfaces/catalog.interface'
import { IColor } from '../../interfaces/color.interface'
import { MD_COLORS } from './material-palette'

@Component({
    selector: 'rme-color-editor',
    templateUrl: 'color-editor.page.html'
})

export class ColorEditorPage {

    private catalog: ICatalog;
    private colors: IColor[];

    private colorIndex: number;

    @ViewChild(Navbar) private navBar: Navbar;

    constructor( 
        private dataService: CatalogService,
        private notificationService: CatalogNotificationService,
        private navParams: NavParams,
    ) {
        let _catalog = this.navParams.get('catalog');
        this.catalog = (_catalog) ? _catalog : {};

        this.colors = MD_COLORS;
        this.colorIndex = 0;
        if (this.catalog.color) {
            this.colorIndex = this.colors.findIndex( 
                                (color) => 
                                    color.value === this.catalog.color.value
                                ) + 1;
        }
    }

    ionViewDidLoad() {
        this.navBar.setBackButtonText('');
    }

    ionViewWillLeave() {

        if (!this.catalog.id)
            return; // do nothing

        let _index = 0;
        if (this.catalog.color)
            _index = this.getColorIndex( this.catalog.color.id);
        
        console.log('color index: %s \norigin index: %s', this.colorIndex, _index);
        
        if (this.colorIndex != _index) {   // value changed

            if (this.colorIndex == 0) { // default color
                delete this.catalog.color;
            } else {    // color from palette
                this.catalog.color = this.colors[ this.colorIndex - 1];
            }

            // update change
            this.dataService.editCategory(this.catalog)
                .then( () => {this.notificationService.notify()} );
        }

    }
    
    onColorChanged( colorId: string) {
        this.colorIndex = this.getColorIndex(colorId);
    }

    private getColorIndex( colorId: string ) {
        let _offset = 1;    // default color
        let _index = this.colors.findIndex( 
                                (color) => 
                                    color.id === colorId
                                );

        return _index + _offset;
    }

}