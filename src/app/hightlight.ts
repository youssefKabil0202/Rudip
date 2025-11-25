import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[setmycolor]'
})
export class SetmycolorDirective {

  constructor(private element: ElementRef) {
    // Optional: Set initial background color
    element.nativeElement.style.backgroundColor = 'transparent';
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.element.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.element.nativeElement.style.backgroundColor = 'transparent';
  }
}
