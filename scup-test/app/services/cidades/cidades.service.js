'use strict';

angular.
  module('services.cidades').
  factory('Cidades', ['$resource',
    function($resource) {
      return $resource('http://private-fe2a-scuptel.apiary-mock.com/ddd/details', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      });
    }
  ]);
