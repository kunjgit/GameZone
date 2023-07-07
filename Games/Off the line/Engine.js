

/**************************************************
** ENGINE CLASS
**************************************************/
var Engine = function(juego, mobile) {

    juego.counter_ = 0; 

    

    this.dt = 0;
    this.now_,
    this.last = juego.timestamp_();
    this.then_ = juego.timestamp_();

    this.frame_ = function(){

        //debug start
        //w.stats.begin();


        mobile.controla_if_mobile_();

        if(w.innerWidth < 820){
            juego.ancho_total_ = w.innerWidth * 2,
            juego.alto_total_  = w.innerHeight * 2;

        }
        else{
            juego.ancho_total_ = w.innerWidth,
            juego.alto_total_  = w.innerHeight;
        }
        
        juego.canvas_.width  = juego.ancho_total_;
        juego.canvas_.height = juego.alto_total_;

        if(!juego.empezado_){
            juego.muestra_menu_(juego.ctx_, juego.modo_seleccionado_);
            requestAnimationFrame(this.frame_.bind(this));
            return;
        }
        if(juego.pausa_){
            requestAnimationFrame(this.frame_.bind(this));
            return;
        }

        this.now_ = juego.timestamp_();
        
        this.dt = this.dt + Math.min(1, (this.now_ - this.last) / 1000);

        while(this.dt > juego.step_) {
            this.dt = this.dt - juego.step_;

            var elapsed = this.now_ - this.then_;
    
            if (elapsed > juego.fpsInterval_) {
                juego.update_(juego.step_);
            }
            
            this.then_ = this.now_ - (elapsed % juego.fpsInterval_);
            this.last = this.now_;
        }


        juego.pre_shake_();
        juego.render(juego.ctx_, juego.counter_, this.dt);
        juego.post_shake_();
        
        juego.counter_++;
        
        //debug start
        //w.stats.end();

        requestAnimationFrame(this.frame_.bind(this), canvas);
    }   
}