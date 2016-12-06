'use strict';

angular.
  module('services.tarifas').
  factory('Tarifas', ['$resource',
    function($resource) {
      return $resource('http://private-fe2a-scuptel.apiary-mock.com/ddd/pricing', {}, {
        query: {
          method: 'GET',
          isArray: false
        }
      });
    }
  ]);
