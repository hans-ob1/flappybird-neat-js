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