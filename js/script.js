(function (win, $) {
	var RedCircle = function () {
		this.item = $('<div class="circle"></div>');
	};

	var BlueCircle = function () {
		this.item = $('<div class="circle" style="background:blue"></div>');
	};

	var CircleFactory = function () {
		this.create = function (color) {
			if (color === 'blue') {
				return new BlueCircle();
			} else {
				return new RedCircle();
			}
		};
	};

	var CircleGeneratorSingleton = (function () {
		// Instância Padrão
		var instance;
		// Função de inicialização
		function init() {
			// Array Privado com todos os circles
			var _aCircle = [];
			// Área de staging
			var _stage = $(".advert");
			var cf = new CircleFactory();

			// Private - Função de criação de posição
			function _position(circle, left, top) {
				circle.css('left', left);
				circle.css('top', top);
			}

			// Função de criação de título 
			function create(left, top, color) {
				var circle = cf.create(color).item;
				_position(circle, left, top);
				return circle;
			}

			// Função de append a área de stage e incrementação de array
			function append(circle) {
				_stage.append(circle);
				_aCircle.push(circle);
			}

			// Função que retorna o indice da inserção do 
			function index() {
				return _aCircle.length();
			}

			return {
				index: index,
				create: create,
				append: append
			};
		}

		return {
			// Único método exposto que verifica se o método foi instanciado 
			getInstance: function () {
				if (!instance) {
					instance = init();
				}
				return instance;
			}
		};
	})();

	$(win.document).ready(function () {
		$('.advert').click(function (e) {
			// Recuperando a instância do Singleton
			// Com a instancia definida e o objeto retornado 
			// init() com os métodos return index, create e append definidos
			var cg = CircleGeneratorSingleton.getInstance();
			
			var circle = cg.create(
				e.pageX - 25,
				e.pageY - 25,
				'red');

			cg.append(circle);
		});
		$(document).keypress(function (e) {
			if (e.key === 'a') {
				var cg = CircleGeneratorSingleton.getInstance();
				var circle = cg.create(
					Math.floor(Math.random() * 600),
					Math.floor(Math.random() * 600),
					'blue'
				);
				cg.append(circle);
			}
		});
	});
})(window, jQuery);