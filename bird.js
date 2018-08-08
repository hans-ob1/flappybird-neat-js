// define bird object
var Bird = function(color){
    this.colour = color;

    this.velocity = createVector(0, 0);
    this.position = createVector(params.BIRD_X, params.BIRD_Y);
    this.angle = 0
    this.up = true; 

    this.isDead = false;
    this.score = 0;

    // for ai
    this.brain = new Network();
    this.fitness = 0;
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