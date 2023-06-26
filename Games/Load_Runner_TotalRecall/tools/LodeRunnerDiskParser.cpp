/**********************************************************************************
Read Lode Runner APPLE-II DISK IMAGE to extract all levels

Each level is a 28x16 tiles, Lode Runner has 8 different tile types. 
Two additional tiles are used to represent the player and guard start positions.
(reference : http://baetzler.de/c64/games/loderunner/)

APPLE-II DISK data format:

Since there are less than 16 different tiles, it is both convenient and 
efficient to store tiles as nibbles instead of bytes. 
Thus the 448 tiles of a Lode Runner level can be represented in 224 (0xE0) bytes

The tile data for each level use 256 bytes (0x00 ~ 0xFF), 
level data starts at offset 0x00 to 0xDF, and reserved 0x20 bytes.
(0x00 ~ 0xDF + 0x20 = 0x100 (256) bytes) 

The tiles are stored in left-to-right, to-to-bottom order, 
with a small twist: the low nibble of each byte encodes the left tile 
and the high nibble encodes the right tile in each byte of data. 

level start from disk offset 0x3000,

Lode Runner Level value to map (10 different types):

value | Character | Type
------+-----------+-----------
  0x0 |  <space>  | Empty space
  0x1 |     #     | Normal Brick
  0x2 |     @     | Solid Brick
  0x3 |     H     | Ladder
  0x4 |     -     | Hand-to-hand bar (Line of rope)
  0x5 |     X     | False brick
  0x6 |     S     | Ladder appears at end of level
  0x7 |     $     | Gold chest
  0x8 |     0     | Guard
  0x9 |     &     | Player	


2014/10/18 add support dump Revenge_of_Lode_Runner disk
2014/10/18 add support c64 codes
**********************************************************************************/

#include <stdio.h>

#define MAX_TILE_TYPE (sizeof(tileType)/sizeof(char))
#define MAX_LEVEL_ROW (16)
#define MAX_LEVEL_COL (28)

#define READ_LEVEL_DATA_SIZE (256)
#define ONE_LEVEL_DATA_SIZE (224)

#define PLAYER_ID (0x09)

//#define APPLE_DISK_NO (5)
#define C64_DISK_NO (1)

#ifdef APPLE_DISK_NO //APPLE-II

	#define MAP_START_POSITION (0x3000L)

	#if (APPLE_DISK_NO == 1)
	
		#define FILE_NAME "./apple2.dsk/Lode_Runner_Apple-II.dsk"
		#define MAX_LEVEL (150)
		#define TITLE_NAME "Classic Lode Runner (Apple-II 1983)"
		#define DATA_VAR_NAME "classicLevelData"

	#elif (APPLE_DISK_NO == 2)

		#define FILE_NAME "./apple2.dsk/Lode_Runner_Championship _Apple-II.dsk"
		#define MAX_LEVEL (50)
		#define TITLE_NAME "Championship Lode Runner (Apple-II 1984)"
		#define DATA_VAR_NAME "champLevelData"

	#elif (APPLE_DISK_NO == 3)

		#define FILE_NAME "./apple2.dsk/Revenge_of_Lode_Runner.dsk"
		#define MAX_LEVEL (25)
		#define TITLE_NAME "Revenge of Lode Runner (Apple-II 1986)"
		#define DATA_VAR_NAME "revengeLevelData"

	#elif (APPLE_DISK_NO == 4)

		#define FILE_NAME "./apple2.dsk/Lode Runner Fan Book (4 Levels).do"
		#define MAX_LEVEL (4)
		#define TITLE_NAME "Lode Runner Fan Book (4 levels)"
		#define TITLE_NOTES "Image got from: http://ww3.tiki.ne.jp/~maclr/lr/lr.html"
		#define DATA_VAR_NAME "fanBookLevelData"
		
	#elif (APPLE_DISK_NO == 5)	
	
		#define FILE_NAME "./apple2.dsk/MYLODE.DSK"
		#define MAX_LEVEL (54)
		#define TITLE_NAME "Peter Ferrie's My Lode"
		#define TITLE_NOTES "Image got from: http://pferrie.host22.com/misc/appleii.htm"
		#define DATA_VAR_NAME "FerrieLevelData"

	#endif

#elif defined C64_DISK_NO //C64

	#define MAP_START_POSITION (0x2A00L)

	#define START_GOOD_BYTE  0x0D
	#define START_SKIP_BYTE1 0x4B

	#if (C64_DISK_NO == 1)

		#define FILE_NAME "./C64.dsk/Professional Lode Runner (1985)(Dodosoft).fixed.d64"
		
		//#define FILE_NAME "./C64.dsk/LODERUNNER[amg].fix.D64"
		
		//#define FILE_NAME "./C64.dsk/Lode Runner (1983)(Broderbund).d64"
		#define START_ALL_ISGOOD 1

		#define MAX_LEVEL (200)
		#define TITLE_NAME "Lode Runner I (C64)"
		#define DATA_VAR_NAME "c64ver1"

	#elif (C64_DISK_NO == 2)

		#define FILE_NAME "./C64.dsk/LODERUN2.D64"
		
		#define MAX_LEVEL (21)
		#define TITLE_NAME "Lode Runner II (C64)"
		#define DATA_VAR_NAME "c64ver2"

	#elif (C64_DISK_NO == 3)
	
		#define FILE_NAME "./C64.dsk/Atlantis Lode Runner (19xx)(-)[cr TBC].d64"
		
		#define START_SKIP_BYTE2 0x48
		#define START_SKIP_BYTE3 0x4D     //Level 140: BAD SECTOR
		
		#define MAX_LEVEL (150)
		#define TITLE_NAME "Atlantis Lode Runner (C64)"
		#define DATA_VAR_NAME "c64Atlantis"
	
	#elif (C64_DISK_NO == 4)

		#define FILE_NAME "./C64.dsk/LODERUN4.D64"
		#define MAX_LEVEL (200)
		#define TITLE_NAME "Lode Runner IV (C64)"
		#define DATA_VAR_NAME "c64ver4"

	#elif (C64_DISK_NO == 5)

		#define FILE_NAME "./C64.dsk/LODERUN5.D64"
		#define MAX_LEVEL (200)
		#define TITLE_NAME "Lode Runner V (C64)"
		#define DATA_VAR_NAME "c64ver5"
		
	#elif (C64_DISK_NO == 6)
	
		#define FILE_NAME "./c64.dsk/Lode Runner (1983)(Broderbund).d64"
		
		#define START_ALL_ISGOOD 1
		#define START_SKIP_BYTE2 0x02
		#define START_SKIP_BYTE3 0x03
		
		#define MAX_LEVEL (176)
		#define TITLE_NAME "Lode Runner Fans version (C64)"
		#define DATA_VAR_NAME "c64Fans"
		
	#elif (C64_DISK_NO == 7)
	
		#define FILE_NAME "./C64.dsk/LODERUN_CHAMP(FF).D64"
		
		#define START_ALL_ISGOOD 1
		#define DATA_XOR_VALUE   0xFF
		
		#define MAX_LEVEL (50)
		#define TITLE_NAME "Championship Lode Runner (C64)"
		#define DATA_VAR_NAME "c64Champ"
		
	#endif

#else  //Error

	#error Please define "APPLE_DISK_NO" or "C64_DISK_NO"
	
#endif 

char tileType[] = {
	' ', //0x00: Empty space
	'#', //0x01:Normal Brick
	'@', //0x02:Solid Brick
	'H', //0x03:Ladder
	'-', //0x04:Hand-to-hand bar (Line of rope)
	'X', //0x05:False brick
	'S', //0x06:Ladder appears at end of level
	'$', //0x07:Gold chest
	'0', //0x08:Guard
	'&'  //0x09:Player	
};

int allZero(unsigned char *levelData)
{
	int i;
		
	for(i = 0; i < ONE_LEVEL_DATA_SIZE; i++) {
		if(levelData[i]) return 0;
	}
	return 1; //all zero
}

int goodLevel(unsigned char *levelData)
{
	int i;
	unsigned char leftTile, rightTile;
	int allZero = 1;
	int playerNo = 0; 
	
		
	for(i = 0; i < ONE_LEVEL_DATA_SIZE; i++) {
#ifdef DATA_XOR_VALUE		
		levelData[i] = levelData[i] ^ DATA_XOR_VALUE;
#endif		
		leftTile = levelData[i] & 0xF;
		rightTile = levelData[i] >> 0x04;
		if(leftTile >= MAX_TILE_TYPE || rightTile >= MAX_TILE_TYPE) {
			return 0;
		}
		if(leftTile == PLAYER_ID) playerNo++;
		if(rightTile == PLAYER_ID) playerNo++;
		
		if(leftTile != 0 || rightTile != 0) allZero = 0;
	}
	if(playerNo != 1) return 0;
	return !allZero;
	return 1; //OK
}

void dumpTitle(void)
{
	printf("//************************************************************\n");
	printf("//* All levels extract from: \n");
	printf("//* %s DISK IMAGE\n",TITLE_NAME );
#ifdef TITLE_NOTES
	printf("//* %s\n",TITLE_NOTES );
#endif	
	printf("//* by Simon Hung 2015/01/05\n");
	printf("//************************************************************\n\n");
}

void dumpLevel(int level, unsigned char *levelData)
{
	int row, col;
	unsigned char leftTile, rightTile;
	int offset = 0;
	
	printf("======<<< Level %03d >>>======\n\n", level);
	for(row = 0; row < MAX_LEVEL_ROW; row++){
		for(col = 0; col < MAX_LEVEL_COL; col+=2){ //one byte contains 2 tile
			leftTile = levelData[offset] & 0xF;
			rightTile = levelData[offset] >> 0x04;
			printf("%c%c",tileType[leftTile],tileType[rightTile]);
			offset++;			
		}
		printf("\n");
	}
	printf("\n");
}

void dumpLevel4JavaScript(int level, unsigned char *levelData)
{
	int row, col;
	unsigned char leftTile, rightTile;
	int offset = 0;
	
	printf("//======<<< Level %03d >>>======\n\n", level);
	for(row = 0; row < MAX_LEVEL_ROW; row++){
		printf("\"");
		for(col = 0; col < MAX_LEVEL_COL; col+=2){ //one byte contains 2 tile
			leftTile = levelData[offset] & 0xF;
			rightTile = levelData[offset] >> 0x04;
			printf("%c%c",tileType[leftTile],tileType[rightTile]);
			offset++;			
		}
		if(row < MAX_LEVEL_ROW-1)printf("\" +\n");
		else if (level < MAX_LEVEL)printf("\",\n");
		     else printf("\"\n");
	}
	printf("\n");
}



int main(void)
{
	FILE *fp;
	unsigned char levelBuf[READ_LEVEL_DATA_SIZE];
	unsigned char *levelData;
	int curLevel = 0;
	int readSize= 0, isGood = 1;
	unsigned long curPos = MAP_START_POSITION;
	unsigned long dspPos = curPos;
	
	if((fp = fopen(FILE_NAME, "rb")) ==NULL) {
		printf("Open file \"%s\" failed !\n", FILE_NAME);
		return 1;
	}
	
	if(fseek(fp, curPos, SEEK_SET) != 0) {
		printf("Fseek error ! @%d\n", __LINE__);
		fclose(fp);
		return 1;
	}

	dumpTitle();

	printf("var %s = [\n", DATA_VAR_NAME);	

	while(
#ifndef START_ALL_ISGOOD	
		   isGood &&
#endif
		   curLevel < MAX_LEVEL && 
	       (readSize = fread(levelBuf, sizeof(char), READ_LEVEL_DATA_SIZE, fp)) ==  READ_LEVEL_DATA_SIZE 
	){
		levelData = levelBuf;	
#ifdef START_GOOD_BYTE
		unsigned char startByte = *(levelData++);
		
		switch(startByte) {
		case START_SKIP_BYTE1:
#ifdef START_SKIP_BYTE2			
		case START_SKIP_BYTE2:
#endif			
#ifdef START_SKIP_BYTE3
		case START_SKIP_BYTE3:
#endif			
#ifdef START_SKIP_BYTE4
		case START_SKIP_BYTE4:
#endif			
			//printf("SKIP0 - %x\n", dspPos);
			break;
		case 0:	 //good if not allzero
			if(allZero(levelData)){
				//printf("SKIP1 - %x\n", dspPos);
				break;
			}
#ifdef START_ALL_ISGOOD			
		default:	
#endif		
		case START_GOOD_BYTE:
#endif	       
			if((isGood = goodLevel(levelData))) {
				//dumpLevel(++curLevel, levelData);
				//printf("%x", dspPos);
				dumpLevel4JavaScript(++curLevel, levelData);
			}
#ifdef START_GOOD_BYTE
			break;
#ifndef START_ALL_ISGOOD
		default:
			isGood = 0;
			printf("%x", dspPos);
			break;
#endif			
		}
#endif	
		dspPos += READ_LEVEL_DATA_SIZE;
	}
	printf("];\n");
	
	fclose(fp);	
}
