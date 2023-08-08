import { Person } from "./person.model";

describe('test for person model', () => {
    let person: Person;
    beforeEach(() => {
        person = new Person('Jhon', 'Doe', 30, 75, 1.80);
    });

    it('should assign the attributes', () => {
        expect(person.name).toEqual('Jhon');
        expect(person.lastName).toEqual('Doe');
        expect(person.age).toEqual(30);
        expect(person.weight).toEqual(75);
        expect(person.height).toEqual(1.80);
    })

    describe('tests for calcIMC', () => {
        it('should return "not found" when imc isnt numeric or its less than 0', () => {
            //Arrange
            person.weight = -40
            person.height = -1
            //Act
            const personStatus = person.calcIMC();
            //Assert
            expect(personStatus).toEqual('not found')
        });
        it('should return string: down', () => {
            //Arrange
            person.weight = 40
            person.height = 1.70
            //Act
            const personStatus = person.calcIMC();
            //Assert
            expect(personStatus).toEqual('down')
        });
        it('should return string: normal', () => {
            //Arrange
            person.weight = 70
            person.height = 1.70
            //Act
            const personStatus = person.calcIMC();
            //Assert
            expect(personStatus).toEqual('normal')
        });
        it('should return string: overweight', () => {
            //Arrange
            person.weight = 74
            person.height = 1.70
            //Act
            const personStatus = person.calcIMC();
            //Assert
            expect(personStatus).toEqual('overweight')
        });
        it('should return string: overweight level 1', () => {
            //Arrange
            person.weight = 85
            person.height = 1.70
            //Act
            const personStatus = person.calcIMC();
            //Assert
            expect(personStatus).toEqual('overweight level 1')
        });
        it('should return string: overweight level 2', () => {
            //Arrange
            person.weight = 110
            person.height = 1.70
            //Act
            const personStatus = person.calcIMC();
            //Assert
            expect(personStatus).toEqual('overweight level 2')
        });
        it('should return string: overweight level 3', () => {
            //Arrange
            person.weight = 150
            person.height = 1.70
            //Act
            const personStatus = person.calcIMC();
            //Assert
            expect(personStatus).toEqual('overweight level 3')
        });
    });

});