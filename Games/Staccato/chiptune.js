
var notes2 = [0];
for (var i=5; i<64; ++i) notes2.push(55*Math.pow(2, i/12));

	// C3, C#3, D3, d#3, E3, F3, F#3, G3, G#3, a3, a#3, b3, c4, c5, c6, c7
	//  0   1    2   3    4  5   6    7   8    9   10   11, 12, 24, 36, 48

	var leaddata2 = [0, 0, 
					 34, 20, 36, 6, 37, 6, 39, 16, 37, 4, 36, 8, 34, 2, 32, 2, //64
	                 34, 48, 29, 4, 27, 8, 25, 2, 24, 2,	// 64
					 25, 20, 25, 6, 30, 6, 32, 16, 32, 8, 36, 8,	// 64
					 37, 64,	// 64
					 // pattern 2
					 49, 4, 48, 2, 46, 2, 49, 4, 48, 2, 46, 2, 49, 4, 48, 2, 46, 2, 49, 4, 48, 2, 46, 2, 49, 4, 48, 2, 46, 2, 49, 4, 48, 2, 46, 2, 49, 4, 48, 2, 46, 2, 49, 2, 51, 6, //64
					 49, 4, 48, 2, 46, 46, 37, 6, 34, 6, // 64
					 34, 8, 34, 4, 30, 16, 25, 2, 30, 2, 32, 16, 27, 4, 27, 8, 25, 2, 24, 2, // 64
					 26, 28, 34, 3, 34, 3, 34, 3, 34, 3, 34, 3, 34, 9, 37, 4, 36, 8, //64
					 // pattern 4
					 34, 2, 32, 2, 34, 20, 36, 6, 37, 6, 39, 16, 37, 4, 36, 8, //64
					 34, 2, 32, 2, 34, 48, 29, 4, 27, 8, //64
					 25, 2, 24, 2, 25, 20, 25, 6, 30, 6, 32, 16, 32, 8, // 60
					 36, 8, 37, 60, // 68
					 // pattern 6
					 0,256,
					 // pattern 8
					 34, 4, 34, 4, 36, 2, 37, 2, 37, 4, 36, 4, 32, 2, 34, 4, 37, 6, 37, 4, 37, 4, 39, 2, 41, 2, 41, 4, 39, 2, 36, 6, 32, 2, 36, 2, 27, 2, 29, 6, // 68
					 34, 4, 34, 2, 37, 2, 32, 2, 34, 12, 37, 2, 36, 2, 37, 2, 39, 4, 41, 4, 44, 2, 41, 2, 41, 2, 48, 6, 46, 4, 44, 2, 39, 2, 41, 2, 46, 6, // 64
					 34, 4, 34, 2, 34, 2, 32, 2, 34, 12, 34, 10, 34, 4, 34, 2, 36, 2, 32, 2, 34, 12, 36, 10, //64
					 34, 4, 34, 2, 34, 2, 32, 2, 34, 12, 34, 10, 34, 4, 36, 2, 36, 2, 37, 2, 39, 4, 36, 2, 32, 2, 27, 2, 29, 2, 25, 2, 34, 2, 30, 6, // 64
					 // pattern 10 (17,19)
					 25, 4, 25, 4, 25, 4, 25, 4, 25, 2, 30, 14, 24, 4, 24, 4, 24, 4, 24, 4, 24, 2, 29, 14,
					 22, 4, 22, 4, 22, 4, 22, 4, 22, 2, 27, 10, 21, 4, 29, 2, 24, 4, 33, 2, 29, 4, 29, 2, 33, 4, 39, 2, 33, 2, 39, 2, 33, 2, 33, 2, // 60
					 34, 4, 34, 4, 36, 2, 37, 2, 37, 4, 36, 4, 32, 2, 34, 4, 37, 6, 37, 4, 37, 4, 39, 4, 41, 4, 39, 2, 36, 6, 27, 2, 36, 2, 27, 2, 29, 6, //68
					 34, 4, 34, 2, 37, 2, 32, 2, 34, 12, 37, 2, 36, 2, 37, 2, 39, 4, 41, 4, 44, 4, 41, 2, 48, 6, 46, 4, 44, 2, 39, 2, 41, 2, 46, 6, // 64
					 // pattern 12 (bass only)
					 0,256
					 ];

var leads = [
{ ptr:0, timer:1, osc:0 },
{ ptr:0, timer:0x401, osc:1601 }
];

function voice_lead2(i, voice_nr)
{	
	leads[voice_nr].timer--;

	if (0 == leads[voice_nr].timer) {
		leads[voice_nr].ptr+=2;
		leads[voice_nr].timer = 0x200*leaddata2[leads[voice_nr].ptr+1];
	}
					 
	
	var melody = leaddata2[leads[voice_nr].ptr];

	if (melody) {
		leads[voice_nr].osc += notes2[melody-12];
	} 
	
	var sample = ((leads[voice_nr].osc >> 7) & 0x3F) + ((leads[voice_nr].osc >> 7) & 0x1F);
	sample*=Math.exp(-.0002*(0x200*leaddata2[leads[voice_nr].ptr+1]-leads[voice_nr].timer));
	return sample ;
	
}

var arp_osc = 0;		   
function voice_arp2(i)
{
	// C3, C#3, D3, d#3, E3, F3, F#3, G3, G#3, a3, a#3, b3, c4, c5, c6, c7
	//  0   1    2   3    4  5   6    7   8    9   10   11, 12, 24, 36, 48

	var arpdata = [2, 0, 2, 0, 2, 0, 2, 0, 1, 1, 0, 1, 0, 1, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 1, 2, 0, 0, 4, 0,
				   2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0 ];
				   
	if ((i>>17)!=3)
		return 0;
	var arpptr = Math.min((i>>10)&63, arpdata.length-1);
	var arpnote = arpdata[arpptr];
	
	var note = notes2[47+arpnote+[0,4,7][(i>>7)%3]];
	arp_osc += arpnote?note:0;
	//return (arp_osc>>8)&127;
	return (arp_osc & (1 << 14)) ? 0 : 48;
}

var bassosc = 0, flangeosc = 0;
function voice_bass2(i)
{	// C3, C#3, D3, d#3, E3, F3, F#3, G3, G#3, a3, a#3, b3
	//  0   1    2   3    4  5   6    7   8    9   10   11
	var bassptr = (i>>10) & 0x7F;
	var note = notes2[12+[13, 6, 18, 6, 0, 6, 6, 18, 13, 6, 18, 6, 0, 6, 13, 18, 13, 8, 20, 8, 0, 8, 8, 20, 13, 8, 20, 8, 0, 8, 15, 20,
				13, 10, 22, 10, 0, 10, 8, 10, 13, 10, 22, 10, 0, 10, 20, 22, 13, 10, 0, 13, 0, 14, 15, 16, 17, 20, 10, 22, 0, 0, 0, 0, 
				13, 6, 18, 6, 0, 6, 6, 18, 13, 6, 18, 6, 0, 6, 13, 18, 13, 8, 20, 8, 0, 8, 8, 20, 13, 8, 20, 8, 0, 8, 15, 20,
				13, 10, 22, 10, 0, 10, 8, 10, 13, 10, 22, 10, 0, 10, 20, 22, 13, 10, 13, 10, 0, 13, 15, 17, 13, 15, 17, 20, 0, 17, 20, 22][bassptr]];
	bassosc += note;
	flangeosc += note+1;
	var ret = ((bassosc >> 8) & 0x7F) + ((flangeosc >> 8) & 0x7F);
	return ret;
}

var snareosc = 0;
function voice_snare(i)
{
	// brown noise
	snareosc=(snareosc+65535*Math.random())&0xFFFF;
	
	var delay = i&0xFFF;
	var envelope = Math.exp(-0.00002*delay*delay);
	
	var ret = (envelope*snareosc)>>8;
	return ret;
}

var drumosc=0, drumtimer=0, drumptr=-1;
function voice_drum(i)
{
	var drumhits = [112, 1, 2, 2, 1, 2, 1, 1, 6];
	var drumnote= [11, 11, 11, 11, 11, 11, 9, 7, 5];
	if (!drumtimer) {
		drumptr=(drumptr+1)%9;
		drumtimer=drumhits[drumptr]*0x400;
	}
	var delay = drumhits[drumptr]*0x400-drumtimer;
	--drumtimer;
	var osc = Math.min(1, Math.max(-1, 50*Math.sin(-notes2[drumnote[drumptr]]*delay*Math.exp(-delay/1500))));
	var envelope = Math.exp(-delay/150);
	return 32+32*osc*envelope;
	
}

function audioContents() {
var header = 'RIFF_oO_WAVEfmt '+atob('EAAAAAEAAQBAHwAAQB8AAAEACAA')+'data';
var melodyTrack=header;
var nmin=999,nmax=0;
for (var i=0;i<(12<<16);++i) {
	var ret = .3*voice_snare(i) + voice_drum(i)+.3*voice_bass2(i) + voice_lead2(i,0) + .4*voice_lead2(i,1) + voice_arp2(i);
	ret = Math.min(ret, 255);

	melodyTrack+=String.fromCharCode(ret);
}

var desc='data:audio/wav;base64,';
	return desc+btoa(melodyTrack);
}
