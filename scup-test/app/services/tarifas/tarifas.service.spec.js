'use strict';

describe('Tarifas', function() {
  var $httpBackend;
  var Tarifas;
  var tarifasPart = {
    "total": 2,
    "data": [
        {
            "origin": "011",
            "destiny": "016",
            "price": "1.90"
        },
        {
            "origin": "016",
            "destiny": "011",
            "price": "2.90"
        }]
    };


  beforeEach(function() {
    jasmine.addCustomEqualityTester(angular.equals);
  });

  beforeEach(module('services.tarifas'),function($provide){
    $provide.value('$log', console);
  });
  beforeEach(inject(function(_$httpBackend_, _Tarifas_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('http://private-fe2a-scuptel.apiary-mock.com/ddd/pricing').respond(tarifasPart);

    Tarifas = _Tarifas_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Pegar dados do link da api', function() {
    var tarifa = Tarifas.query();

    //retorna uma promise
    expect(Promise.resolve(tarifa)).toEqual(tarifa);

    //promise nao resolvida
    expect(tarifa.$resolved).toEqual(false);

    $httpBackend.flush();

    expect(tarifa.$resolved).toEqual(true);
    expect(tarifa).toEqual(tarifasPart);
    //Verificar o $resolved no objeto
    //console.log(tarifa);
  });

});
