
(function() { // module pattern

    /*
    w.stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
    */

    w = window;

    //instancia del juego
    var juego = new Game();


    juego.ancho_total_ = w.innerWidth;
    juego.alto_total_  = w.innerHeight;

    //instancia de movil para controlar sus cosas
    var mobile = new Mobile(juego);
    
    //Muestro cosas para moviles
    mobile.controla_if_mobile_();
    mobile.mobile_listeners_();

    //el bucle general del juego
    var engine = new Engine(juego, mobile);

    // MUSICA -> ojo, es la que lanza el juego, cuando está ok! LOL
    var musica = new Music(juego, mobile, engine);
    musica.arranca_();


    //MAPEAO KEY DOWN Y UPS
    document.addEventListener('keydown', function(ev) { return juego.onkey_(ev, ev.keyCode, true);  }, false);
    document.addEventListener('keyup',   function(ev) { return juego.onkey_(ev, ev.keyCode, false); }, false);


    /* Control de salir de la pestaña... para que pause el juego */
    function handleVisibilityChange() {
        if (document.hidden) {
            juego.pausa_ = true;
        } else  {
            juego.pausa_ = false;
        }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    /* Fin control de pestaña actual */
    document.getElementById('p_a').addEventListener('click', function(e){ 
        location.reload();
    });

})();