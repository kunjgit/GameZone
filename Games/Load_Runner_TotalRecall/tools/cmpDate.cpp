/**************************************************
compare two files modify date
if file1 > file2 return > 0
if file1 <= file 2 return < 0
if error return = 0
***************************************************/
#include <stdio.h>
#include <errno.h>
//#include <string.h>

#include <time.h>
 
#include <sys/types.h>
#include <sys/stat.h>
 
 
 
int main ( int argc, char *argv[])
{
    struct stat fileAttrib1, fileAttrib2;
    struct tm *pTm1, *pTm2;
    time_t time1, time2;
    double seconds;
 
    if (argc != 3) {
    	printf("Usage: %s <file1> <file2>\n", argv[0]);
    	printf("compare <file1> <file2> modify date \n");
    	return(0);
    }
	if (stat(argv[1], &fileAttrib1) < 0) {
		printf("Get File (%s) attribute error, Message = %s\n", argv[1], strerror(errno));
		return (0);
	}
	if (stat(argv[2], &fileAttrib2) < 0) {
		printf("Get File (%s) attribute error, Message = %s\n", argv[2], strerror(errno));
		return (0);
	}

	pTm1 = gmtime(&fileAttrib1.st_mtime);
	time1 = mktime( pTm1 );
	
	pTm2 = gmtime(&fileAttrib2.st_mtime);
	time2 = mktime( pTm2 );

	//printf("time1 = %ld, time2 = %ld\n", time1, time2);
	seconds = difftime(time1,time2);
	
	//printf("seconds = %.f\n", seconds);
    return (seconds>0?1:-1);
}
