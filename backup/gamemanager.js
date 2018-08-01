/*
This part controls the overall game environment
Game environment controller:
- control parameters
- overall scene
- pipes
- npc
*/

// define game parameters
var ctx = myCanvas.getContext("2d");
var fps = 40;

var jump_amt = -10;
var max_fallspeed = +10;
var acceleration = 1;

// how fast the pipe move
var pipe_speed = -3;

var game_mode = 'prestart';
var time_game_last_running;
var bottom_bar_offset = 0;

// number of pipes of the entire game
var pipes = [];

// birds
var birds = [];

// Game Element
// ------------------------------------------------------------
function GameElement(img){
    this.x = 0;
    this.y = 0;
    this.velocity_x = 0;
    this.velocity_y = 0;

    this.MyImg = new Image();
    this.MyImg.src = img || '';

    this.flipV = true;
    this.flipH = true;
    this.visible = true;

    this.isDead = false;
}

GameElement.prototype.UpdateFrame = function(){
    ctx.save();
    ctx.translate(this.x + this.MyImg.width/2, this.y + this.MyImg.height/2);
    ctx.rotate(this.angle * Math.PI/180);

    // flip element along the x axis
    if (this.flipV) 
        ctx.scale(1,-1);

    // flip element along the y axis
    if (this.flipH)
        ctx.scale(-1,1);

    if (this.visible){
        ctx.drawImage(this.MyImg, -this.MyImg.width/2, -this.MyImg.height/2)
    }

    //update at the end of cycle
    this.x = this.x + this.velocity_x;
    this.y = this.y + this.velocity_y;
    
    //restore back for next drawing
    ctx.restore();    
}


// flap the bird (human)
function ManualFlap(MyEvent){
    // toggle spacebar to flap
    if (MyEvent.key === ' ' ||  MyEvent.key === 'Spacebar'){
        switch (game_mode){
            case 'prestart': {
                game_mode = 'running';
                break;
            }
            case 'running': {
                // only one bird is running during manual mode
                bird[0].velocity_y = jump_amt;
                break;
            }
            case 'over': if (new Date() - time_game_last_running > 1000){
                reset_game();
                game_mode = 'running';
                break;
            }
        }
    }
    MyEvent.preventDefault();
}

// add player toggle (spacebar)
addEventListener("keydown", ManualFlap);


// Control Functions
// --------------------------------------------------------------
function CheckTouched(thing1, thing2){
    if (!thing1.visible || !thing2.visible)
        return false;
    
    if (thing1.x >= thing2.x + thing2.MyImg.width || thing1.x + thing1.MyImg.width <= thing2.x)
        return false;

    if (thing1.y >= thing2.y + thing2.MyImg.height || thing1.y + thing1.MyImg.height <= thing2.y)
        return false;

    return true;    
}

function birdSpeedControl(){
    for (var i = 0; i < bird.length; i++){
        if (bird[i].velocity_y < max_fallspeed){
            bird[i].velocity_y = bird[i].velocity_y + acceleration;
        }

        if (bird[i].y > myCanvas.height - bird[i].MyImg.height){
            bird[i].velocity_y = 0;

            // modify here
            game_mode = 'over';
        }
    } 
}

function birdTiltAngle(){
    for (var i = 0; i < bird.length; i++){
        if (bird[i].velocity_y < 0){
            bird[i].angle = -15;
        }else if (bird[i].angle < 70){
            bird[i].angle = bird[i].angle + 4;
        }
    }    
}

// Pipes
function addPipe(x_pos, top_of_gap, gap_width){
    var top_pipe = new GameElement();
    top_pipe.MyImg = pipe_piece;
    top_pipe.x = x_pos;
    top_pipe.y = top_of_gap - pipe_piece.height;
    top_pipe.velocity_x = pipe_speed;
    pipes.push(top_pipe);

    var bottom_pipe = new GameElement();
    bottom_pipe.MyImg = pipe_piece;
    bottom_pipe.flipV = true;
    bottom_pipe.x = x_pos;
    bottom_pipe.y = top_of_gap + gap_width;
    bottom_pipe.velocity_x = pipe_speed;
    pipes.push(bottom_pipe);
}

function showPipes(){
    for (var i = 0; i < pipes.length; i++){
        pipes[i].UpdateFrame();
    }
}

// status control (only if all bird died)
function checkGameOver(){
    var numDead = 0;

    for (var i = 0; i < bird.length; i++){

        if (!bird[i].isDead){
            for (var j = 0; j < pipes.length; j++){
                if (CheckTouched(bird[i], pipes[j])){
                    bird[i].isDead = true;
                    numDead += 1;
                    break;
                }
            }
        }else{
            numDead += 1;
        }
    }

    if (numDead === bird.length){
        game_mode = "over";
    }
}

function showGameOver(){
    var score = [];
    for (var i = 0; i < bird.length; i++){
        var temp = 0;
        for (var j = 0; j < pipes.length; j++){
            if (pipes[i].x < bird[j].x)
                temp = temp + 0.5;
        }
        score.push(temp);
    }

    console.log(score);

    ctx.font = "30px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.fillText("Game over", myCanvas.width/2, 100);
    ctx.fillText("Score: " + score[0], myCanvas.width/2, 150);
    ctx.font = "20px Arial";
    ctx.fillText("Click or press any key to play again", myCanvas.width/2, 300);
}

function showBottom(){
    if (bottom_bar_offset < -23) 
        bottom_bar_offset = 0;
    ctx.drawImage(bottom_bar, bottom_bar_offset, myCanvas.height - bottom_bar.height);
}

function resetGame(){
    for(var i = 0; i < bird.length; i++){
        bird[i].y = myCanvas.height/2;
        bird[i].angle = 0;
    }

    pipes=[];
    addAllPipes();
}

function addAllPipes(){
    addPipe(500,  100, 140);
    addPipe(800,   50, 140);
    addPipe(1000, 250, 140);
    addPipe(1200, 150, 120);
    addPipe(1600, 100, 120);
    addPipe(1800, 150, 120);
    addPipe(2000, 200, 120);
    addPipe(2200, 250, 120);
    addPipe(2400,  30, 100);
    addPipe(2700, 300, 100);
    addPipe(3000, 100,  80);
    addPipe(3300, 250,  80);
    addPipe(3600,  50,  60);

    var finish_line = new GameElement("assets/img/endline.png");
    finish_line.x = 3900;
    finish_line.velocity_x = pipe_speed;
    pipes.push(finish_line);        
}

var pipe_piece = new Image();
pipe_piece.onload = addAllPipes;
pipe_piece.src = "assets/img/pipe.png";

// center control
function DrawFame(){
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    for (var i = 0; i < bird.length; i++){
        bird[i].UpdateFrame();
    }

    showBottom();

    switch(game_mode){
        case 'prestart': {
            break;
        }
        case 'running':{
            time_game_last_running = new Date();
            bottom_bar_offset = bottom_bar_offset + pipe_speed;
            showPipes();
            birdTiltAngle();
            birdSpeedControl();
            checkGameOver();
            break;
        }
        case 'over':{
            birdSpeedControl();
            showGameOver();
            break;
        }
    }
}

//construct the bottom bar
var bottom_bar = new Image();
bottom_bar.src = "assets/img/base.png";

//TODO: link up NEAT with main game engine
var bird = []
for (var i = 0; i < 5; i++){
    bird.push(new GameElement("assets/img/bird.png"));
    bird[i].x = myCanvas.width/3;
    bird[i].y = myCanvas.height/2;
}

setInterval(DrawFame, 1000/fps);