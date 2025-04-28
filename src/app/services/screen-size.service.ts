import { HostListener, Injectable, Signal, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  isSmallScreenSignal = signal<boolean>(false);
  isMediumScreenSignal = signal<boolean>(false);
  screenSize = signal<number>(window.innerWidth);

  constructor() {
    // const size = this.screenSize();
    // if(size <= 400){
    //   this.isSmallScreenSignal.set(true);
    // }else if (size <= 1000) {
    //   this.isSmallScreenSignal.set(true);
    //   this.isMediumScreenSignal.set(true);
    // } else {
    //   this.isMediumScreenSignal.set(false);
    //   this.isSmallScreenSignal.set(false);
    // }
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
    // this.checkScreenSize();
    


    // effect(() => {
    //   if (this.isSmallScreenSignal()) {
    //     console.log('Skärmen är liten');
    //   } else {
    //     console.log('Skärmen är stor');
    //   }
    // });
    // this.checkScreenSize(); 
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMediumScreenSignal.set(window.innerWidth <= 1000);
    this.isSmallScreenSignal.set(window.innerWidth <= 400);
  }
}
