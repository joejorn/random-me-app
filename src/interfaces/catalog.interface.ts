import { ICatalogItem } from './catalog-item.interface';
import { IColor } from './color.interface';


export interface ICatalog {
    id: string;
    name: string;
    color?: IColor;
    items?: ICatalogItem[];
}