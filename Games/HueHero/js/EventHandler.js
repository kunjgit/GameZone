var EventHandler = function () {
    var id = 0, listeners = [];

    return {
        addListener: function(event, handler, element) {
            id++;
            element.addEventListener(event, handler);
            
            listeners[id] = {
                event: event,
                handler: handler,
                element: element
            };
            
            return id;
        },

        removeListener: function(id) {            
            if (id in listeners) {
                var handler = listeners[id];
                handler.element.removeEventListener(handler.event, handler.handler);
                delete listeners[id];
            }
        }
    }
}();