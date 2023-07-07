

/**************************************************
** MUSIC CLASS
**************************************************/
var Music = function(juego, mobile, engine) {
    
    this.arranca_ = function(){
         /* Musica */

        //Una instancia del player por cada sonido
        var music_player = new CPlayer();
        var flag_song = false;
        music_player.init(song);


        var ataque_player = new CPlayer();
        ataque_player.init(ataque);
        var flag_ataque = false;
        w.ataque_audio_;

        
        var bloqueo_player = new CPlayer();
        bloqueo_player.init(bloqueo);
        var flag_bloqueo = false;
        w.bloqueo_audio_;

        
        var ostia_player = new CPlayer();
        ostia_player.init(ostia);
        var flag_ostia = false;
        w.ostia_audio_;
        
        var ostia_final_player = new CPlayer();
        ostia_final_player.init(ostia_final);
        var flag_ostia_final = false;
        w.ostia_final_audio_;
        
        var sirena_player = new CPlayer();
        sirena_player.init(sirena);
        var flag_sirena = false;
        w.sirena_audio_;
        
        var viento_player = new CPlayer();
        viento_player.init(viento);
        var flag_viento = false;
        w.viento_audio_;
        
        var menu_player = new CPlayer();
        menu_player.init(menu);
        var flag_menu = false;
        w.menu_audio_;
        
        var menu_ok_player = new CPlayer();
        menu_ok_player.init(menu_ok);
        var flag_menu_ok = false;
        w.menu_ok_audio_;


        var done = false;
        var intervalo_cancion = setInterval(function () {

            

            if (done) {
                //Cuando todo está cargado inicio el asunto...

                //Pinto el meni
                juego.muestra_menu_(juego.ctx_, false);

                //Y empieza el ciclo del juego
                engine.frame_();
                
                //Limpio este intervalo para no dejar cosas sueltas
                clearInterval(intervalo_cancion);
                return;
            }

            if(!flag_song){
                var music_percent = music_player.generate();
                juego.pinta_cargador_(music_percent, juego.ctx_);
                if(music_percent >= 1){
                    flag_song = true;
                }
            }

            if(!flag_bloqueo){
                if(bloqueo_player.generate() >= 1){
                    flag_bloqueo = true;
                }
            }
            
            if(!flag_ataque){
                if(ataque_player.generate() >= 1){
                    flag_ataque = true;
                }
            }
            
            if(!flag_ostia){
                if(ostia_player.generate() >= 1){
                    flag_ostia = true;
                }
            }
            
            if(!flag_ostia_final){
                if(ostia_final_player.generate() >= 1){
                    flag_ostia_final = true;
                }
            }
            
            if(!flag_sirena){
                if(sirena_player.generate() >= 1){
                    flag_sirena = true;
                }
            }
            
            if(!flag_viento){
                if(viento_player.generate() >= 1){
                    flag_viento = true;
                }
            }
            
            if(!flag_menu){
                if(menu_player.generate() >= 1){
                    flag_menu = true;
                }
            }
            
            if(!flag_menu_ok){
                if(menu_ok_player.generate() >= 1){
                    flag_menu_ok = true;
                }
            }
            
            
            

            done = (flag_song && flag_bloqueo && flag_ataque && flag_ostia && flag_ostia_final && flag_sirena && flag_viento && flag_menu);

            if (done) {

                //Cuando todo está OK y antes de limpiar este intervalo, genero un elemento de audio para cada sonido

                var wave = music_player.createWave();
                w.musica_principal = document.createElement("audio");
                w.musica_principal.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
                w.musica_principal.loop=true;
                w.musica_principal.volume = 0.1;
                w.musica_principal.onplay = function() { 
                    juego.musica_sonando_ = true;
                };
                w.musica_principal.play();

                var wave2 = bloqueo_player.createWave();
                w.bloqueo_audio_ = document.createElement("audio");
                w.bloqueo_audio_.src = URL.createObjectURL(new Blob([wave2], {type: "audio/wav"}));
                w.bloqueo_audio_.volume = 1;
                
                var wave3 = ataque_player.createWave();
                w.ataque_audio_ = document.createElement("audio");
                w.ataque_audio_.src = URL.createObjectURL(new Blob([wave3], {type: "audio/wav"}));
                
                var wave4 = ostia_player.createWave();
                w.ostia_audio_ = document.createElement("audio");
                w.ostia_audio_.src = URL.createObjectURL(new Blob([wave4], {type: "audio/wav"}));
                
                var wave5 = ostia_final_player.createWave();
                w.ostia_final_audio_ = document.createElement("audio");
                w.ostia_final_audio_.src = URL.createObjectURL(new Blob([wave5], {type: "audio/wav"}));
                
                var wave6 = sirena_player.createWave();
                w.sirena_audio_ = document.createElement("audio");
                w.sirena_audio_.src = URL.createObjectURL(new Blob([wave6], {type: "audio/wav"}));

                
                var wave7 = viento_player.createWave();
                w.viento_audio_ = document.createElement("audio");
                w.viento_audio_.src = URL.createObjectURL(new Blob([wave7], {type: "audio/wav"}));
                
                
                var wave8 = menu_player.createWave();
                w.menu_audio_ = document.createElement("audio");
                w.menu_audio_.src = URL.createObjectURL(new Blob([wave8], {type: "audio/wav"}));
                
                
                
                var wave9 = menu_ok_player.createWave();
                w.menu_ok_audio_ = document.createElement("audio");
                w.menu_ok_audio_.src = URL.createObjectURL(new Blob([wave9], {type: "audio/wav"}));
                
            }
        }, 40);
    }
}