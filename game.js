/* main game engine */

// Initialize params
var params = {
  FRAME_WIDTH: 336,
  FRAME_HEIGHT: 512,
  FRAME_RATE: 40,

  GROUND_HEIGHT: 112,
  GROUND_WIDTH: 336,
  Y_OFFSET: 490,

  SCORE_Y: 20,
  SCORE_WIDTH: 24,
  SCORE_SPACE: 2,

  PIPES_NUM: 999,
  PIPE_WIDTH: 52,
  PIPE_HEIGHT: 500,
  PIPE_MIN_Y: 100,
  PIPE_MAX_Y: 300,
  PIPE_SPEED: -3,
  PIPE_GAP: 100,

  BIRD_NUM: 1,
  BIRD_X: 100,
  BIRD_Y: 200,
  BIRD_DIAMETER: 36,

  FLAP_GAIN: -10,
  MAX_FALL_SPEED: 10,
  ACCEL: 1
};

var game_state = 'prestart';
var birds = [];
var pipes = [];
var highscore = 0; 

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
  angleMode(DEGREES);
  imageMode(CENTER);

  bird_test = new Bird('blue');
  birds.push(bird_test);
  
  // pre-set
  for(var i = 0; i < params.PIPES_NUM; i++){
      var dist = (params.FRAME_WIDTH + params.PIPE_WIDTH) * (1.5 + i*0.5);
      var topLength = random(params.PIPE_MIN_Y,params.PIPE_MAX_Y);
      pipes.push(new Pipe('top',topLength,dist));
      pipes.push(new Pipe('bottom',(params.FRAME_HEIGHT - topLength - params.PIPE_GAP),dist));
  }

}

function draw() {
  // load static environment
  image(bg,params.FRAME_WIDTH/2,params.FRAME_HEIGHT/2);

  var drawGRDY = params.Y_OFFSET + params.GROUND_HEIGHT/2;
  image(grd,params.GROUND_WIDTH/2,drawGRDY);

  switch (game_state){
    case 'prestart':
          birds[0].hover();
          break;
    case 'running':
          collisionCheck();
          gameoverCheck();
          birds[0].updatePos();
          runPipes();
          updateScore();
          console.log(birds[0].score);
          break;
    case 'gameover':
          resetGame();
          break;
  }

}


// control functions
// -----------------------------------------------------------------------------------------------------------------------
function resetGame(){
    var i;
    var j;

    highscore = 0;

    // reset birds status
    for (i = 0; i < birds.length; i++){
        birds[i].position.y = params.BIRD_Y;
        birds[i].isDead = false;
        birds[i].score = 0;
    }

    // reset pipes
    pipes.splice(0,pipes.length);
    //pipes = [];
    for(j = 0; j < params.PIPES_NUM; j++){
        var dist = (params.FRAME_WIDTH + params.PIPE_WIDTH) * (1.5 + j*0.5);
        var topLength = random(params.PIPE_MIN_Y,params.PIPE_MAX_Y);
        pipes.push(new Pipe('top',topLength,dist));
        pipes.push(new Pipe('bottom',(params.FRAME_HEIGHT - topLength - params.PIPE_GAP),dist));
    }
}

function gameoverCheck(){

    var numDead = 0;
    for (var i = 0; i < birds.length; i++){
        if (birds[i].isDead)
            numDead += 1;
    }

    if (numDead === params.BIRD_NUM)
        game_state = 'gameover';
}

function collisionCheck(){

    var i;
    var j;

    // top bound & lower bound check
    for (i = 0; i < birds.length; i++){
        if (birds[i].position.y - params.BIRD_DIAMETER/4 < 0)
            birds[i].isDead = true;
        else if (birds[i].position.y + params.BIRD_DIAMETER/4 > params.Y_OFFSET)
            birds[i].isDead = true;
    }

    // obstacle check
    for(i = 0; i < pipes.length; i++){
        // check if pipe has rached critical region
        if (pipes[i].startPos < params.BIRD_X + params.BIRD_DIAMETER/2){
            if (!(pipes[i].startPos + params.PIPE_WIDTH < params.BIRD_X - params.BIRD_DIAMETER/2)){

                for (j = 0; j < birds.length; j++){
                    if(pipes[i].type == 'top'){
                        if (birds[j].position.y - params.BIRD_DIAMETER/4 <= pipes[i].length){
                            birds[j].isDead = true;
                            console.log("hit top");
                        }
                    }else{
                        if (birds[j].position.y + params.BIRD_DIAMETER/4 >= params.FRAME_HEIGHT - pipes[i].length){
                            birds[j].isDead = true;
                            console.log("hit bottom");
                        }
                                                    
                    }
                 }
            }
        }
    }
}

function runPipes(){
    for (var i = 0; i < pipes.length; i++){

        pipes[i].updatePos();

        if (pipes[i].startPos + params.PIPE_WIDTH < params.BIRD_X - params.BIRD_DIAMETER/2){
            if (!pipes[i].isPassed){
                pipes[i].isPassed = true;
                highscore += 0.5; 
            }
        }
    }

}

function updateScore(){
    // update current score of birds
    var i;
    for (i = 0; i < birds.length; i++){
        if (!birds[i].isDead){
            birds[i].score = highscore;
        }
    }
}

// flap bird
function keyPressed(){
  if (key == ' '){

    switch (game_state){
        case 'prestart':
            game_state = 'running';
            break;
        case 'running':
            birds[0].velocity.y = params.FLAP_GAIN;
            break;
        case 'gameover':
            game_state = 'prestart';
            break;
    }
  }
}


// define bird object
var Bird = function(color){
    this.colour = color;

    this.velocity = createVector(0, 0);
    this.position = createVector(params.BIRD_X, params.BIRD_Y);
    this.angle = 0
    this.up = true; 

    this.isDead = false;
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
      this.position.add(createVector(0, -0.5));
    }else{
      this.position.add(createVector(0, 0.5));
    }

    image(blue_bird,this.position.x,this.position.y, params.BIRD_DIAMETER, params.BIRD_DIAMETER);
}

Bird.prototype.updatePos = function(){

    /*
    if (this.flap){
        this.velocity.y += params.FLAP_GAIN;
        this.flap = false;
    }
    */

    this.speedcontrol();
    this.tilt();

    // drawing part
    push();
    translate(this.position.x,this.position.y);
    rotate(this.angle);
    image(blue_bird, 0, 0, params.BIRD_DIAMETER, params.BIRD_DIAMETER);
    pop();
}

Bird.prototype.speedcontrol = function(){
    if (this.velocity.y < params.MAX_FALL_SPEED)
        this.velocity.y += params.ACCEL;

    if (this.isDead){
        if (this.position.y + params.BIRD_DIAMETER/4 > params.Y_OFFSET)
            this.velocity.y = 0;
    }

    this.position.y += this.velocity.y;
}

Bird.prototype.tilt = function(){
    if (this.velocity.y < 0)
        this.angle = -15;
    else if (this.angle < 45){
        this.angle += 2;
    }
}

// --------------------------------------------------------------------------------------------------------
// pipes
var Pipe = function(pipe_type, pipe_length, startX){

    this.type = pipe_type;
    this.isPassed = false;

    this.angle = -90;
    this.length = pipe_length;
    this.speed = params.PIPE_SPEED;
    this.startPos = startX;         // x-coord for of top hand corner
}

Pipe.prototype.updatePos = function(){

    // calculate the x_coord
    this.startPos += params.PIPE_SPEED;
    var x_coord = this.startPos + params.PIPE_WIDTH/2;
    

    if ((this.startPos <= params.FRAME_WIDTH) && (this.startPos + params.PIPE_WIDTH >= 0)){
        if (this.type == 'top'){
            var y_coord = this.length - (params.PIPE_HEIGHT/2);

            // drawing part
            push();
            translate(x_coord, y_coord);
           // rotate(this.angle);
            image(pipe_down,0,0);
            pop();            
            
        }else{
            var y_coord = ((params.PIPE_HEIGHT/2) +  params.FRAME_HEIGHT) - this.length;

            // drawing part
            push();
            translate(x_coord, y_coord);
           // rotate(this.angle);
            image(pipe_up,0,0);
            pop();
        }
    }
}

