// Initialize params
var params = {
    AI_PLAY: false,  

    FRAME_WIDTH: 336,
    FRAME_HEIGHT: 512,
    FRAME_RATE: 30,
  
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
  
    BIRD_NUM: 30,
    BIRD_X: 100,
    BIRD_Y: 200,
    BIRD_DIAMETER: 36,
  
    FLAP_GAIN: -10,
    MAX_FALL_SPEED: 10,
    ACCEL: 1
  };


var net_params = {

  //Node ID
  NODE_BIAS: 1,
  NODE_PIPE_DIS: 2,
  NODE_PIPE_LOWER: 3,
  NODE_BIRD_HEIGHT: 4,
  NODE_OUTPUT: 0,
  
  INPUT_SIZE: 4,
  STEP_SIZE: 0.1,
  ADD_NODE_PROB: 0.5
}

var gen_params ={
  SURVIVE_RATE : 30,   //percentage
  CHANCE_OF_MUTATION: 0.4
}