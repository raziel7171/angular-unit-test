export class Calculator {
    multiply(a: number, b: number) {
        return a * b;
    }

    divide(a: number, b: number) {
        return b != 0 ? a / b : null;
    }
}