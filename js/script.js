(function (win, $) {

	function RedCircle() { }

	RedCircle.prototype.create = function () {
		this.item = $('<div class="circle"></div>');
		return this;
	}

	function BlueCircle() { }

	BlueCircle.prototype.create = function () {
		this.item = $('<div class="circle" style="background:blue"></div>');
		return this;
	}

	var CircleFactory = function () {
		this.types = {};

		this.create = function (type) {
			return new this.types[type]().create();
		}

		this.register = function (type, cls) {
			if (cls.prototype.create) {
				this.types[type] = cls;
			}
		}
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
			var _cf = new CircleFactory();
			_cf.register("blue", BlueCircle);
			_cf.register("red", RedCircle);


			// Private - Função de criação de posição
			function _position(circle, left, top) {
				circle.css('left', left);
				circle.css('top', top);
			}

			// Função de criação de título 
			function create(left, top, color) {
				var circle = _cf.create(color).item;
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