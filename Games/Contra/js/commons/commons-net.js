
commons = commons || {};
commons.net = {};

commons.net.Http = function(url, options){

    options = options || {};
    this.url = url || {};

    /* ---------------------------------------
     * Get -> Returns Observable
     * ---------------------------------------*/
    this.getJSON = function(endpoint) {

        var requestUrl = this.url + endpoint;
        return Rx.DOM.getJSON(requestUrl);
    }

    /* ---------------------------------------
     * Event Stream -> Returns continuous HTTP event stream
     * ---------------------------------------*/
    this.eventstream = function(endpoint, handler){

        this.es = new EventSource(this.url + endpoint);
        var esrxjs = new Rx.Observable((observer) => {this.es.addEventListener('message', (e) => observer.next(e));});

        esrxjs.subscribe(handler);
    };
};


commons.net.Socket = function(socket){

    this.ws = new WebSocket(socket);
    this.wso  = new Rx.Observable((observer) => {this.ws.addEventListener('message', (e) => observer.next(e));});

    this.subscribe = function(f){
        if (this.socketReady()) this.wso.subscribe(f);
    };
    this.send = function(msg){
        if (this.socketReady()) this.ws.send(msg);
    };

    this.socketReady = function() {
        return (this.ws != null && this.ws.readyState == 1);
    };
    this.destroy = function() {
        if(this.socketReady()) this.ws.close();
    };

}