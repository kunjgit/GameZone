

/**************************************************
** MOBILE CLASS
**************************************************/
var Mobile = function(juego) {


    var self = this;

  
    this.pinta_cosas_mobile_ = function() {

        this.c_m   = document.getElementById('c_m');
        this.ctx_mobile_      = this.c_m.getContext('2d');
        this.c_m.style.display = "block";
        var ancho_w = w.innerWidth
        this.c_m.width  = juego.ancho_total_;
        this.c_m.height = 200;


        
        var flecha_arr=  [
                    [  ,  , 1,  ,  ],
                    [  , 1, 1, 1,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [  , 1, 1, 1,  ]
            ];
        var accion_boton=  [
                    [ 1,  , 1,  , 1],
                    [  , 1, 1, 1,  ],
                    [ 1, 1, 1, 1, 1],
                    [  , 1, 1, 1,  ],
                    [ 1,  , 1,  , 1]
            ];


        var largo = w.innerHeight;
        if(w.innerWidth>w.innerHeight){
            largo = w.innerWidth;
        }
        var size_flecha_px = largo/80;

        this.ctx_mobile_.clearRect(0, 0, juego.ancho_total_, 200);
        juego.pinta_filas_columnas_(this.ctx_mobile_, 20, 105, juego.flecha_izq, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile_, 95, 105, juego.flecha_der, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile_, 52, 60, juego.flecha_arr, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile_, 52, 160, juego.flecha_abj_, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile_, ancho_w - 65 - size_flecha_px*10, 145, flecha_arr, size_flecha_px);
        juego.pinta_filas_columnas_(this.ctx_mobile_, ancho_w - 20 -size_flecha_px*5, 145, accion_boton, size_flecha_px);

        

       
          
    }

    this.mobile_listeners_ = function(){
        
        if(juego.is_touch_device_()){
            document.getElementById('cn_m').style.display = "block";

            document.getElementById('u_m').addEventListener('touchstart', function(e){
                if(juego.empezado_){
                    juego.player_.up = true;
                }
                this.className = "t_m pl";
                e.preventDefault();
            });
            document.getElementById('dw_m').addEventListener('touchstart', function(e){
                if(juego.empezado_){
                    juego.player_.down = true;
                }
                this.className = "t_m pl";
                e.preventDefault();
            });
            document.getElementById('d_m').addEventListener('touchstart', function(e){
                if(juego.empezado_){
                    juego.player_.right = true;
                }
                this.className = "t_m pl";
                e.preventDefault();
            });

            document.getElementById('i_m').addEventListener('touchstart', function(e){ 
                if(juego.empezado_){
                    juego.player_.left = true;
                }
                this.className = "t_m pl";
                e.preventDefault();
            });

            document.getElementById('ar_m').addEventListener('touchstart', function(e){
                if(juego.empezado_){ 
                    juego.player_.jump_ = true;
                }
                this.className = "t_m pl";
                e.preventDefault();
            });

            document.getElementById('ac_m').addEventListener('touchstart', function(e){ 
                if(!juego.musica_sonando_){
                    w.musica_principal.play();
                    juego.musica_sonando_ = true;
                }
                if(juego.empezado_){
                    juego.player_.accion = true;
                }
                this.className = "t_m pl";
                e.preventDefault();
            });



            document.getElementById('u_m').addEventListener('touchend', function(e){
                if(!juego.empezado_){
                    juego.mueve_selec_player_(false, "up");
                }
                else{
                    juego.player_.up = false;
                }
                this.className = "t_m";
                e.preventDefault();
            });


            document.getElementById('dw_m').addEventListener('touchend', function(e){
                if(!juego.empezado_){
                    juego.mueve_selec_player_(false, "down");
                }
                else{
                    juego.player_.down = false;
                }
                this.className = "t_m";
                e.preventDefault();
            });


            document.getElementById('d_m').addEventListener('touchend', function(e){
                if(!juego.empezado_){
                    juego.mueve_selec_player_(false, "right");
                }
                else{
                    juego.player_.right = false;
                }
                this.className = "t_m";
                e.preventDefault();
            });

            document.getElementById('i_m').addEventListener('touchend', function(e){ 
                if(!juego.empezado_){
                    juego.mueve_selec_player_(false, "left");
                }
                else{
                    juego.player_.left = false;
                }
                this.className = "t_m";
                e.preventDefault();
            });

            document.getElementById('ar_m').addEventListener('touchend', function(e){ 
                
                if(juego.empezado_){
                    juego.player_.jump_ = false;
                }
                this.className = "t_m";
                e.preventDefault();
            });

            document.getElementById('ac_m').addEventListener('touchend', function(e){ 
                if(juego.empezado_){
                    juego.player_.accion = false;
                }
                else{
                    juego.selec_player_(false);
                }
                this.className = "t_m";
                e.preventDefault();
            });
        }
    }

    
    this.controla_if_mobile_ = function(){
        if(juego.is_touch_device_()){
            self.pinta_cosas_mobile_();
        }
    };

}