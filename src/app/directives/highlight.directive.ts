import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective implements OnChanges {

  defaultColor = 'gray';
  @Input('highlight') bgColor = '';

  constructor(private element: ElementRef) { this.element.nativeElement.style.backgroundColor = this.defaultColor }

  ngOnChanges(): void {
    this.element.nativeElement.style.backgroundColor = this.bgColor || this.defaultColor
  }

}
