import { Component, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { ICatalogItem } from '../../interfaces/catalog-item.interface';

@Component({
    selector: 'rme-randomizer',
    templateUrl: 'randomizer.component.html',
    styles: [
        ':host { display: block; }'
    ]
})

export class RandomizerComponent implements OnDestroy, OnChanges {

    // constant
    private TIME_INTERVAL: number = 3500;
    private MIN_ITERATIONS: number = 30;
    
    private _timer: any;
    public playing: boolean;

    @Input() playable: boolean;
    @Input() activeIndex: number;
    @Input() items: ICatalogItem[];
    @Output() currentItem: EventEmitter<ICatalogItem>;


    constructor() {
        this.activeIndex = 0;
        this.items = [];
        // this.playable = false;
        this.currentItem = new EventEmitter();
    }

    ngOnChanges( changes: SimpleChanges ) {
        if (changes['items']) {
            if (!changes.items.firstChange) {
                this.activeIndex = 0;   // reset the start index
            } else if (this.playable !== undefined || this.playable !== null) {
                this.playable = changes['items'].currentValue.length > 0;
            }
        }
    }

    ngOnDestroy() {
        if (this.playing) {
            this.stop();
        }
    }

    public togglePlay(e: Event) {
        if (!this.playing) {
            this.play();
        } else {
            this.stop();
        }

        if (e) 
            e.stopPropagation();
    }

    public play(): void {

        if (!this.items || this.items.length < 2) {
            return; // nothing to do
        }

        this.playing = true;
        this.randomize();
    }

    public stop(): void {
        if (this.playing) {
            if (this._timer) 
                clearInterval(this._timer);
            this.playing = false;
        }
    }

    private randomize(): void {

        // random iteration number
        let iter = this.items.length;
        while (iter < this.MIN_ITERATIONS) {
            iter += (this.items.length * Math.random()) + (Math.random()*10);
        }

        this.timerFn(0, iter, 0, () => { this.playing = false; });
    }

    private timerFn(iter: number, maxIter: number, currentTime: number = 0, callback?:any): void {
        let nextTime = this.easeInQuad(iter, 0, this.TIME_INTERVAL, maxIter);
        let duration = nextTime - currentTime;

        // update content
        this.activeIndex = iter % this.items.length;

        iter++;
        if (iter <= maxIter) {
            this._timer = setTimeout( 
                                ()=> { 
                                    this.timerFn(iter, maxIter, nextTime, callback);
                                }, duration
                            );

        } else if (callback) {
            setTimeout( 
                    ()=> { 
                        callback();
                    }, 350
                );
        }
    }

    private easeInQuad (currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * ( currentIteration/=totalIterations)* currentIteration + startValue;
	}

}