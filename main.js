// aha!
// v0.1.0
// 26 Sep 2015

window.addEventListener('load', function () {

	var messages = PUBNUB.$('messages'),
		lastMsg = PUBNUB.$('chat-welcome'),
		input = PUBNUB.$('chat-box'),
		channels = {
			chat: 'aha-chat',
			physics: 'aha-physics'
		};

	Physics(function (world) {
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

		function createCircle(x, y) {
			world.add(Physics.body('circle', {
				x: x, y: y,
				vx: 0, vy: 0,
				radius: 20
			}));
		}

		window.addEventListener('click', function (e) {
			// createCircle(e.clientX, e.clientY);

			PUBNUB.publish({
				channel: channels.physics,
				message: { x: e.clientX, y: e.clientY },
				callback: function (m) {
					// console.log(m);
				}
			});
		});

		PUBNUB.subscribe({
			channel: channels.physics,
			callback: function (pos) {
				createCircle(pos.x, pos.y);
			}
		});

		// ensure objects bounce when edge collision is detected
		world.add(Physics.behavior('body-impulse-response'));

		// add some gravity
		world.add(Physics.behavior('constant-acceleration'));

		// subscribe to ticker to advance the simulation
		Physics.util.ticker.on(function (time, dt) {
			world.step(time);
		});

		// start the ticker
		Physics.util.ticker.start();

	});

	PUBNUB.subscribe({
		channel: channels.chat,
		callback: function (text) {
			msgBox = document.createElement('div');
			msgBox.classList.add('chat-msg');
			msgBox.textContent = (''+text).replace(/[<>]/g, '');
			messages.insertBefore(msgBox, lastMsg);
			lastMsg = msgBox;
		}
	});

	PUBNUB.bind('keyup', input, function (e) {
		if ((e.keyCode || e.charCode) === 13) {
			PUBNUB.publish({
				channel: channels.chat,
				message: input.value,
				x: input.value = ''
			});
		}
	});
});
