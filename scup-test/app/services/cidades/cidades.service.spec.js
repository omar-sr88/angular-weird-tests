'use strict';

//Mesmo teste para cidades e Cidades
describe('Cidades', function() {
  var $httpBackend;
  var Cidades;
  var CidadesPart = {
    "total": 2,
    "data": [
        {
             "ddd": "011",
            "city": "Sao Paulo"
        },
        {
            "ddd": "016",
            "city": "Ribeirao Preto"
        }
        ]
    };


  beforeEach(function() {
    jasmine.addCustomEqualityTester(angular.equals);
  });

  beforeEach(module('services.cidades'),function($provide){
    $provide.value('$log', console);
  });
  beforeEach(inject(function(_$httpBackend_, _Cidades_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('http://private-fe2a-scuptel.apiary-mock.com/ddd/details').respond(CidadesPart);

    Cidades = _Cidades_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Pegar dados do link da api', function() {
    var cidades = Cidades.query();

    //retorna uma promise
    expect(Promise.resolve(cidades)).toEqual(cidades);

    //promise nao resolvida
    expect(cidades.$resolved).toEqual(false);

    $httpBackend.flush();

    expect(cidades.$resolved).toEqual(true);
    expect(cidades).toEqual(CidadesPart);
    //Verificar o $resolved no objeto
    //console.log(cidades);
  });

});
