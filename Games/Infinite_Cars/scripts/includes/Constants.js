"use strict";

export const SCREEN_WIDTH = 320;
export const SCREEN_HEIGHT = 480;

export const MIN_SCREEN_WIDTH =  SCREEN_WIDTH / 8;
export const MIN_SCREEN_HEIGHT =  SCREEN_HEIGHT / 8;

export const MAX_SCREEN_WIDTH =  SCREEN_WIDTH * 4;
export const MAX_SCREEN_HEIGHT =  SCREEN_HEIGHT * 4;

export const CAMERA_FADE_TIME = 256;

export const IMAGES_PATH = "./assets/images";
export const AUDIOS_PATH = "./assets/audios";

export const TILE_WIDTH = 32;
export const TILE_HEIGHT = 32;
export const ROAD_LAYOUT = [
	"grass",
	"grass",
	"left-gutter",
	"left-road",
	"middle-road",
	"middle-road",
	"right-road",
	"right-gutter",
	"grass",
	"grass",
];
export const ROAD_BOUNDARY = [96, 224];

export const GRASS_RATE = 20;
export const GRASS_MAP = [
	"tree",
	"flower",
];

export const INITIAL_CHARACTER_X = SCREEN_WIDTH / 2;
export const INITIAL_CHARACTER_Y = SCREEN_HEIGHT * 0.75;

export const CHARACTER_SPEED = 192;

export const ROAD_CONE_RATE = 6.5;
export const COMPUTER_CAR_RATE = 6.5;

export const COMPUTER_SLOW_SPEED_MIN = 96;
export const COMPUTER_SLOW_SPEED_MAX = 144;

export const COMPUTER_FAST_SPEED_MIN = 256;
export const COMPUTER_FAST_SPEED_MAX = 320;

export const COMPUTER_DODGE_DISTANCE = 240;
export const COMPUTER_DODGE_SPEED = 48;

export const STOP_LIGHT_WIDTH = 96;
export const STOP_LIGHT_HEIGHT = 240;

export const EXPLOSION_WIDTH = 32;
export const EXPLOSION_HEIGHT = 32;

export const GAME_START_TIME = 4000;

export const FONT_FAMILY = "'Luckiest Guy', cursive";
export const FONT_SETTINGS = {
	fontFamily: FONT_FAMILY,
	fontSize: "24px",
	stroke: "#000000",
	strokeThickness: 4,
};

export const SOUND_CONTROL_WIDTH = 16;
export const SOUND_CONTROL_HEIGHT = 16;

export const IS_DEBUG = false;
