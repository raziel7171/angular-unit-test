import { DebugElement, Type } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { throwError } from "rxjs";

export function query<T>(fixture: ComponentFixture<T>, selector: string): DebugElement {
    const debugElement: DebugElement = fixture.debugElement.query(By.css(selector));
    if (!debugElement) {
        throw new Error(`query: Element with selector ${selector} not found`);
    }
    return debugElement
}

export function queryByTestId<T>(fixture: ComponentFixture<T>, testId: string): DebugElement {
    const selector = `[data-test-id="${testId}"]`;
    return query(fixture, selector);
}

export function queryAll<T>(fixture: ComponentFixture<T>, selector: string): DebugElement[] {
    const debugElements: DebugElement[] = fixture.debugElement.queryAll(By.css(selector));
    if (!debugElements || debugElements.length == 0) {
        throw new Error(`queryAll: Elements with selector ${selector} not found`);
    }
    return debugElements
}

export function queryByDirective<T, D>(fixture: ComponentFixture<T>, directive: Type<D>): DebugElement {
    const debugElement: DebugElement = fixture.debugElement.query(By.directive(directive));
    if (!debugElement) {
        throw new Error(`queryByDirective: Element with selector ${directive} not found`);
    }
    return debugElement
}

export function queryAllByDirective<T, D>(fixture: ComponentFixture<T>, directive: Type<D>): DebugElement[] {
    const debugElement: DebugElement[] = fixture.debugElement.queryAll(By.directive(directive));
    if (!debugElement) {
        throw new Error(`queryAllByDirective: Element with selector ${directive} not found`);
    }
    return debugElement
}

export function getText<T>(fixture: ComponentFixture<T>, selector: string) {
    const debugElement: DebugElement = query(fixture, selector);
    const element: HTMLElement = debugElement.nativeElement;
    return element.textContent;
}

export function getTextByTestId<T>(fixture: ComponentFixture<T>, testId: string) {
    const selector = `[data-test-id="${testId}"]`;
    const debugElement: DebugElement = query(fixture, selector);
    const element: HTMLElement = debugElement.nativeElement;
    return element.textContent;
}