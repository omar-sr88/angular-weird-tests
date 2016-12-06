describe("calculaTarifas", function() {
	var ctrl,scope,modal,modalCtrl;


	var fakeModal = {
   	 	result: {
            then: function (confirmCallback, cancelCallback) {
                //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                this.confirmCallBack = confirmCallback;
                this.cancelCallback = cancelCallback;
            }
        },
        close: function (item) {
            //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
            this.result.confirmCallBack(item);
        },
        dismiss: function (type) {
            //The user clicked cancel on the modal dialog, call the stored cancel callback
            this.result.cancelCallback(type);
        }
    };

	var modalOptions = {
        templateUrl: "calcula-tarifas/destino-template.html",
        controller: 'ModalInstanceCtrl',
        controllerAs: '$modalCtrl',
        size: 'sm',
        resolve: {
          cidades: function(){
            return jasmine.any(Function);
        	}
     	}		
    };

	var actualOptions;

	beforeEach(module('scupTestApp'), function($provide){		
		$provide.value('$log', console);		
	});


	beforeEach(function(){		
		module('scupTestApp');

		inject(function ($controller, _$rootScope_, _$uibModal_,  $componentController) {
                scope = _$rootScope_.$new();                         
                modal = _$uibModal_;

				ctrl = $componentController('calculaTarifas');
				ctrl.$modal = modal;


                spyOn(modal, 'open').and.callFake(function(options){
                    actualOptions = options;
                    return fakeModal;
                });
            });

				ctrl.tarifas = [ 
		{
            "origin": "011",
            "destiny": "016",
            "price": "1.90"
        },
        {
            "origin": "016",
            "destiny": "011",
            "price": "2.90"
        },
        {
            "origin": "011",
            "destiny": "017",
            "price": "1.70"
        },
        {
            "origin": "017",
            "destiny": "011",
            "price": "2.70"
        },
        {
            "origin": "011",
            "destiny": "018",
            "price": "0.90"
        },
        {
            "origin": "018",
            "destiny": "011",
            "price": "1.90"
        }];
	});

			


	 it('Testa valores iniciais do controller', function() {

      expect(ctrl.origem).toBe('');
      expect(ctrl.exibir).toBe(false);
      expect(ctrl.valores.length).toBe(4);
	});

	it('Testa func pode calcular com valores iniciais', function() {

      expect(ctrl.podeCalcular()).toBe(false);

	});

	it('Testa func pode calcular com valores iniciais setados', function() {
		ctrl.origem = '11';
		ctrl.destino = '18';
		ctrl.tempo = '50';
     	expect(ctrl.podeCalcular()).toBe(true);
	});


	it('Testa calcular funcao c valores validos', function() {
		ctrl.origem = '018';
		ctrl.destino = '011';
		ctrl.tempo = '200'; // 


        ctrl.calcular();
     	expect(ctrl.valores[2].valor.join('.')).toBe("167.20");

	});

	it('Testa calcular funcao c valores invalidos', function() {
		ctrl.origem = '018';
		ctrl.destino = '017';
		ctrl.tempo = '200'; // 

        ctrl.calcular();
        expect(ctrl.exibir).toBe(false);
        //nao calculou a 1a vez, logo não setou a varivel. 
        //Com calculos sequenciais as ctrl.valores vai manter o ultimo calculo valido, mas nao exibira
     	expect(ctrl.valores[2].valor.join('.')).toBe("");
     	
     	ctrl.calcular();
	});

		it('Testa calcular funcao c valores invalidos apos validos', function() {
		ctrl.origem = '018';
		ctrl.destino = '011';
		ctrl.tempo = '200'; // 


        ctrl.calcular();
        expect(ctrl.exibir).toBe(true);
     	expect(ctrl.valores[2].valor.join('.')).toBe("167.20");

     	ctrl.origem = '018';
		ctrl.destino = '017';
		ctrl.tempo = '200'; //
		ctrl.calcular();
		//novo calculo eh invalido, apenas exibicao muda, array de valores se mante, logo o ultimo teste passa
		expect(ctrl.exibir).toBe(false);
		expect(ctrl.valores[2].valor.join('.')).toBe("167.20");
     	
	});

	it('Testa modal', function() {
	  ctrl.cidades = [
	        {
	             "ddd": "011",
	            "city": "Sao Paulo"
	        },
	        {
	            "ddd": "016",
	            "city": "Ribeirao Preto"
	        }
	        ];
    	ctrl.showModalDestino();
		expect(ctrl.$modal.open).toHaveBeenCalledWith(actualOptions);
		expect(actualOptions.resolve.cidades()).toEqual(ctrl.cidades);
	});


});
