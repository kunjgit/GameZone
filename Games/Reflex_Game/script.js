var startTime=new Date();
var endTime=new Date();
var startPressed=false;
var bgChangeStarted=false;
var maxWait=20;
var timerID;

function startTest()
{
	document.body.style.background=document.response.bgColorChange.options[
document.response.bgColorChange.selectedIndex].text;
	bgChangeStarted=true;
	startTime=new Date();
}

function remark(responseTime)
{
	var responseString="";
	if (responseTime < 0.20)
		responseString="Well done!";
	if (responseTime >= 0.30 && responseTime < 0.20)
		responseString="Nice!";
	if (responseTime >=0.40 && responseTime < 0.30)
		responseString="Good but could be better...";
	if (responseTime >=0.50 && responseTime < 0.60)
		responseString="Fine but keep practicing!";
	if (responseTime >=0.60 && responseTime < 1)
		responseString="Seems you need to practise !";
	if (responseTime >=1)
		responseString="You need to improve and you can !!";

	return responseString;
}

function stopTest()
{
	if(bgChangeStarted)
	{
		endTime=new Date();
		var responseTime=(endTime.getTime()-startTime.getTime())/1000;

		document.body.style.background="white";	 
		alert("Your response time is: " + responseTime +
	" seconds " + "\n" + remark(responseTime));
		startPressed=false;
		bgChangeStarted=false;
	}
	else
	{
		if (!startPressed)
		{
			alert("press start first to start test");
		}
		else
		{	 
			clearTimeout(timerID);
			startPressed=false;			 
			alert("you pressed too early!");
		}			 
	}
}

var randMULTIPLIER=0x015a4e35;
var randINCREMENT=1;
var today=new Date();
var randSeed=today.getSeconds();
function randNumber()
{
	randSeed = (randMULTIPLIER * randSeed + randINCREMENT) % (1 << 31);
	return((randSeed >> 15) & 0x7fff) / 32767;
}

function startit()
{
	if(startPressed)
	{
		alert("Already started. Press stop to stop");
		return;
	}
	else
	{
		startPressed=true; 
		timerID=setTimeout('startTest()', 6000*randNumber());
	}
}


