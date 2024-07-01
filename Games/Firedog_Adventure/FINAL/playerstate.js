import{Dust,Fire,Splash} from './particle.js'
const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};
class State {
  constructor(state,game) {
    this.state = state;
    this.game=game;
  }
}
export class Sitting extends State {
  constructor(game) {
    super("SITTING",game);
  
  }
  enter() {
    this.game.player.framex = 0;
    this.game.player.maxframe = 4;
    this.game.player.framey = 5;
  }
  handleinput(input) {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (input.includes("Enter") && this.game.player.onground())
      this.game.player.setState(states.ROLLING, 2);
  }
}
export class Running extends State {
  constructor(game) {
    super("RUNNNING",game);
    
  }
  enter() {
    this.game.player.framex = 0;
    this.game.player.maxframe = 8;
    this.game.player.framey = 3;
  }
  handleinput(input) {
    this.game.particles.unshift(new Dust(this.game,this.game.player.x+this.game.player.width*0.5,this.game.player.y+this.game.player.height));
    
    if (input.includes("ArrowDown")) {
      this.game.player.setState(states.SITTING, 0);
    } else if (input.includes("ArrowUp")) {
      this.game.player.setState(states.JUMPING, 1);
    } else if (input.includes("Enter") && this.game.player.onground())
      this.game.player.setState(states.ROLLING, 2);
  }
}
export class Jumping extends State {
  constructor(game) {
    super("JUMPING",game);
    
  }
  enter() {
    if (this.game.player.onground()) this.game.player.vy-=27;
    this.game.player.framex = 0;
    this.game.player.maxframe = 6;
    this.game.player.framey = 1;
  }
  handleinput(input) {
    if (this.game.player.vy > this.game.player.weight) {
      this.game.player.setState(states.FALLING, 1);
    }
    else if (input.includes("Enter") && !this.game.player.onground())
    this.game.player.setState(states.ROLLING, 2);
   else  if (input.includes("ArrowDown")) {
      this.game.player.setState(states.DIVING, 0);
    }
    
      
    }   
      
}
export class Falling extends State {
  constructor(game) {
    super("FALLING",game);
  
  }
  enter() {
    this.game.player.framex = 0;
    this.game.player.maxframe = 6;
    this.game.player.framey = 2;
  }
  handleinput(input) {
    if (this.game.player.onground()) this.game.player.setState(states.RUNNING, 1);
  }
}
export class Rolling extends State {
  constructor(game) {
    super("ROLLING",game);
    
  }
  enter() {

    this.game.player.framex = 0;
    this.game.player.maxframe = 6;
    this.game.player.framey = 6;
  }
  handleinput(input) {
    this.game.particles.unshift(new Fire(this.game,this.game.player.x+this.game.player.width*0.6,this.game.player.y+this.game.player.height
      ));
    if (input.includes("ArrowRight")
     && this.game.player.onground())
      this.game.player.setState(states.RUNNING, 1);
    else if (!input.includes("Enter") && !this.game.player.onground())
      this.game.player.setState(states.FALLING, 1);
      else if(input.includes("Enter")&& input.includes("ArrowUp")&& this.game.player.onground())
      {
        this.game.player.vy-=27;
      }
      else  if (input.includes("ArrowDown")&& !this.game.player.onground()) {
        this.game.player.setState(states.DIVING, 0);
      }
      
  }
}
export class Diving extends State {
  constructor(game) {
    super("DIVING",game);
    
  }
  enter() {

    this.game.player.framex = 0;
    this.game.player.maxframe = 6;
    this.game.player.framey = 6;
    this.game.player.vy=15;
  }
  handleinput(input) {
    this.game.particles.unshift(new Fire(this.game,this.game.player.x+this.game.player.width*0.6,this.game.player.y+this.game.player.height
      ));
    if ( this.game.player.onground())
     {
      for(let i=0;i<30;i++)
      {
        this.game.particles.unshift(new Splash(this.game,this.game.player.x+this.game.player.width*0.5,this.game.player.y+this.game.player.height*0.5));
      }
      this.game.player.setState(states.RUNNING, 1);
      
    }
    else if (input.includes("Enter") && !this.game.player.onground())
      this.game.player.setState(states.ROLLING, 2);
     
    
}
}
export class HIT extends State {
  constructor(game) {
    super("HIT",game);
    
  }
  enter() {

    this.game.player.framex = 0;
    this.game.player.maxframe = 10;
    this.game.player.framey = 4;
    
  }
  handleinput(input) {
    //this.game.particles.unshift(new Fire(this.game,this.game.player.x+this.game.player.width*0.6,this.game.player.y+this.game.player.height));
      if (this.game.player.framex >=10 && this.game.player.onground()) this.game.player.setState(states.RUNNING, 1);
    else if (this.game.player.framex >=10 && !this.game.player.onground())
      this.game.player.setState(states.FALLING, 1);
     
    
}
}