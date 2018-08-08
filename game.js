/* main game engine */

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

// update obstacle position
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