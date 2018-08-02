// get game canvas
var Params = {};

// game parameters
Params.game = {
    NUM_PIPES: 10,
    PIPE_WIDTH: 52,
    PIPE_HEIGHT: 500,

    PIPE_MIN_Y: 100,
    PIPE_MAX_Y: 300,
    PIPE_SPEED: -3,

    GAP_HEIGHT: 100,

    INIT_BIRD_X: 100,
    INIT_BIRD_Y: 200,
    BIRD_RADIUS: 15,

    SIM_SPEED: 25
}

Params.frame = {
    FRAME_WIDTH: 336,
    FRAME_HEIGHT: 512,

    GRD_POSX: 168,
    GRD_POSY: 545,
    GROUND_POS: 495,

    SCORE_Y: 20,
    SCORE_WIDTH: 24,
    SCORE_SPACE: 2
}

Params.neat = {
    NUM_BIRDS: 1,

}