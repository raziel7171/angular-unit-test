import { Calculator } from "./calculator";

// describe grupo de pruebas
describe('tests for calculator', () => {
    // it describe una pruea
    it('#multiply should return a nine', () => {
        //AAA
        //Arrange (organiza/prepara)
        const calculator = new Calculator();

        //Act (actua ejecuta la función/método)
        const rta = calculator.multiply(3,3);

        //Assert (verifica/asegura el resultado)
        expect(rta).toEqual(9);
    });

    it('#Test multiply: negative and 0', () => {
        //Arrange
        const calculator = new Calculator();

        //Assert
        expect(calculator.multiply(3,0)).toEqual(0);
        expect(calculator.multiply(3,-4)).toBeLessThan(0);
    });

    it('#Test divide: positive, negative and 0', () => {
        //Arrange
        const calculator = new Calculator();

        //Assert
        expect(calculator.divide(15,3)).toEqual(5);
        expect(calculator.divide(15,-3)).toBeLessThan(0);
        expect(calculator.divide(0,3)).toEqual(0);
        expect(calculator.divide(15,0)).toBeNull();
    });

    it('#Test matchers', ()=>{
        let name = 'nombre';
        let name2;

        expect(name).toBeDefined();
        expect(name2).toBeUndefined();

        expect(0+3 === 3).toBeTruthy();
        expect(1+1 === 3).toBeFalsy();

        expect(5).toBeLessThan(10);
        expect(15).toBeGreaterThan(10);

        expect('123456').toMatch(/123/); //regular expression or a string can be compared
        expect(['apples', 'oranges', 'pears']).toContain('oranges');
    });

//     //Comunes
// .toBe();
// .not.toBe();
// .toEqual();

// //Veracidad
// .toBeNull()
// .toBeUndefined()
// .toBeDefined()
// .toBeUndefined()
// .toBeTruthy() 
// .toBeFalsy() 

// //Numeros
// .toBeGreaterThan(3);
// .toBeGreaterThanOrEqual(3.5);
// .toBeLessThan(5);
// .toBeLessThanOrEqual(4.5);

// //Numeros decimales
// expect(0.3).toBeCloseTo(0.3)

// //Strings
// .not.toMatch(/I/);
// .toMatch(/stop/);

// //Arrays
// .toContain('milk');

// //Ecepciones
// myfunction.toThrow(Error);
});