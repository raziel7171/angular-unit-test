import { ComponentFixture } from "@angular/core/testing";
import { query, queryByTestId } from "./finders";
import { DebugElement } from "@angular/core";

export function clickEvent<T>(fixture: ComponentFixture<T>, selector: string, withTestId: boolean = false, event: unknown = null): void {
    let elementDebug: DebugElement;
    if (withTestId) {
        elementDebug = queryByTestId(fixture, selector);
    } else {
        elementDebug = query(fixture, selector);
    }
    elementDebug.triggerEventHandler('click', event);
}

export function clickToElement<T>(fixture: ComponentFixture<T>, selector: string, withTestId: boolean = false): void {
    let elementDebug: DebugElement;
    if (withTestId) {
        elementDebug = queryByTestId(fixture, selector);
    } else {
        elementDebug = query(fixture, selector);
    }

    const element: HTMLElement = elementDebug.nativeElement;
    element.click();
}