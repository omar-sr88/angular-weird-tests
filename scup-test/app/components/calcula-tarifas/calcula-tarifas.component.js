'use strict';

angular.
  module('calculaTarifas').
  component('calculaTarifas', {
    templateUrl: 'components/calcula-tarifas/calcula-tarifas.template.html',
    controller: ['$scope','$uibModal', 'Tarifas','Cidades', function CalculaTarifasController($scope, $uibModal, Tarifas, Cidades) {
      var $ctrl = this;
      $ctrl.origem = '';
      $ctrl.destino = '';
      $ctrl.tempo = '';
      $ctrl.exibir = false;
      $ctrl.valores = [{"plano": "Fale + 30","desconto": 30 ,"valor": []},
                      {"plano": "Fale + 60","desconto": 60, "valor": []},
                      {"plano": "Fale + 120","desconto": 120, "valor": []},
                      {"plano": "Normal","desconto": 0, "valor": []},
        ];

      //Serviços pegando dados
      Tarifas.get().$promise.then(function (data){ $ctrl.tarifas = data.data });
      Cidades.get().$promise.then(function (data){ $ctrl.cidades = data.data });;

      $ctrl.showModalOrigem = function(){
         var modalInstance = $uibModal.open({
            templateUrl: "components/calcula-tarifas/origem-template.html",
            controller: 'ModalInstanceCtrl',
            controllerAs: '$modalCtrl',
            size: 'sm',
            resolve: {
              cidades: function(){
                return $ctrl.cidades.filter(function(cidade){ return cidade.ddd != $ctrl.destino}) ;;
              }
            }
          });

         modalInstance.result.then(function (res) {
            if (res.campo == "origem"){
                $ctrl.origem = res.ddd;
            }
             if (res.campo == "destino"){
                $ctrl.destino = res.ddd;
            }
          }, function (event) {
           console.log('Modal dismissed at: ' + new Date());
          });
      };

      $ctrl.showModalDestino = function(){
         var modalInstance = $uibModal.open({
            templateUrl: "components/calcula-tarifas/destino-template.html",
            controller: 'ModalInstanceCtrl',
            controllerAs: '$modalCtrl',
            size: 'sm',
            resolve: {
              cidades: function(){
                return $ctrl.cidades.filter(function(cidade){ return cidade.ddd != $ctrl.origem}) ;
              }
            }
          });

         modalInstance.result.then(function (res) {
            if (res.campo == "origem"){
                $ctrl.origem = res.ddd;
            }
             if (res.campo == "destino"){
                $ctrl.destino = res.ddd;
              }
            }, function (event) {
           console.log('Modal dismissed at: ' + new Date());
          });
      };


      $ctrl.calcular = function(){

        var rate = $ctrl.tarifas.filter(function(t){
            if(t.origin == $ctrl.origem && t.destiny == $ctrl.destino)
              return t
        });
        if (rate.length == 0){
           $ctrl.exibir = false;
           return false;
        }
        rate = parseFloat(rate[0].price);

        $.each($ctrl.valores,function(i,val){

          var preco;
          if(val.desconto != 0)
            preco = rate*1.1 * ($ctrl.tempo - val.desconto);
          else
            preco = rate * $ctrl.tempo;

          if (preco < 0){
            preco = 0.0;
          } 
          val.valor = preco.toFixed(2).toString().split('.');
        });

        $ctrl.exibir = true;
      }


      $scope.$watchGroup(['$ctrl.origem','$ctrl.destino','$ctrl.tempo'],function(newVals,oldVals,ctrl){

          if($ctrl.origem == '')
            return false;
          if($ctrl.destino == '')
            return false;
          if($ctrl.tempo == '')
            return false;

          $ctrl.calcular();
      });


      //Testar on demand, evitar $watch
      $ctrl.podeCalcular = function(){
          if($ctrl.origem == '')
            return false;
          if($ctrl.destino == '')
            return false;
          if($ctrl.tempo == '')
            return false;

          return true;
      }
  }]
});

angular.module('calculaTarifas').controller('ModalInstanceCtrl', function ($uibModalInstance, cidades) {
  var $ctrl = this;
  $ctrl.cidades = cidades;


  $ctrl.setOrigem = function(ddd) {
    $uibModalInstance.close({"ddd": ddd, "campo": "origem"});
  }

  $ctrl.setDestino = function(ddd) {
    $uibModalInstance.close({"ddd": ddd, "campo": "destino"});
  }


  $ctrl.no = function () {
    $uibModalInstance.close("no");
  };

  $ctrl.yes = function () {
    $uibModalInstance.dismiss('yes');
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});