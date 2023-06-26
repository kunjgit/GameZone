var VERSION = "2.21i";
var AI_VERSION = 4;

var NO_OF_TILES_X = 28,
	NO_OF_TILES_Y = 16;

var BASE_TILE_X = 40,
	BASE_TILE_Y = 44;

var GROUND_TILE_X = 40,
	GROUND_TILE_Y = 20,
	TEXT_TILE_X = 40,
	TEXT_TILE_Y = 44;

var BASE_SCREEN_X = (NO_OF_TILES_X * BASE_TILE_X);
var BASE_SCREEN_Y = (NO_OF_TILES_Y * BASE_TILE_Y + GROUND_TILE_Y + TEXT_TILE_Y);

var MIN_SCALE = 0.5,
	MAX_SCALE = 3;

var MENU_ICON_X = 40, MENU_ICON_Y = 36, ICON_BORDER = 4;
var BASE_ICON_X = (MENU_ICON_X + ICON_BORDER * 2);

var KEYCODE_BKSPACE = 8, //backspace
	KEYCODE_ENTER = 13,
	KEYCODE_SPACE = 32,
	KEYCODE_ESC = 27, //escape
	
	KEYCODE_X = 88,  //dig right
	KEYCODE_Y = 89,  //dig left (for German keyboards)
	KEYCODE_Z = 90,  //dig left

	KEYCODE_LEFT  = 37, //move left
	KEYCODE_RIGHT = 39, //move right
	KEYCODE_UP    = 38, //move up
	KEYCODE_DOWN  = 40, //move down

	KEYCODE_SUBTRACT = 109,  //Add KEYCODE_SUBTRACT & KEYCODE_HYPHEN for support fireFox 'dash' keycode
	KEYCODE_HYPHEN   = 173,  //
	KEYCODE_DASH = 189, //'-'
	KEYCODE_DOT  = 190, //'.'

	KEYCODE_U = 85,  //dig left
	KEYCODE_O = 79,  //dig right

	KEYCODE_J = 74,  //move left
	KEYCODE_L = 76,  //move right
	KEYCODE_I = 73,  //move up
	KEYCODE_K = 75,  //move down
	
	KEYCODE_PERIOD = 190, //'.'
	KEYCODE_COMMA  = 188, //',' 
	
	KEYCODE_A = 65, //'A'
	KEYCODE_C = 67, //'C'
	KEYCODE_D = 68, //'D'
	KEYCODE_E = 69, //'E'
	KEYCODE_G = 71, //'G'	
	KEYCODE_H = 72, //'H'
	KEYCODE_Q = 81, //'Q'
	KEYCODE_R = 82, //'R'
	KEYCODE_S = 83, //'S'
	KEYCODE_T = 84, //'T'
	KEYCODE_V = 86, //'V'
	KEYCODE_W = 87; //'W'

var	KEYCODE_0 = 48,
	KEYCODE_1 = 49,
	KEYCODE_2 = 50,
	KEYCODE_3 = 51,
	KEYCODE_4 = 52,
	KEYCODE_5 = 53,
	KEYCODE_6 = 54,
	KEYCODE_7 = 55,
	KEYCODE_8 = 56,
	KEYCODE_9 = 57;
	
var SCORE_COMPLETE_LEVEL = 1500, SCORE_COUNTER = 15;
	SCORE_GET_GOLD = 250,
	SCORE_IN_HOLE = 75,
	SCORE_GUARD_DEAD = 75;

var SCORE_VALUE_PER_POINT = 100; //for modern & edit mode

var PLAY_NONE = 0, PLAY_CLASSIC = 1, PLAY_MODERN = 2, PLAY_DEMO = 3, 
	PLAY_EDIT = 4, PLAY_TEST = 5, PLAY_AUTO = 6, PLAY_DEMO_ONCE = 7;

var GAME_START = 0,          GAME_RUNNING = 1, 
	GAME_FINISH = 2,         GAME_FINISH_SCORE_COUNT= 3, 
	GAME_WAITING = 4,        GAME_PAUSE = 5,
	GAME_NEW_LEVEL = 6,      GAME_RUNNER_DEAD = 7, 
	GAME_OVER_ANIMATION = 8, GAME_OVER = 9,
	GAME_NEXT_LEVEL = 10,    GAME_PREV_LEVEL = 11,
	GAME_LOADING = 12,       GAME_WIN = 13;

var ACT_UNKNOWN = -1, ACT_STOP = 0, 
	ACT_LEFT = 1,     ACT_RIGHT = 2, 
	ACT_UP = 3,       ACT_DOWN = 4, 
	ACT_FALL = 5,     ACT_FALL_BAR = 6,
	ACT_DIG_LEFT = 7, ACT_DIG_RIGHT = 8,
	ACT_DIGGING  = 9, 
	ACT_IN_HOLE  = 10, ACT_CLIMB_OUT = 11, 
	ACT_REBORN = 12;

//value | Character | Type
//------+-----------+-----------
//  0x0 |  <space>  | Empty space
//  0x1 |     #     | Normal Brick
//  0x2 |     @     | Solid Brick
//  0x3 |     H     | Ladder
//  0x4 |     -     | Hand-to-hand bar (Line of rope)
//  0x5 |     X     | False brick
//  0x6 |     S     | Ladder appears at end of level
//  0x7 |     $     | Gold chest
//  0x8 |     0     | Guard
//  0x9 |     &     | Player	

var EMPTY_T  = 0x00; 
var BLOCK_T  = 0x01; 
var SOLID_T  = 0x02; 
var LADDR_T  = 0x03; 
var BAR_T    = 0x04; 
var TRAP_T   = 0x05; 
var HLADR_T  = 0x06; 
var GOLD_T   = 0x07;
var GUARD_T  = 0x08;
var RUNNER_T = 0x09;

var REBORN_T = 0x10; //template: for reborn

var CLOSE_SCREEN_SPEED = 35; //20 ~ 80

var MAX_OLD_GUARD = 6;   //maximum number of guards for AI Version 1 and 2
var MAX_NEW_GUARD = 5;   //for AI Version >= 3

var RUNNER_LIFE = 5;   //number of runner life
var RUNNER_MAX_LIFE = 100;

var MAX_TIME_COUNT = 999; //for moden mode
var TICK_COUNT_PER_TIME = 16;
var MAX_DEMO_WAIT_COUNT = 200 * TICK_COUNT_PER_TIME;

var MAX_EDIT_LEVEL = 120;

var MAX_HISCORE_RECORD = 10, MAX_HISCORE_NAME_LENGTH = 12;

//===========================
// Define value for playData 
//===========================
var PLAY_DATA_USERDEF = 999;

//================================================
// Define themes string also as theme folder name 
//================================================
var THEME_APPLE2 = "APPLE2"; 
var THEME_C64    = "C64";

//================================
// Below defined for LocalStorage
//================================

var STORAGE_LASTPLAY_MODE = "loderunner_lastplay";

var STORAGE_CLASSIC_INFO = "loderunner_classicInfo";

var STORAGE_MODERN_INFO = "loderunner_modernInfo";

var STORAGE_DEMO_INFO = "loderunner_demoInfo";

var STORAGE_FIRST_PLAY  = "loderunner_firstRun";

var STORAGE_MODERN_SCORE_INFO = "loderunner_modernScore";

var STORAGE_USER_INFO = "loderunner_userInfo"; //user created 
var STORAGE_USER_SCORE_INFO = "loderunner_userScore"; //user created

var STORAGE_EDIT_INFO = "loderunner_editInfo";

var STORAGE_USER_LEVEL = "loderunner_userLevel";
var STORAGE_TEST_LEVEL  = "loderunner_testlevel";

var STORAGE_HISCORE_INFO = "loderunner_hiScore";

var STORAGE_PLAYER_NAME = "loderunner_player";
var STORAGE_UID = "loderunner_uid";

var STORAGE_THEME_MODE = "loderunner_theme";
var STORAGE_THEME_COLOR = "loderunner_color_";

var STORAGE_REPEAT_ACTION = "loderunner_actRepeat";
var STORAGE_GAMEPAD_MODE = "loderunner_gamepadMode";
