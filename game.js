/* main game engine */

var game_state = 'prestart';
var bird;
var pipes = [];
var highscore = 0;

// AI params
var generation;
var nextUpperIdx = -1;
var nextLowerIdx = -1;

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

  if(params.AI_PLAY){
    generation = new GeneticAlgo();
    generation.init();
  }else{
    bird = new Bird('blue');
  }

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

  //console.log(generation);

  switch (game_state){
    case 'prestart':
          if(params.AI_PLAY){
            game_state = 'running';
          }else{
            bird.hover();
          }
          break;
    case 'running':
          runPipes();
          collisionCheck();
          gameoverCheck();
          updateScore();

          if(params.AI_PLAY){
            generation.flockUpdate();
          }else{
            bird.updatePos();
          }
          break;
    case 'gameover':
          resetGame();

          if(params.AI_PLAY){
            generation.nextGen();
          }
          game_state = 'running';
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
    if(params.AI_PLAY){
        for(var i = 0; i < params.BIRD_NUM; i++){
            generation.units[i].reset();
        }
    }else{
        bird.reset();
    }
    
    // reset obstacles
    pipes.splice(0,pipes.length);
    for(j = 0; j < params.PIPES_NUM; j++){
        var dist = (params.FRAME_WIDTH + params.PIPE_WIDTH) * (1.5 + j*0.5);
        var topLength = random(params.PIPE_MIN_Y,params.PIPE_MAX_Y);
        pipes.push(new Pipe('top',topLength,dist));
        pipes.push(new Pipe('bottom',(params.FRAME_HEIGHT - topLength - params.PIPE_GAP),dist));
    }
}

function gameoverCheck(){

    if(params.AI_PLAY){
        var numDead = 0;
        for (var i = 0; i < params.BIRD_NUM; i++){
            if (generation.units[i].isDead){
                numDead += 1;
                //console.log(numDead);
            }
        }

        if (numDead === params.BIRD_NUM)
            game_state = 'gameover';

    }else{
        if(bird.isDead)
            game_state = 'gameover';
    }
}

function collisionCheck(){

    var i;
    var j;

    // top bound & lower bound check

    if(params.AI_PLAY){
        for (i = 0; i < generation.units.length; i++){
            if (generation.units[i].position.y - params.BIRD_DIAMETER/2 < 0){
                generation.units[i].isDead = true;
            }
            else if (generation.units[i].position.y + params.BIRD_DIAMETER/2 > params.Y_OFFSET){
                generation.units[i].isDead = true;
            }
        }
    }else{
        if (bird.position.y - params.BIRD_DIAMETER/2 < 0)
            bird.isDead = true;
        else if (bird.position.y + params.BIRD_DIAMETER/2 > params.Y_OFFSET)
            bird.isDead = true;        
    }

    // obstacle check
    for(i = 0; i < pipes.length; i++){
        // check if pipe has reached critical region
        if (pipes[i].startPos < params.BIRD_X + params.BIRD_DIAMETER/2){
            if (!(pipes[i].startPos + params.PIPE_WIDTH < params.BIRD_X - params.BIRD_DIAMETER/2)){

                if (params.AI_PLAY){
                    for (j = 0; j < generation.units[i].length; j++){
                        if(pipes[i].type == 'top'){
                            if (generation.units[i].position.y - params.BIRD_DIAMETER/2 <= pipes[i].length){
                                generation.units[i].isDead = true;
                                console.log("hit top");
                            }
                        }else{
                            if (generation.units[i].position.y + params.BIRD_DIAMETER/2 >= params.FRAME_HEIGHT - pipes[i].length){
                                generation.units[i].isDead = true;
                                console.log("hit bottom");
                            }
                                                        
                        }
                    }
                }else{
                    if(pipes[i].type == 'top'){
                        if (bird.position.y - params.BIRD_DIAMETER/2 <= pipes[i].length){
                            bird.isDead = true;
                            console.log("hit top");
                        }
                    }else{
                        if (bird.position.y + params.BIRD_DIAMETER/2 >= params.FRAME_HEIGHT - pipes[i].length){
                            bird.isDead = true;
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

    //identify next pipe
    for (var i = 0; i < pipes.length; i++){
        if (!pipes[i].isPassed){
            nextUpperIdx = i;
            nextLowerIdx = i+1;
            break;
        }
    }

}

function updateScore(){
    // update current score of birds
    if(params.AI_PLAY){
        var i;
        for (i = 0; i < generation.units[i].length; i++){
            if (!generation.units[i].isDead){
                generation.units[i].score = highscore;
            }
        }
    }else{
        if (!bird.isDead){
            bird.score = highscore;
        }        
    }
}

// flap bird
function keyPressed(){
  if (key == ' ' && !params.AI_PLAY){

    switch (game_state){
        case 'prestart':
            game_state = 'running';
            break;
        case 'running':
            if(!params.AI_PLAY)
                bird.velocity.y = params.FLAP_GAIN;
            break;
        case 'gameover':
            game_state = 'prestart';
            break;
    }
  }
}