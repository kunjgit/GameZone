// Strict mode enables modern JavaScript features and catches common programming errors.
"use strict";

(function () {
    // Variables used in the application.
    var socket;
    var canvas = document.getElementById('gameBoard');
    var guessLogList = document.getElementById('guessLogList');
    var scoreList = document.getElementById('scoreList');
    var canvasPressed = false, drawLock = true;
    var ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    var initClientX, initClientY;

    // Function to set the connection status message in the UI.
    function setConnectionStatus(message) {
        var connectionStatus = document.getElementById('connectionStatus');
        connectionStatus.innerText = message;
    }

    // Function to switch between different views in the UI.
    function setCurrentView(viewName) {
        var views = ['Join', 'Game', 'Result'];

        for (var i = 0; i < views.length; i++) {
            var viewDisplay = 'none';
            if (views[i] === viewName) {
                viewDisplay = 'block'
            }
            document.getElementById('page' + views[i]).style.display = viewDisplay;
        }
    }

    // Function to set the visibility of a component in the UI.
    function setVisibility(component, visibility) {
        component.style.display = visibility;
    }

    // Function to bind connection-related events to the socket.
    function bindConnectionEvents() {
        socket.on("connect", function () {
            setConnectionStatus('Have fun!');
        });

        socket.on("disconnect", function () {
            setConnectionStatus("Connection lost!");
        });

        socket.on("error", function () {
            setConnectionStatus("Connection error!");
        });
    }

    // Function to bind game-related events to the socket.
    function bindGameEvents() {
        // Event when the game starts.
        socket.on('gameStart', function (payload) {
            // ...
        });

        // Event for mouse down during drawing.
        socket.on('draw-mousedown', function (evt) {
            // ...
        });

        // Event for mouse up during drawing.
        socket.on('draw-mouseup', function (evt) {
            // ...
        });

        // Event for mouse move during drawing.
        socket.on('draw-mousemove', function (evt) {
            // ...
        });

        // Event when a guess is correct.
        socket.on('guess-correct', function (payload) {
            // ...
        });

        // Event when a guess is wrong.
        socket.on('guess-wrong', function (payload) {
            // ...
        });

        // Event when the game ends.
        socket.on('game-end', function (payload) {
            // ...
        });
    }

    // Function to join the game with the given username.
    window.joinGame = function (username) {
        // ...
    };

    // Function to make a guess for the word.
    window.guessWord = function (word) {
        // ...
    };

    // Event listeners for canvas mouse events.
    canvas.addEventListener('mousedown', function (evt) {
        // ...
    });

    canvas.addEventListener('mouseup', function (evt) {
        // ...
    });

    canvas.addEventListener('mousemove', function (evt) {
        // ...
    });

    // Client module initialization.
    function init() {
        setCurrentView('Join');
        setConnectionStatus('Initializing game...');
        socket = io({ upgrade: false, transports: ["websocket"] });
        bindConnectionEvents();
        bindGameEvents();
    }

    // Event listener to initialize the client module when the page loads.
    window.addEventListener("load", init, false);
})();
