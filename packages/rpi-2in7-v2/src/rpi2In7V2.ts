import { ColorMode, DisplayDevice, Monochrome, Orientation } from '@p1p3/epaperjs-core';
import { ImageOptions } from '@p1p3/epaperjs-core/src/image/imageOptions';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi2In7V2 implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;
    constructor(public readonly orientation = Orientation.Horizontal, public readonly colorMode = ColorMode.Black) {
        if (colorMode !== ColorMode.Black) {
            throw new Error('Only black color mode is supported');
        }
        this.driver = bindings('waveshare2in7v2');

        const side1 = 264;
        const side2 = 176;
        this.width = this.orientation === Orientation.Horizontal ? side1 : side2;
        this.height = this.orientation === Orientation.Horizontal ? side2 : side1;
    }

    public connect(): void {
        this.driver.dev_init();
        this.wake();
    }

    public disconnect(): void {
        this.sleep();
        this.driver.dev_exit();
    }

    public wake(): void {
        this.driver.init();
    }

    public clear(): void {
        this.driver.clear();
    }

    public sleep(): void {
        this.driver.sleep();
    }

    public async displayPng(img: Buffer, options?: ImageOptions): Promise<void> {
        const converter = new Monochrome(img);
        const blackBuffer = await converter.toBlack({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Horizontal,
        });
        this.driver.display(blackBuffer);
    }
}