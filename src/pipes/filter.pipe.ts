import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'noIgnoreItem'})
export class NoIgnorePipe implements PipeTransform {

    transform( values: any[], maxItem: number ): any[] {
        let _max = ( isNaN(Number(maxItem)) && maxItem > 0) ? maxItem : values.length;
        let counter = 0;
        let filtered = values.filter( val => {
            let bool = true;
            
            if (val['ignore'] && counter<_max) {
                bool = false;
            } else {
                counter++;
            }

            return bool;
        } );
        return filtered
    }
}