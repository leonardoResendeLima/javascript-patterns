(function (win, $) {
	///////////////////// Circle /////////////////////

	function Circle() {
		this.item = $('<div class="circle"></div>');
	}

	Circle.prototype.color = function (clr) {
		this.item.css('background', clr);
	}

	Circle.prototype.move = function (left, top) {
		this.item.css('left', left);
		this.item.css('top', top);
	}

	Circle.prototype.get = function () {
		return this.item;
	}

	///////////////////// Rectangle /////////////////////

	function clone(src, out) {
		for (var attr in src.prototype) {
			out.prototype[attr] = src.prototype[attr];
		}
	}
	clone(Circle, Rect);

	function Rect() {
		this.item = $('<div class="rect"></div>');
	}

	///////////////////// Red Circle /////////////////////

	function RedCircleBuilder() {
		this.item = new Circle();
		this.init();
	}

	RedCircleBuilder.prototype.init = function () {
	}

	RedCircleBuilder.prototype.get = function () {
		return this.item;
	}

	///////////////////// Blue Circle /////////////////////

	function BlueCircleBuilder() {
		this.item = new Circle();
		this.init();
	}

	BlueCircleBuilder.prototype.init = function () {
		this.item.color("blue");

		var rect = new Rect();
		rect.color("yellow");
		rect.move(40, 40);

		this.item.get().append(rect.get());
	}

	BlueCircleBuilder.prototype.get = function () {
		return this.item;
	}

	///////////////////// Circle Factory /////////////////////

	var ShapeFactory = function () {
		this.types = {};

		this.create = function (type) {
			return new this.types[type]().get();
		}
		this.register = function (type, cls) {
			if (cls.prototype.init && cls.prototype.get) {
				this.types[type] = cls;
			}
		}
	};

	///////////////////// Stage Adaptor /////////////////////

	function StageAdaptor(id) {
		this.index = 0;
		this.context = $(id);
	}

	StageAdaptor.prototype.SIG = "stageItem_";
	StageAdaptor.prototype.add = function (item) {
		++this.index;
		item.addClass(this.SIG + this.index);
		this.context.append(item);
	}
	StageAdaptor.prototype.remove = function (index) {
		this.context.remove('.' + this.SIG + index);
	}

	///////////////////// Circle Generator Singleton /////////////////////

	var CircleGeneratorSingleton = (function () {
		var instance;

		function init() {
			var _aCircle = [];
			var _stage;
			var _sf = new ShapeFactory();

			function _position(circle, left, top) {
				circle.css('left', left);
				circle.css('top', top);
			}

			function create(left, top, color) {
				var circle = _sf.create(color);
				circle.move(left, top);
				return circle;
			}

			function registerShape(name, cls) {
				_sf.register(name, cls);
			}

			function setStage(stage) {
				_stage = stage;
			}

			function add(circle) {
				_stage.add(circle.get());
				_aCircle.push(circle);
			}

			function index() {
				return _aCircle.length();
			}

			return {
				index: index,
				create: create,
				add: add,
				register: registerShape,
				setStage: setStage
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
		var cg = CircleGeneratorSingleton.getInstance();
		cg.register("blue", BlueCircleBuilder);
		cg.register("red", RedCircleBuilder);
		cg.setStage(new StageAdaptor('.advert'));

		$('.advert').click(function (e) {
			var circle = cg.create(
				e.pageX - 25,
				e.pageY - 25,
				'red');

			cg.add(circle);
		});
		$(document).keypress(function (e) {
			if (e.key === 'a') {
				var cg = CircleGeneratorSingleton.getInstance();
				var circle = cg.create(
					Math.floor(Math.random() * 600),
					Math.floor(Math.random() * 600),
					'blue'
				);
				cg.add(circle);
			}
		});
	});
})(window, jQuery);