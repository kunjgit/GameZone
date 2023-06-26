#include <stdio.h>
#include <string.h>

#define WORD unsigned __int16
#define BYTE unsigned __int8

#define IMAGE_HEAD_SIZE 0x70
#define IMAGE_HEAD_STRING "Lode Runner Puzzle Set"

#define PZL_SIZE_ADDR (6)

#define PZL_HEAD_SIZE  (8)
#define PZL_TITLE_SIZE (256)

#define MAX_LAYERS   (14)
#define LAYER_X_SIZE (30)
#define LAYER_Y_SIZE (18)
#define ONE_LAYER_SIZE   (LAYER_X_SIZE*LAYER_Y_SIZE)
#define TOTAL_LAYER_SIZE (MAX_LAYERS * ONE_LAYER_SIZE)

#define PZL_MAX_COMP_SIZE (PZL_HEAD_SIZE + PZL_TITLE_SIZE + TOTAL_LAYER_SIZE) //assume

#define PZL_FULL_SIZE (7923)
#define TEST_BYTE_VALUE (0xF5)

#define	TILE_Y_MIN (1)
#define TILE_Y_MAX (16)

#define LAYER_FIRST_ID (1)
#define LAYER_LAST_ID  (14)

#define BUFFER_BASE (0x122)
#define LAYER_STEP (540) //30*18
#define	LAYER_ZERO (BUFFER_BASE - LAYER_STEP) 
#define LAYER_Y_INC (18)

#define getTitle()  (pzlBuf + PZL_HEAD_SIZE)
#define PZL_FIRST_OFFSET (291)
#define PZL_LAST_OFFSET (7849)

#define TEXT_LINE_SIZE (16)

const char *layerName[] = {
	"Layer 1: Tool Class",
	"Layer 2: Tool Subclass",
	"Layer 3: Unknown",
	"Layer 4: Unknown",
	"Layer 5: Transporter Destination X",
	"Layer 6: Transporter Destination Y",
	"Layer 7: Tool Hooks",
	"Layer 8: Turf Class",
	"Layer 9: Turf Subclass",
	"Layer 10: Turf Appearance",
	"Layer 11: Unknown",
	"Layer 12: Unknown",
	"Layer 13: Door levels > 255",
	"Layer 14: Turf Hooks"
};

int checkHead(FILE *fp)
{
	BYTE headBuf[IMAGE_HEAD_SIZE];
	int nRead;

	if( (nRead = fread (headBuf,sizeof(BYTE), sizeof(headBuf), fp)) != IMAGE_HEAD_SIZE) {
		printf("Read head failed (%d)\n", nRead);
		return 1;
	}
	if(strncmp(IMAGE_HEAD_STRING, (char*) headBuf, sizeof(IMAGE_HEAD_STRING)-1) != 0) {
		printf("Bead Head String\n");
		return 1;
	}
	return 0;
}

BYTE pzlBuf[PZL_FULL_SIZE+1]; //one byte for check

int pzlDecompress(BYTE *pzlCompBuf, int pzlCompSize)
{
	int error = 0;
	int bufIdx, compIdx;
	enum decompState { getCmd, getStringCnt, decompEnd, doRepeat, doString };

	memset(pzlBuf, TEST_BYTE_VALUE, PZL_FULL_SIZE+1);	
	//pzlBuf[PZL_FULL_SIZE-1] = TEST_BYTE_VALUE;
	//pzlBuf[PZL_FULL_SIZE] = TEST_BYTE_VALUE;
	
	//copy pzl header to pzl buffer
	memcpy(pzlBuf, pzlCompBuf, PZL_HEAD_SIZE);
	bufIdx = PZL_HEAD_SIZE;
	
	decompState state = getCmd;
	for(compIdx = PZL_HEAD_SIZE; !error && compIdx < pzlCompSize; compIdx++)
	{
		BYTE c = pzlCompBuf[compIdx];
		BYTE copyCnt;
		
		switch (state) {
		case getCmd:
			switch(c) {
			case 0x00:
				state = decompEnd;
				break;
			case 0xFF:
				state =  getStringCnt; //copy string mode
				break;
			default: 
				state = doRepeat; //repeat mode
				copyCnt = c; //	
				break;
			}
			break;
		case getStringCnt:	
			if (c < 1) { 
				//return 1;
				state = getCmd;
			} else { 
				state = doString;
				copyCnt = c;
				if (compIdx + copyCnt >= PZL_FULL_SIZE)
					error = 1;
			}
			break;
		case decompEnd:
			pzlBuf[bufIdx++] = 0;
			error = 1;
			break;
		case doString:
			pzlBuf[bufIdx++] = c;
			if(--copyCnt <= 0) state = getCmd;
			break;		
		case doRepeat:
			if (bufIdx + copyCnt >= PZL_FULL_SIZE) {
				error = 1;
			} else {
				while(copyCnt--) pzlBuf[bufIdx++] = c;
				state = getCmd;
			}
			break;
		}
	}
	if(state == decompEnd) error = 0;
	if(error || pzlBuf[PZL_FULL_SIZE] != TEST_BYTE_VALUE) {
		//buffer overrun
		printf("Error: Buffer overrun !\n");
		return 1;
	}
	return 0;
}

void dspArray(int idx, int len)
{
	int i, j;
	
	for (i = 0; i < len; i += TEXT_LINE_SIZE) {
		int offset = idx + i;
		printf("%4d:  ", offset);
		for (j = 0; j < TEXT_LINE_SIZE; j++) {
			if (i + j < len)
				printf("%4d",  (int) pzlBuf[idx + i + j]);
			else
				printf("    ");
		}
		printf("  ");
		for (j = 0; j < TEXT_LINE_SIZE; j++) {
			char ch =  pzlBuf[idx + i + j];
			if (i + j < len) {
				if (ch >= ' ' && ch < 127)
					printf("%c ", ch);
				else
					printf(". ");
			}
		}
		printf("\n");
	}
	printf("\n\n");
}

int getTile(int x, int y, int layer)
{
	if (x < 0 || x > 29 || y < 0 || y > 18 || layer < LAYER_FIRST_ID || layer > LAYER_LAST_ID)
		return -1;

	int idx = LAYER_ZERO + layer * LAYER_STEP + x * LAYER_Y_INC + y;
	
	return pzlBuf[idx];
}

void dspLayerArray(int layer)
{
	int tile;
	printf("%s\n", layerName[layer-1]);
	printf("  ");
	for (int x = 1; x < 29; x++) printf("%4d", x);
	printf("\n");
	
	for (int y = TILE_Y_MIN; y <= TILE_Y_MAX; y++) 	{
		printf("%2d", y);
		for (int x = 1; x < 29; x++) {
			tile = getTile(x, y, layer);
			if(tile) printf("%4d", tile);
			else printf("    ");
		}
		printf("\n");
	}
	printf("\n\n");
}

void displayTextPzl(int pzlNumber)
{
	// write puzzle title
	printf("Puzzle %d, Title:\n%s\n\n"
		"Edited data must have the same number of bytes in each line or an error\n"
		"will occur.  Edited data values have a range from 0-255.  Use 0xNN format\n"
		"for hexadecimal values.  All lines must have the same content.  Extra carrage\n"
		"returns or deleted comments will cause an error.  Data in layers is\n"
		"deconvoluted for easier interpretation.  NotePad or an editor using a constant\n"
		"courier type will be more easily readable than an editor using a variable pitch\n"
		"font.  An error message on the first error detected will be given.  Subsequent\n"
		"errors will be shown after all previous errors are corrected.  The first row\n"
		"and column of the layers are the row and column numbers.  Some data is mondified\n"
		"when the puzzle file is saved.\n\n"
		"Puzzle Header: 8 consisting of:\n"
		"Two bytes compressed length (modified by this program)\n"
		"Two bytes zeros\n"
		"Two bytes puzzle number (modified by this program on save file)\n"
		"Two bytes which always seem to be 1 and 0\n"
		"Puzzle title block 256 bytes or so\n"
		"Sixteen bytes unknown.\n"
		"This is then followed by layer 1\n\n", pzlNumber, getTitle());

	// write Puzzle title block
	dspArray(0, PZL_FIRST_OFFSET - 1);

	// write puzzle sets
	/*
	for (int layer = 1; layer <= 14; layer++)
		dspLayerArray(layer);
	*/	
	dspLayerArray(1);
	dspLayerArray(2);
	dspLayerArray(8);
	dspLayerArray(9);
	dspLayerArray(10);

	printf("\n"
		"Player data: consists of data for Jake and Wes followed by data for monks.\n"
		"Most of this data is accessable through the player editor.\n\n");
		
	dspArray(PZL_LAST_OFFSET + 1, PZL_FULL_SIZE - PZL_LAST_OFFSET);
}

//value | Character | Type
//------+-----------+-----------
//  0x0 |  <space>  | Empty Space  ==> No Truf     (Layer 8, Layer 9) = (0,0)
//  0x1 |     #     | Normal Brick ==> Turf        (Layer 8, Layer 9) = (1,1)
//  0x2 |     @     | Solid Brick  ==> Bedrock     (Layer 8, Layer 9) = (1,2)
//  0x3 |     H     | Ladder       ==> Ladder      (Layer 8, Layer 9) = (5,1)
//  0x4 |     -     | Bar          ==> Bar         (Layer 8, Layer 9) = (6,1)
//  0x5 |     X     | False Brick  ==> Trap Truf   (Layer 8, Layer 9) = (2,6)
//  0x6 |     S     | Exit Ladder  ==> Exit ladder (Layer 8, Layer 9) = (5,2)
//  0x7 |     $     | Gold         ==> Coin        (Layer 1, Layer 2) = (4,1)
//  0x8 |     0     | Guard 
//  0x9 |     &     | Player

#define CLASSIC_MAP_X_SIZE (28)
#define CLASSIC_MAP_Y_SIZE (16)
#define CLASSIC_MAP_SIZE (CLASSIC_MAP_X_SIZE * CLASSIC_MAP_Y_SIZE);

BYTE mapClassic[CLASSIC_MAP_X_SIZE][CLASSIC_MAP_Y_SIZE];

#define CLASSIC_TILE_EMPTY       (' ')
#define CLASSIC_TILE_BRICK       ('#')
#define CLASSIC_TILE_SOLID       ('@')
#define CLASSIC_TILE_LADDER      ('H')
#define CLASSIC_TILE_BAR         ('-')
#define CLASSIC_TILE_TRAP        ('X')
#define CLASSIC_TILE_EXIT_LADDER ('S')
#define CLASSIC_TILE_GOLD        ('$')
#define CLASSIC_TILE_GUARD       ('0')
#define CLASSIC_TILE_RUNNER      ('&')

#define RUNNER_CNT_ADDR  (0x1eaa) //7850
#define RUNNER_BASE_ADDR (0x1eac)
#define RUNNER_ENABLE_OFFSET (0)
#define RUNNER_DATA_OFFSET   (1)
#define RUNNER_X_OFFSET      (2)
#define RUNNER_Y_OFFSET      (3)
#define RUNNER_STEP_SIZE     (4)

#define GUARD_CNT_ADDR  (0x1eb4) //7860
#define GUARD_BASE_ADDR (0x1eb5)
#define GUARD_DATA1_OFFSET  (0)
#define GUARD_ENABLE_OFFSET (1)
#define GUARD_DATA2_OFFSET  (2)
#define GUARD_DOOR_OFFSET   (3)
#define GUARD_X_OFFSET      (4)
#define GUARD_Y_OFFSET      (5)
#define GUARD_STEP_SIZE     (6)

int mapClassicAddGuy()
{
	BYTE *runnerBase = pzlBuf + RUNNER_BASE_ADDR;
	int runnerCnt = *(pzlBuf+RUNNER_CNT_ADDR);
	BYTE runnerX, runnerY;
	
	BYTE *guardBase = pzlBuf + GUARD_BASE_ADDR;
	int guardCnt = *(pzlBuf + GUARD_CNT_ADDR);
	BYTE guardX, guardY;
	
	
	if(runnerCnt != 1) {
		printf("Error: runner count != 1 (%d)\n", runnerCnt);
		return 1;
	}
	
	for (int i = 0; i < 2; i++) {
		if( !*(runnerBase + RUNNER_ENABLE_OFFSET))  {
			runnerBase += RUNNER_STEP_SIZE;
			continue;
		}
		runnerX = *(runnerBase + RUNNER_X_OFFSET);
		runnerY = *(runnerBase + RUNNER_Y_OFFSET);
		if(runnerX < 1 || runnerX > CLASSIC_MAP_X_SIZE) {
			printf("Error: wrong runnerX value (%d)\n", runnerX);
			return 1;
		}
		if(runnerY < 1 || runnerY > CLASSIC_MAP_Y_SIZE) {
			printf("Error: wrong runnerY value (%d)\n", runnerY);
			return 1;
		}
		if(mapClassic[runnerX-1][runnerY-1] != CLASSIC_TILE_EMPTY) {
			if(runnerY == 1 && getTile(runnerX, runnerY, 8) == 8) {
				mapClassic[runnerX-1][runnerY-1] = CLASSIC_TILE_RUNNER;
			} else {
				printf("Error runner position already has value exist (%d, %d)\n", runnerX, runnerY);
			}
			//return 1;
		} else {
			mapClassic[runnerX-1][runnerY-1] = CLASSIC_TILE_RUNNER;
		}	
		break;
	}	

	for(int i = 1; i <= guardCnt; i++) {
		guardX = *(guardBase + GUARD_X_OFFSET);
		guardY = *(guardBase + GUARD_Y_OFFSET);
		if(guardX < 1 || guardX > CLASSIC_MAP_X_SIZE) {
			//printf("Error: wrong guardX value (%d)\n", guardX);
			continue;
		}
		if(guardY < 1 || guardY > CLASSIC_MAP_Y_SIZE) {
			//printf("Error: wrong guardY value (%d)\n", guardY);
			continue;
		}
		if(mapClassic[guardX-1][guardY-1] != CLASSIC_TILE_EMPTY) {
			if(guardY == 1 && getTile(guardX, guardY, 8) == 8) {
				mapClassic[guardX-1][guardY-1] = CLASSIC_TILE_GUARD;
			} else {
				printf("Error guard position already has value exist (%d, %d)\n", guardX, guardY);
			}
		} else {
			mapClassic[guardX-1][guardY-1] = CLASSIC_TILE_GUARD;
		}	
		guardBase += GUARD_STEP_SIZE;;
	}
	return 0;
}

int online2Classic(int pzlNumber)
{
	//memset(mapClassic, CLASSIC_TILE_EMPTY, CLASSIC_MAP_SIZE); 
	printf("//======<<< Level %03d >>>======\n\n", pzlNumber);
	
	//(1) Set Turf
	for(int x=1; x <= CLASSIC_MAP_X_SIZE; x++) {
		for(int y=1; y <= CLASSIC_MAP_Y_SIZE; y++) {
			int layer8 = getTile(x, y, 8);
			int layer9 = getTile(x, y, 9);
			int id = layer8 * 10 + layer9;
			
			switch(id) {
			case  0: //empty
				mapClassic[x-1][y-1] = CLASSIC_TILE_EMPTY;
				break;				
			case 11: //normal brick
				mapClassic[x-1][y-1] = CLASSIC_TILE_BRICK;
				break;
			case 12: //solid brick
				mapClassic[x-1][y-1] = CLASSIC_TILE_SOLID;
				break;				
			case 51: //ladder
				mapClassic[x-1][y-1] = CLASSIC_TILE_LADDER;
				break;				
			case 61: //bar
				mapClassic[x-1][y-1] = CLASSIC_TILE_BAR;
				break;				
			case 26: //trap brick
				mapClassic[x-1][y-1] = CLASSIC_TILE_TRAP;
				break;				
			case 52: //end game ladder
				mapClassic[x-1][y-1] = CLASSIC_TILE_EXIT_LADDER;
				break;				
			default:
				if(layer8 == 8) {
					if(layer9 == 1 && y == 1 && getTile(x, y+1, 8) == 5 && getTile(x, y+1, 9) == 2) {
						//exit door (layer8=8, layer9=1) at top position and pos(x,y+1) = exit ladder (5,2)
						// set this tile as "exit ladder"
						mapClassic[x-1][y-1] = CLASSIC_TILE_EXIT_LADDER;
					} else {
						//exit door set as empty
						mapClassic[x-1][y-1] = CLASSIC_TILE_EMPTY;
					}
				} else {
					printf("Error: can not recognize tile, (lay8, lay9) = (%d, %d)\n",layer8, layer9); 
				}
				break;
			}
		}
	}
	//(2) Set Tool
	for(int x=1; x <= CLASSIC_MAP_X_SIZE; x++) {
		for(int y=1; y <= CLASSIC_MAP_Y_SIZE; y++) {
			int layer1 = getTile(x, y, 1);
			//int layer2 = getTile(x, y, 2);
			if(layer1 != 0) {
				if(mapClassic[x-1][y-1] != CLASSIC_TILE_EMPTY) {
					//skip
					//printf("Error: value exist (%d, %d)\n", x, y);
				} else {
					mapClassic[x-1][y-1] = CLASSIC_TILE_GOLD;
				}
			}
		}
	}
	
	//(3) Set Guy
	mapClassicAddGuy();
	
	//(4) dump level
	for(int y=0; y < CLASSIC_MAP_Y_SIZE; y++) {
			printf("\"");
		for(int x=0; x < CLASSIC_MAP_X_SIZE; x++) {
			printf("%c", mapClassic[x][y]);
		}
		if(y < CLASSIC_MAP_Y_SIZE-1) printf("\" +\n");
		else printf("\",");
	}
	printf("\n\n");
	
}

int dumpPuzzlLevel(FILE *fp)
{
	WORD pzlHeader[4];
	BYTE pzlCompBuf[PZL_MAX_COMP_SIZE];
	int pzlCompSize, nRead;

	if((nRead = fread(pzlHeader, 1, sizeof(pzlHeader), fp ) )!= sizeof(pzlHeader)) {
		if(nRead == 0) {
			//printf("End of File !!!\n");
		} else {
			printf("Read puzzle head failed !\n");
		}
		return 1;
	}

	pzlCompSize = pzlHeader[0] + PZL_SIZE_ADDR; //include header size
	
	if(	pzlCompSize < 100 || pzlCompSize > PZL_MAX_COMP_SIZE) {
		printf("Puzzle Size too short or too long (%d)\n", pzlCompSize);
		return 1;
	}
	if (pzlHeader[1] != 0) {
		printf("Puzzle wrong format (header[1] != 0) \n");
		return 1;
	}

	// copy the header to pzlBuf
	memcpy(pzlCompBuf, pzlHeader, sizeof(pzlHeader));
	
	// read puzzle body (skip header)
	if(fread(pzlCompBuf+sizeof(pzlHeader), 1, pzlCompSize - sizeof(pzlHeader), fp ) != (pzlCompSize - sizeof(pzlHeader))) {
		printf("Read puzzle body failed !\n");
		return 1;
	}
	
	// check for final byte to be a zero
	if (pzlCompBuf[pzlCompSize - 1] != 0)
	{
		printf("Puzzle body final byte != 0, failed !\n");
		return 1;
	}	
	
	if (pzlDecompress(pzlCompBuf, pzlCompSize) == 0) {
		//displayTextPzl(pzlHeader[2]);
		online2Classic(pzlHeader[2]);
		return 0;
	}
	
	return 1;
}

void dumpAllLevels(FILE *fp)
{
	printf("//************************************************************\n");
	printf("//* All levels extract from: \n");
	printf("//* CGW \n");
	printf("//* by Simon Hung 2015/01/14\n");
	printf("//************************************************************\n");

	printf("\nvar spoonbill = [\n");
	while(dumpPuzzlLevel(fp) == 0);
	printf("];\n");
}

void usage(char *fileName)
{
	printf("%s <Lode Runner *.pzl file>\n", strrchr(fileName,'\\')+1 );
}

int main(int argc, char *argv[])
{
	FILE *fp; 
	
	if(argc < 2) {
		usage(argv[0]);
		return 1;
	} 
	
	if((fp = fopen(argv[1], "rb")) == NULL) {
		printf("Open file %s failed \n", argv[1]);
		return 1;
	}
	
	//(1) check head
	if(checkHead(fp))return 1; //failed
	
	//(2) read puzzle block
	dumpAllLevels(fp);
	//dumpPuzzlLevel(fp);
	//dumpPuzzlLevel(fp);
}
