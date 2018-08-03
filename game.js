/* main game engine */

// Initialize params
var params = {
  FRAME_WIDTH: 336,
  FRAME_HEIGHT: 512,
  FRAME_RATE: 30,

  GROUND_X: 0,
  GROUND_Y: 490,

  SCORE_Y: 20,
  SCORE_WIDTH: 24,
  SCORE_SPACE: 2,

  PIPES_NUM: 10,
  PIPE_WIDTH: 52,
  PIPE_HEIGHT: 500,
  PIPE_MIN_Y: 100,
  PIPE_MAX_Y: 300,
  PIPE_SPEED: -3,
  PIPE_GAP: 100,

  BIRD_NUM: 1,
  BIRD_X: 100,
  BIRD_Y: 200,
  BIRD_RADIUS: 48,

  FLAP_GAIN: -10,
  MAX_FALL_SPEED: 10,
  ACCEL: 1
};

var game_state = 'prestart';
//var flap_gain = createVector(0, 5); // amount of height gain with a single flap
var birds = [];
var pipes = [];

function setup() {
  // load background
  bg = loadImage("assets/background.png");
  grd = loadImage("assets/platform.png");

  // load bird
  blue_bird = loadImage("assets/blue_bird.png");
  red_bird = loadImage("assets/red_bird.png");

  // load pipes
  pipe_down = loadImage("assets/pipe_down.png");
  pipe_up = loadImage("assets/pipe_up.png");

  var canvas = createCanvas(params.FRAME_WIDTH,params.FRAME_HEIGHT);
  canvas.parent('game-container');
  frameRate(params.FRAME_RATE);

  bird_test = new Bird('blue');
}

function draw() {
  // load static environment
  background(bg);
  image(grd,params.GROUND_X,params.GROUND_Y);

  switch (game_state){
    case 'prestart':
          bird_test.hover();
          break;
    case 'running':
          break;
    case 'gameover':
          break;
  }

}

function bird_hover(){

}

var Bird = function(color){
    this.colour = color;
    this.velocity = createVector(0, 0);
    this.position = createVector(params.BIRD_X, params.BIRD_Y);
    this.up = true; 
    this.score = 0;
};

Bird.prototype.hover = function(){
    if (this.position.y <= params.BIRD_Y - 5){
      // too high
      this.up = false;
    }else if (this.position.y >= params.BIRD_Y + 5){
      // too low
      this.up = true;
    }

    if (this.up){
      this.position.add(createVector(0, -1));
    }else{
      this.position.add(createVector(0, 1));
    }

    image(blue_bird,this.position.x,this.position.y);
}
