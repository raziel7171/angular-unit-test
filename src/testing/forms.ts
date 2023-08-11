import { ComponentFixture } from "@angular/core/testing";
import { query, queryByTestId } from "./finders";
import { DebugElement } from "@angular/core";

export function setInputValue<T>(fixture: ComponentFixture<T>, selector: string, valueToInsert: string, withTestId: boolean = false) {
    let inputDebug: DebugElement;
    if (withTestId) {
        inputDebug = queryByTestId(fixture, selector);
    } else {
        inputDebug = query(fixture, selector);
    }
    const inputElement: HTMLInputElement = inputDebug.nativeElement;

    inputElement.value = valueToInsert;
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));
}

export function setInputChecker<T>(fixture: ComponentFixture<T>, selector: string, newValue: boolean, withTestId: boolean = false) {
    let inputDebug: DebugElement;
    if (withTestId) {
        inputDebug = queryByTestId(fixture, selector);
    } else {
        inputDebug = query(fixture, selector);
    }
    const inputElement: HTMLInputElement = inputDebug.nativeElement;

    inputElement.checked = newValue;
    inputElement.dispatchEvent(new Event('change'));
    inputElement.dispatchEvent(new Event('blur'));
}