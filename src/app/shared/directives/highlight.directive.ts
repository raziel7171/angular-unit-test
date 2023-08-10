import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective implements OnChanges {

  defaultColor = 'gray';
  @Input('highlight') bgColor = '';

  constructor(private element: ElementRef) {
    element.nativeElement.style.customProperty = true;
  }

  ngOnChanges(): void {
    this.element.nativeElement.style.backgroundColor =
      this.bgColor || this.defaultColor;
  }
}
