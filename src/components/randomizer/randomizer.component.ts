import { Component, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { ICategoryItem } from '../../interfaces/category-item.interface';

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
    
    public playing: boolean;
    @Input() public activeIndex: number;
    @Input() public items: ICategoryItem[];
    @Output() public currentItem: EventEmitter<ICategoryItem>;

    private _timer: any;

    constructor() {
        this.activeIndex = 0;
        this.items = [];

        this.currentItem = new EventEmitter();
    }

    ngOnChanges( changes: SimpleChanges ) {
        if (changes['items'] && !changes.items.firstChange) {
            this.activeIndex = 0;   // reset the start index
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