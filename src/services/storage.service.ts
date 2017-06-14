import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageService {

    public namespace: string;   // namespace
    protected _counterKey: string;
    protected _counter: number; // auto-increment entry ID

    // private _buffer: any[]; // cache

    constructor( protected storage: Storage) {
        // _buffer = [];
    }

    prepareStorage(): Promise<any> {
        return this.initStore();
    }

    private initStore(): Promise<any> {
        if (this.namespace) {
            this._counterKey = '_counter_' + this.namespace;
            return this.storage.get(this._counterKey)
                        .then(
                            (val) => {
                                this._counter = (val) ? val : 0;
                                return Promise.resolve(this._counter);
                            }
                        )  
        }

        return Promise.resolve(null);
    }

    protected setEntry( params: Object): Promise<any> {

        if (params) {
            let bool = false;   // update counter
            let key = params['id'];
            if (!key) { // new object
                key = [ this.namespace, ++this._counter].join('_');
                params['id'] = key;
                bool = true;
            }
            
            let tx = [ this.storage.set( key, params ) ];
            if (bool) {
                tx.push( this.storage.set( this._counterKey, this._counter) );
            }
            
            return Promise.all(tx).then( (vals) => Promise.resolve(vals[0]) );
        }
        
        return Promise.resolve(null);
    }

    protected removeEntry( entry: Object): Promise<any> {
        if (entry.hasOwnProperty('id'))
            return this.storage.remove(entry['id']);

        return Promise.resolve(null);
    }

    protected removeComparedEntry( compareFn: any ): Promise<any> {
        let _buffer = [];

        return this.storage.forEach(
                    (value: any, key: string) => {
                        if (compareFn && compareFn(value)) {
                            _buffer.push(value);
                        }
                    }
                ).then(
                    () => {
                        // delete-iteration
                        if (_buffer.length > 0) {
                            return Promise.all( _buffer.map( entry => this.removeEntry(entry) ) )
                        }

                        return Promise.resolve(null);
                    }
                ).catch( (err) => { console.log('Error: ', err) } );

    }

    protected getEntry( entryId: string ): Promise<any> {
        return this.storage.get(entryId);
    }

    protected getEntries(refProp?:string, refVal?: string): Promise<any[]> {
        
        let parentCheck = refProp && refVal;
        let _buffer = [];

        return this.storage.forEach( 
                    (value: any, key: string) => {
                        if ( key.startsWith(this.namespace) ) {
                            
                            if ( parentCheck && value[refProp] !== refVal )
                                return  // skip this

                            _buffer.push(value);
                        }
                    }
                ).then( 
                    () => Promise.resolve(_buffer) 
                ).catch( (err) => { 
                    console.log('Error on iterating storage.\n', err); 
                } );
    }

}