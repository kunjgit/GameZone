/**
 * Displays a custom popup
 * @param {object}	args:
 * args = {
 *     type: 'text' || 'html',
 *     content: 'string'
 *     buttons: [{
 *         text: 'string',
 *         callback: function
 *     }],
 *     background: CSS
 *     style: {
 *     	    CSS
 *     }
 * }
 */
function Popup (args) {
	if (args.type == undefined)
		throw new Error('Missing property "type" in argument object');
	if (args.content == undefined)
		throw new Error('Missing property "content" in argument object');

	var that = this;

	// We create the popup container (background)
	this.container = document.createElement('div');
	this.container.className = 'popup';
	this.container.style.position = 'absolute';
	this.container.style.width = '100%';
	this.container.style.height = '100%';
	this.container.style.top = window.pageYOffset + 'px';
	this.container.style.left = 0;
	this.container.style.zIndex = '1000';
	this.container.style.textAlign = 'center';
	this.container.style.backgroundColor = args.background || 'rgba(255,255,255,0.1)';

	// We create the popup box itself
	var box = document.createElement('div');
	box.style.position = 'absolute';
	box.style.border = '1px solid #666';
	box.style.background = '#FFFFFF';
	box.style.width = '400px';
	box.style.height = '150px';
	box.style.boxShadow = '2px 2px 5px #333';
	box.style.margin = 'auto';
	box.style.paddingTop = '5px';
	box.style.top = '50%';
	box.style.left = '50%';

	window.onscroll = function() {
		that.container.style.top = window.pageYOffset + 'px';
	}

	// If style properties were passed, we set the popup CSS with them
	if (args.style != undefined && args.style != null) {
		box.style = args.style;
		box.style.border = args.style.border || box.style.border;
		box.style.background = args.style.background || box.style.background;
		box.style.width = args.style.width || box.style.width;
		box.style.height = args.style.height || box.style.height;
		box.style.paddingTop = args.style.paddingTop || box.style.paddingTop;
		box.style.top = args.style.top || box.style.top;
		box.style.left = args.style.left || box.style.left;
	}
	// We center the box
	var width = parseInt(box.style.width.substring(0, box.style.width.length - 2)),
		height = parseInt(box.style.height.substring(0, box.style.height.length - 2));
	box.style.margin = '-' + (height / 2) + 'px 0 0 -' + (width / 2) + 'px';


	if (args.type === 'text') {
		var p = document.createElement('p');
		p.innerText = args.content;
		box.appendChild(p);
	}else if (args.type === 'html') {
		box.innerHTML = args.content;
	}else {
		throw new Error('Error: "type" property in argument object should be string ("text" or "html"), ' + args.type + ':' + typeof args.type + ' given instead.');
	}

	// We create the given buttonss, and associate them with the corresponding callbacks
	var btContainer = document.createElement('p');
	for (var i = 0, button, currentBt; i < args.buttons.length; i++) {
		button = document.createElement('button');
		button.callback = args.buttons[i].callback;
		button.innerHTML = args.buttons[i].text;
		button.style.padding = '4px 12px 4px 12px';
		button.style.fontSize = '14px';
		button.style.fontWeight = 'bold';
		button.style.color = '#555';
		if (args.buttons[i].id != undefined)
			button.id = args.buttons[i].id;

		if (typeof button.callback === 'function') {
			button.onclick = function(event) {
				that.remove();
				this.callback(event);
			}
		}else if (button.callback === 'remove') {
			button.onclick = function(event) {
				that.remove();
			};
		}
		btContainer.appendChild(button);
	};
	box.appendChild(btContainer);

	this.container.appendChild(box);
}

/**
 * Displays the popup
 */
Popup.prototype.show = function() {
	document.body.appendChild(this.container);
};

/**
 * Removes the popup
 */
Popup.prototype.remove = function() {
	document.body.removeChild(this.container);
};

/**
 * A simple alert popup
 */
Popup.alert = function(text, callback) {
	// We create a simple popup with a button that removes the popup
	var popup = new Popup({
		type: 'html',
		content: '<h3>' + text + '</h3><br/>',
		buttons: [
			{
				text: 'Ok',
				callback: callback || 'remove'
			}
		]
	});
	popup.show();
};

/**
 * A confirm popup with 'Yes' and 'No' options
 */
Popup.confirm = function(text, style, trueCallback, falseCallback) {
	// We create a popup with two buttons
	var popup = new Popup({
		type: 'html',
		content: '<h3>' + text + '</h3><br/>',
		buttons: [
			{
				text: 'Yes',
				callback: trueCallback || 'remove'
			},
			{
				text: 'No',
				callback: falseCallback || 'remove'
			}
		],
		style: style || null
	});
	popup.show();
};