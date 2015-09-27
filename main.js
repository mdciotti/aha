// aha!
// v0.1.0
// 26 Sep 2015

window.addEventListener('load', function () {
	window.Physics = Physics;
	Physics(function(world){
		window.world = world;

		var viewWidth = window.innerWidth;
		var viewHeight = window.innerHeight;

		var renderer = Physics.renderer('canvas', {
			el: 'viewport',
			width: viewWidth,
			height: viewHeight,
			meta: false,
			styles: {
				'circle' : {
					strokeStyle: '#351024',
					lineWidth: 2,
					fillStyle: '#d33682',
					angleIndicator: '#351024'
				}
			}
		});

		world.add(renderer);
		world.on('step', function () {
			world.render();
		});

		// bounds of the window
		var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);

		// constrain objects to these bounds
		world.add(Physics.behavior('edge-collision-detection', {
			aabb: viewportBounds,
			restitution: 0.99,
			cof: 0.99
		}));

		window.addEventListener('click', function (e) {
			// add a circle
			world.add(
				Physics.body('circle', {
					x: e.clientX, // x-coordinate
					y: e.clientY, // y-coordinate
					vx: 0, // velocity in x-direction
					vy: 0, // velocity in y-direction
					radius: 20
				})
			);
		});

		// ensure objects bounce when edge collision is detected
		world.add(Physics.behavior('body-impulse-response'));

		// add some gravity
		world.add(Physics.behavior('constant-acceleration'));

		// subscribe to ticker to advance the simulation
		Physics.util.ticker.on(function(time, dt){
			world.step(time);
		});

		// start the ticker
		Physics.util.ticker.start();

	});

	var messages = PUBNUB.$('messages'),
		input = PUBNUB.$('chat-box'),
		channel = 'hello';

	PUBNUB.subscribe({
		channel: channel,
		callback: function (text) {
			var msgBox = document.createElement('div');
			msgBox.textContent = (''+text).replace(/[<>]/g, '');
			messages.appendChild(msgBox);
		}
	});

	PUBNUB.bind('keyup', input, function (e) {
		if ((e.keyCode || e.charCode) === 13) {
			PUBNUB.publish({
				channel: channel,
				message: input.value,
				x: input.value = ''
			});
		}
	});
});
