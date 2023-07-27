import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

describe('MapsService', () => {
  let mapsService: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    mapsService = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(mapsService).toBeTruthy();
  });

  describe('test for getCurrentPosition', () => {
    it('should save in the center variable', () => {
      //Arrange
      //callFake Se creará una versión diferente de getCurrentPosition para agregar código falso
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((successFn) => {
        const mockGeolocation = {
          coords: {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            latitude: 12,
            longitude: 40,
            speed: 0,
          },
          timestamp: 0,
        };
        successFn(mockGeolocation);
      });
      //Act
      mapsService.getCurrentPosition();
      //Assert
      expect(mapsService.center.latitude).toEqual(12);
      expect(mapsService.center.longitude).toEqual(40);
    });
  });
});
