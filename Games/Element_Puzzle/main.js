(function ()
{

function is_undef(v)
{
    return typeof v == 'undefined';
}

var FastBase64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    FastBase64_encLookup = [];

function FastBase64_Init (i) {
    for (i=0; i<4096; i++) {
        FastBase64_encLookup[i] = FastBase64_chars[i >> 6] + FastBase64_chars[i & 0x3F];
    }
}

function FastBase64_Encode(src)
{
    var len = src.length,dst = '',i = 0,n1;

    while (len > 2) {
        n1 = (src[i] << 16) | (src[i+1]<<8) | src[i+2];
        dst+= FastBase64_encLookup[n1 >> 12] + FastBase64_encLookup[n1 & 0xFFF];
        len-= 3;
        i+= 3;
    }
    if (len > 0) {
        dst+= FastBase64_chars[(src[i] & 0xFC) >> 2];

        n1= (src[i] & 0x03) << 4;

        if (len > 1) n1 |= (src[++i] & 0xF0) >> 4;

        dst+= FastBase64_chars[n1];

        if (len > 1) {
            n1= (src[i++] & 0x0F) << 2;
            n1 |= (src[i] & 0xC0) >> 6;
            dst+= FastBase64_chars[n1];
        }
        if (len == 1) dst+= '=';
        dst+= '=';
    }
    return dst;
} // end Encode


FastBase64_Init();


function u32ToArray(i) {
    return [i&0xFF, (i>>8)&0xFF, (i>>16)&0xFF, (i>>24)&0xFF];
}

function u16ToArray(i) {
    return [i&0xFF, (i>>8)&0xFF];
}

function split16bitArray(data) {
    var r = [],j = 0,i=0;
    for (; i<data.length; i++) {
        r[j++] = data[i] & 0xFF;
        r[j++] = (data[i]>>8) & 0xFF;
    }
    return r;
}

function makeWav(data)
{
    if( navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
        navigator.userAgent.match(/Opera Mini/i) ||
        navigator.userAgent.match(/IEMobile/i) )
    {
        return { play : function () {} };
    }

    var                                       // OFFS SIZE NOTES
        chunkId      = [0x52,0x49,0x46,0x46], // 0    4    "RIFF" = 0x52494646
        chunkSize,                            // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
        format       = [0x57,0x41,0x56,0x45], // 8    4    "WAVE" = 0x57415645
        subChunk1Id  = [0x66,0x6d,0x74,0x20], // 12   4    "fmt " = 0x666d7420
        subChunk1Size= 16,                    // 16   4    16 for PCM
        audioFormat  = 1,                     // 20   2    PCM = 1
        numChannels  = 1,                     // 22   2    Mono = 1, Stereo = 2...
        sampleRate   = 44100,                 // 24   4    8000, 44100...
        byteRate,                             // 28   4    SampleRate*NumChannels*BitsPerSample/8
        blockAlign,                           // 32   2    NumChannels*BitsPerSample/8
        bitsPerSample= 16,                    // 34   2    8 bits = 8, 16 bits = 16
        subChunk2Id  = [0x64,0x61,0x74,0x61], // 36   4    "data" = 0x64617461
        subChunk2Size,                        // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
        wav;

    blockAlign = (numChannels * bitsPerSample) >> 3;
    byteRate = blockAlign * sampleRate;
    subChunk2Size = data.length * (bitsPerSample >> 3);
    chunkSize = 36 + subChunk2Size;

    wav = chunkId.concat(
        u32ToArray(chunkSize),
        format,
        subChunk1Id,
        u32ToArray(subChunk1Size),
        u16ToArray(audioFormat),
        u16ToArray(numChannels),
        u32ToArray(sampleRate),
        u32ToArray(byteRate),
        u16ToArray(blockAlign),
        u16ToArray(bitsPerSample),
        subChunk2Id,
        u32ToArray(subChunk2Size),
        split16bitArray(data)
    );
    return new Audio( 'data:audio/wav;base64,'+FastBase64_Encode(wav) );
}


///////////////////////////////////////////////////////////////////////////////////////////////

var viewportwidth = 800, viewportheight = 480;

///////////////////////////////////////////////////////////////////////////////////////////////

function mabs(val)
{
    return Math.abs( val );
}

function tri(angle)
{
    return mabs( angle % Math.PI - Math.PI / 2 );
}

function sine(angle)
{
    return Math.sin(angle);
}

function power(val,pw)
{
    return Math.pow( val, pw );
}

function mini(a, b)
{
    return Math.min(a,b);
}

function maxi(a, b)
{
    return Math.max(a,b);
}

var data = [],tmpVal; // just an array
for (var i=0; i<1E4; i++)
{
    tmpVal = power( i * 2, 1.125 )/ 100;
    data[i] = ( 5E3 *  maxi( mini( 8 * ( 9E3 - i ) / 11025, 1 ), 0 ) *
        mini( 32 * i / 1E4, 1 ) *
        (       sine( tmpVal ) +
                sine( tmpVal * 1.33 ) +
                sine( tmpVal * 1.5 )
            ) ) | 0;
}

var SND_TRANSFORM = makeWav(data);

///////////////////////////////////////////////////////////////////////////////////////////////

var seed = 1;
function sndRnd() {
    var x = sine(seed++) * 1E4;
    return (x - Math.floor(x)) * 2 - 1;
}

data = [];
var ii = 0, iii = 0, curRnd, curRnd2, ampli = 1;
for (i=0; i<2E4; i++, ii --, iii -- )
{
    if( ii <= 0 )
    {
        curRnd = sndRnd();
        ii = 128 * ampli;
        ampli *= 1.0125;
    }

    if( iii <= 0 )
    {
        curRnd2 = sndRnd() * 0.25;
        iii = 16 * ampli;
    }

    data[i] = ( 5E3 *  maxi( mini( 8 * ( 21E3 - i ) / 2E4, 1 ), 0 ) *
                        mini( 32 * i / 2E4, 1 ) *
        (
            curRnd + curRnd2
            ) ) | 0;
}
var SND_DESTROYED = makeWav(data);

///////////////////////////////////////////////////////////////////////////////////////////////
data = [];

function fillNotes(notes,freq)
{
    for (i=0, iii = 0, ii =0; i<15000; i++, ii -- )
    {
        if( ii <= 0 && iii < notes.length )
        {
            freq /= notes[ iii ];
            ii = 1100;
            iii ++;
        }

        var ifreq = i / freq;

        data[ i ] = ( 3E3 *  maxi( mini( 4 * ( 14000 - i ) / 15000, 1 ), 0 ) *
            mini( 64 * i / 15000, 1 ) *
            (
                ( tri( 4 * ifreq ) / 4 + tri( 2 * ifreq ) / 2 + sine( 1.5 * ifreq ) + tri( ifreq ) + tri( ifreq / 2 ) / 2 + sine( ifreq / 4 ) / 2 ) *
                    mini( 8 * ( 1100 - ii ) / 1100, 1 ) * ( iii >= notes.length ? 1 : maxi( mini( 8 * ii / 1100, 1 ), 0 ) )
                ) ) | 0;
    }
}

var notes = [ 1.122462, 1.122462, 1.059463, 1.122462, 1.122462, 1.122462, 1.059463 ];
fillNotes(notes,10 * Math.PI);

var SND_WIN = makeWav(data);

for(i=0;i<notes.length;i++)notes[i] = 1/notes[i];

fillNotes(notes,10 * Math.PI);
var SND_PORTAL = makeWav(data);

///////////////////////////////////////////////////////////////////////////////////////////////
data = []; // just an array

var freq = 10 * Math.PI;

function instru(ph)
{
    return tri( 4 * ph ) / 4 + tri( 2 * ph ) / 2 + tri( ph ) + tri( ph / 2 ) / 2 ;
}

for (i=0, iii = 0, ii=0; i<22000; i++, ii --, iii+= 1 - i / 88000 )
{
    if( ii <= 0 )
    {
        ii = 3300;
    }

    ifreq = iii / freq;

    var chord = instru(ifreq)+instru(ifreq/1.18920711)+instru(ifreq/1.587401);

    data[ i ] = ( 2E3 *  maxi( mini( 4 * ( 21000 - i ) / 22000, 1 ), 0 ) *
        mini( 64 * i / 22000, 1 ) *
        (
            chord *
                (mini( 2 * ( 3300 - ii ) / 3300, 1 ) * maxi( mini( 2 * ii / 3300, 1 ), 0 ) *0.25+0.75)
            ) ) | 0;
}

var SND_LOSE = makeWav(data);

///////////////////////////////////////////////////////////////////////////////////////////////

data = []; // just an array
ii = 0; iii = 0; ampli = 1;
for (i=0; i<2048; i++, ii --, iii -- )
{
    if( ii <= 0 )
    {
        curRnd = sndRnd();
        ii = 256 * ampli;
        ampli *= 1.0125;
    }

    if( iii <= 0 )
    {
        curRnd2 = sndRnd() * 0.25;
        iii = 8 * ampli;
    }

    data[i] = ( 3E3 *  maxi( mini( 2 * ( 2000 - i ) / 2048, 1 ), 0 ) *
        mini( 32 * i / 2048, 1 ) *
        (
            curRnd + curRnd2
            ) ) | 0;
}
var SND_FALL = makeWav(data);

///////////////////////////////////////////////////////////////////////////////////////////////

data = []; // just an array
for (i=0; i<10000; i++)
{
    data[ i ] = 0;
}

for( ii = 0; ii < 2; ii ++ )
{
    for (i=0; i<4000; i++)
    {
        curRnd = instru( i / 77 ) + instru( i / 77 / 1.5 );
        data[ i + ii * 5000 ] = ( 3E3 *  maxi( mini( 2 * ( 3980 - i ) / 4000, 1 ), 0 ) * mini( 32 * i / 4000, 1 ) * curRnd ) | 0;
    }
}

var SND_RECHAZADO = makeWav(data);

data = [];

for (i=0; i<3E4; i++)
{
    curRnd = 0;
    for(ii = 0;ii<11;ii++)
    {
        var sval = sine( i * power(1.12246,ii) / 33 );
        curRnd += (sval > 0 ? 1 : -1) * power( mabs(sval), 0.75 ) / power( ii + 1, 0.33 );
    }
    data[ i ] = ( 3E3 *  power( maxi( mini( ( 39E3 - i ) / 4E4, 1 ), 0 ), 4) * mini( 4 * i / 4E4, 1 ) * curRnd ) | 0;
}

var SND_WIND = makeWav(data);

SND_WIND.play();

///////////////////////////////////////////////////////////////////////////////////////////////

function ctx_ClearRect(ctx,w,h)
{
    ctx.clearRect(0,0,w,h);
    console.log("prevent inline " + w + h );
}

function ctx_MoveTo(ctx,x,y)
{
    ctx.moveTo(x,y);
    console.log("prevent inline " + x + y );
}

function ctx_LineTo(ctx,x,y)
{
    ctx.lineTo(x,y);
    console.log("prevent inline " + x + y );
}

function ctx_quadraticCurveTo(ctx,a,b,c,d)
{
    ctx.quadraticCurveTo(a,b,c,d);
    console.log("prevent inline " + a + b );
}

function getCtxImageData(ctx,sx,w,h)
{
    console.log("prevent inline " + w + h );
    return ctx.getImageData( sx, 0, w, h );
}

function ctx_drawImage(ctx,img,x,y)
{
    console.log("prevent inline " + x + y );
    ctx.drawImage(img,x,y);
}

function createCanvas(width,height)
{
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;

    return buffer;
}

function getContext2D(buff)
{
    return buff.getContext('2d');
}

function renderText(txtLines)
{
    var maxWidth = 0, i;

    for( i in txtLines )
    {
        maxWidth = maxi( get_5x5_width( txtLines[ i ] ), maxWidth );
    }

    var buffer = createCanvas(maxWidth, txtLines.length * 8),
        tctx = getContext2D(buffer);

    ctx_ClearRect( tctx, maxWidth, buffer.height );

    for( i in txtLines )
    {
        var s = txtLines[i];
        print_5x5( tctx, s, ( maxWidth - get_5x5_width( s ) ) / 2 | 0, i * 8 );
    }

    return amplifyImage( buffer, 2 );
}

function changeMonoSpriteColor(img,new_r,new_g,new_b)
{
    ctx_ClearRect( ctx, img.width, img.height );
    ctx_drawImage( ctx, img,0,0 );

    var imgData = getCtxImageData( ctx, 0, img.width, img.height );

    for( var i = 0; i < imgData.height * imgData.width * 4; i += 4 )
    {
        imgData.data[ i ] = new_r;
        imgData.data[ i + 1 ] = new_g;
        imgData.data[ i + 2 ] = new_b;
    }

    var newImg = createCanvas(img.width,img.height),
        tctx = getContext2D(newImg);

    tctx.putImageData( imgData, 0, 0 );

    return newImg;
}

///////////////////////////////////////////////////////////////////////////////////////////////

function cutImage(src,startx,endx)
{
    var x, y = 0, i, w = endx - startx, idx;

    ctx_ClearRect( tempCtx,src.width,src.height);
    ctx_drawImage(tempCtx,src,0,0);

    var data = getCtxImageData( tempCtx, startx, w, src.height),
        buffer = createCanvas(w,src.height),
        tctx = getContext2D(buffer),
        newData = getCtxImageData( tctx, 0, w, buffer.height );

    for( ; y < buffer.height; y ++ )
    {
        for( x = 0; x < w; x ++ )
        {
            idx = ( x + y * w ) * 4;

            for( i = 0; i < 4; i ++  )
            {
                newData.data[ idx + i ] = data.data[ idx + i ];
            }
        }
    }

    tctx.putImageData( newData, 0, 0 );

    return buffer;
}

///////////////////////////////////////////////////////////////////////////////////////////////

function amplifyImage(src,coef,opacity)
{
    if( is_undef(opacity) )
        opacity = 1.0;

    var x, y = 0, xx, yy, i;

    ctx_ClearRect(tempCtx,src.width,src.height);
    ctx_drawImage(tempCtx,src,0,0);

    var data = getCtxImageData( tempCtx,0,src.width,src.height),
        buffer = createCanvas(src.width * coef,src.height * coef),
        tctx = getContext2D(buffer),
        newData = getCtxImageData( tctx, 0, buffer.width, buffer.height );

    for( ; y < src.height; y ++ )
    {
        for( x = 0; x < src.width; x ++ )
        {
            var srcIdx = ( x + y * src.width ) * 4;

            for( yy = 0; yy < coef; yy ++ )
            {
                for( xx = 0; xx < coef; xx ++ )
                {
                    var targIdx = ( x * coef + xx + ( y * coef + yy ) * src.width * coef ) * 4;
                    for( i = 0; i < 3; i ++  )
                    {
                        newData.data[ targIdx + i ] = data.data[ srcIdx + i ];
                    }

                    newData.data[ targIdx + 3 ] = data.data[ srcIdx + 3 ] * opacity;
                }
            }
        }
    }

    tctx.putImageData( newData, 0, 0 );

    return buffer;
}

function scrollImage(targ,src,t)
{
    var ctx = getContext2D(targ),
        w = src.width,
        h = src.height,
        x0 = ( ( t % w ) - w  ) | 0;

    ctx_ClearRect(ctx, w, h );
    ctx_drawImage(ctx, src, x0, 0 );
    ctx_drawImage(ctx, src, x0 + w, 0 );
}

///////////////////////////////////////////////////////////////////////////////////////////////

var WIDTH, HEIGHT, LEVEL_X, LEVEL_Y;

var IMG_BACKGROUND,
    IMG_GROUND,
    IMG_GROUND_UP,
    IMG_WATER,
    IMG_WATER_SRC,
    IMG_WOOD,
    IMG_WOOD_FIRE,

    IMG_EXIT,

    IMG_CHAR_WATER,
    IMG_CHAR_EARTH,
    IMG_CHAR_AIR,
    IMG_CHAR_FIRE,

    IMG_BONUS_AIR,
    IMG_BONUS_EARTH,
    IMG_BONUS_FIRE,
    IMG_BONUS_WATER,

    IMG_SPEECH_BUBBLE,
    IMG_SPEECH_BUBBLE_BIG,

    IMG_VOID,
    IMG_PORTAL,

    IMG_BLOCK,

    IMG_FONT,
    IMG_FONT_X2_WHITE,
    IMG_FONT_X3,
    IMG_FONT_GREY_X3,
    IMG_FONT_X4,
    IMG_FONT_GREY_X4
    ;

var fontmap = [];

function get_5x5_width( str )
{
    for(var w = 0, i = 0; i < str.length; i ++ )
    {
        w += is_undef( fontmap[ str.charAt( i ) ] ) ? 3 : 6;
    }

    return w;
}

function print_xxx( tctx, img, str, x, y, size, m )
{
    for( var i = 0; i < str.length; i ++ )
    {
        var offset = fontmap[ str.charAt( i ) ];

        if( is_undef(offset) )
        {
            x += 3 * m;
        }
        else
        {
            tctx.drawImage( img, offset * m, 0, size, size, x, y, size, size );
            x += size + m;
        }
    }
}

function print_5x5( tctx, str, x, y )
{
    print_xxx( tctx, IMG_FONT, str, x, y, 5, 1 );
}

function print_10x10_white( tctx, str, x, y )
{
    print_xxx( tctx, IMG_FONT_X2_WHITE, str, x, y, 10, 2 );
}

function print_15x15( tctx, str, x, y )
{
    print_xxx( tctx, IMG_FONT_X3, str, x, y, 15, 3 );
}

function print_15x15_grey( tctx, str, x, y )
{
    print_xxx( tctx, IMG_FONT_GREY_X3, str, x, y, 15, 3 );
}

function print_20x20( tctx, str, x, y )
{
    print_xxx( tctx, IMG_FONT_X4, str, x, y, 20, 4 );
}

function print_20x20_grey( tctx, str, x, y )
{
    print_xxx( tctx, IMG_FONT_GREY_X4, str, x, y, 20, 4 );
}

var loadedImages = 0;
var numImages = 0;

function create_Button(img,txt,onClick,x,y)
{
    return {
    img : img,
    onClick : onClick,
    x : x,
    y : y,
    w : img.width,
    h : img.height,
    isCursorOver : false,

    offx : 0,
    offy : 0,

    prnt : null,

    tx_off : ( img.width - get_5x5_width( txt ) * 3 ) / 2,

    txt : txt
    };
}

function btn_Parentize(b, w)
{
    b.offx = b.x;
    b.offy = b.y;
    b.prnt = w;
}

function btn_Draw( b )
{
    if(b.isCursorOver)
    {
        ctx.save();
        ctx.translate( b.x + b.w / 2, b.y + b.h / 2 );
        ctx.scale( 1.1, 1.1 );
        ctx.translate( -b.x - b.w / 2, -b.y - b.h / 2 );
    }

    ctx_drawImage(ctx, b.img, b.x, b.y );

    print_15x15_grey( ctx, b.txt, b.x + b.tx_off + 3, b.y + b.h / 2 - 5 );
    print_15x15( ctx, b.txt, b.x + b.tx_off, b.y + b.h / 2 - 8 );

    if(b.isCursorOver)
    {
        ctx.restore();
    }
}

function create_Window(img, ey_, sx_)
{
    ey_ = ( HEIGHT - img.height ) / 2 - 44 | 0;
    sx_ = WIDTH + img.width;

    return {       
        img : img,
        ex : ( WIDTH - img.width )/2 | 0,
        ey : ey_,
        sx : sx_,
        sy : ey_,
        x : sx_,
        y : ey_,
        t : 0,
        tdir : 0,
        elements : [],
        isVisible : false,
        incoming : true,
        txt : ""
    };
}


function create_Bubble()
{
    return { tx : [], text_offset : 13, t : 0, img: IMG_SPEECH_BUBBLE };

}

var mouseX, mouseY, isOverCreds;

function mouseMove(e)
{
    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    mouseX = mouseX / xfm_S;
    mouseY = mouseY / xfm_S;

    var b;

    var needSetPointer = false;

    for ( var i in buttons )
    {
        b = buttons[i];

        if(!b.prnt || b.prnt.isVisible )
        {
            if( b.x <= mouseX && b.x + b.w >= mouseX
                &&
                b.y <= mouseY && b.y + b.h >= mouseY
                )
            {
                needSetPointer = true;
                b.isCursorOver = true;
            }
            else
            {
                b.isCursorOver = false;
            }
        }
    }

    if( mouseX > WIDTH - credWidth && mouseX < WIDTH &&
        mouseY > HEIGHT - 40 && mouseY < HEIGHT - 15 )
    {
        isOverCreds = 1;
        needSetPointer = 1;
    }
    else
    {
        isOverCreds = 0;
    }

    canvas.style.cursor = needSetPointer ? 'pointer' : 'default';
}

function mouseClick(e)
{
    var processed = false, i, b;

    for ( i in buttons )
    {
        b = buttons[i];

        if( b.isCursorOver && ( !b.prnt || b.prnt.isVisible ) )
        {
            b.onClick();
            processed = true;
            break;
        }
    }

    if( isMenu && isOverCreds )
    {
        open('http://google.com','_blank');
    }

    if( inGame && !processed )
    {
        if( !( charState == 'a' && (charCellX != superTargCellX || charCellY != superTargCellY ) ) )
        {
            superTargCellX = getCellX( mouseX );
            superTargCellY = getCellY( mouseY );

            hadMovement = 0;
            clickedForMovement = 1;

            if( charState == 'a' )
            {
                var diffX = superTargCellX - charCellX;
                var diffY = superTargCellY - charCellY;

                if( mabs( diffX ) > mabs( diffY ) )
                {
                    if( superTargCellX > charCellX )
                        superTargCellX = X_CELLS;
                    else
                        superTargCellX = -1;

                    superTargCellY = charCellY;
                }
                else
                {
                    if( superTargCellY > charCellY )
                        superTargCellY = Y_CELLS;
                    else
                        superTargCellY = -1;

                    superTargCellX = charCellX;
                }
            }

            updateCellTarget();

            if( ( targCellX != charCellX || targCellY != charCellY ) && charState == 'a' )
            {
                SND_WIND.play();
            }
        }
    }
}

var canvas = document.getElementById('c2c');

canvas.onmousemove = mouseMove;
canvas.addEventListener("click", mouseClick, false);

var mainCtx = getContext2D(canvas);

WIDTH = mainCtx.canvas.width;
HEIGHT = mainCtx.canvas.height;

var bufferCanvas = createCanvas(WIDTH, HEIGHT);

var ctx = getContext2D(bufferCanvas);

var tempCanvas = createCanvas(256,256);

var tempCtx = getContext2D(tempCanvas);


var images = {
    bkGround:"BwAAAAcCAMAAABF0y+mAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAxQTFRFChUVAAMDEx0dHyoqYnStWwAAAPpJREFUeNpMkgEWwzAIQhHvf+cFULu9vsbFBL9UANUgAbDwFkVvLwtLgbM1mRdV3eoLTEituqJ8oaLx/sNb73EhrZQw9e5m0m99VYuWLP86VDmq6AQxWgakItbyWpWTxXdFQC6yLdVeMaCg3Ml1jvD5RMeDyfbyeXPo3Eb6S6/2qO1LmH3gNay31RpBr5ggL5Z5ORAl1QpfMAbdrm3SCEg75PqXJPdDvMq1R1IYk8VSPcS6TwJMsoc0jl6DkW2METhL+XlrhT8M++ACGMtWTHt9te/TcGarU65PPKPl8z3XA6HjHi1sH2Hn0Pe6y9vCDvpIaN5u+K3wE2AA67QDKA8K8NkAAAAASUVORK5CYII=",
    ground:"A4AAAAOCAMAAAAolt3jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFfkEDgEMFgkUJfT8CbjUDej4AgUQHdToAfkIFgEIDhkgKgEMHfT8FdT4MdzsAcjgAGpbYTgAAAH5JREFUeNoUjlESAyEMQiEYXLW1979t2a8QZuABGePYbFEiTICmR9cpYh0QegCvnitKs7EBORejSOxHkk8ZT6ykZf9GN5h30wZm1w8GqQ5EW9OwB9NtpTvQXt9+0dJlqqvRnyeGum8W5Nu22OO+5qnblai439TSrsiAM/0vwABFIQMyLusseAAAAABJRU5ErkJggg==",
    ground_up:'A4AAAADCAYAAACj1j4PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJhJREFUeNpcirEOwVAAAK/S9vGIEk0IqaVGi8HQTWI0mhrf4VN8g7GDlfgPayUGCU0paYOnkXQxXHK5nLbwbPVRkKZwekDfgvMNogx6Vbjm3WmAMOD+hDCCbh10yfsoTEFSMpA1c93SM9+QZXb7gzP3BuHQBi1L0HnRblaw8ieOLz7LaWcbBAFKqR+TkbsqvGA2djf/7SvAAFgnRi7eUO56AAAAAElFTkSuQmCC',
    wood:'A4AAAAGCAMAAADExV+OAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFpUsSs1QVwGQigDQMuV4gq1AUn0QQlz4PLOssYwAAADZJREFUeNpUjMENwEAMg4hLkv037lV9HT+EZZ4Lqo3B9GAxI2Oym4ZTPw/7eyxTeOYq99UrwAAvBQEI3MxqOwAAAABJRU5ErkJggg==',
    wood_fire:'DgAAAAOCAMAAABNey+cAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRF3hMA4CEA9D0A/2gB/5QD/7oI3h8A////A3W0NwAAAAh0Uk5T/////////wDeg71ZAAAA6ElEQVR42pxRAW7EMAgzBtL//3g27aWV1tOkoUSFYIyhON4Mx5/2Don4ZyH38zvDugvxTvelsxR9IPyCeHLhOckZMO5C4K2NH7nV4DqR3ODIuMXeAwjA/DB8FJx2ISqHErOBB99gsYntUjuM2FuyswbBg/277+4I0pdrohjapY/5wGmyrm6TjT2mEBFVa7o5ACg9QizjFtQ6ztGUo0bByZQpVUW0BwlCbrbJPEBUZqcUee8mzFKx/yPYndWtpYTehGqfYhcEUsZBdYqSPZYloGWJTb5o7NnCbylgZhZZqbwKjdKZGz8CDADXSg89lgypewAAAABJRU5ErkJggg==',
    water:'A4AAAAOCAMAAAAolt3jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFADSqADayADjCADe5ADzeADOmADnLADrTHyQyeQAAAGZJREFUeNo0jkESRFEEAwmP+9/4d0yNlZaUJN4LabtblRkBlgROZTxjSpoF2aEsjFVlKVgkAKvxvBxMp2oXOW4gcsZmB5VHM46F7wzfuwpn83zQ/e9qzf5qXVi6Y/P937lPBD8BBgDgggIr/gXptwAAAABJRU5ErkJggg==',
    exit:'AgAAAAICAMAAADz0U65AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFAOr/AGx2////EW3ZRwAAAAN0Uk5T//8A18oNQQAAACtJREFUeNo8y8ENAEAIAkHY/os+lIvz2kgULn0JEyIRk2NvnXAn6754AgwACM4APMzT5FIAAAAASUVORK5CYII=',
	char_air:'B4AAAAKCAMAAACUqR4dAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFjbCzyez6qczTvuDte52eosbLhqeqmbu/wub0r9LbtNji3/X/t9rlZouMdpOU////TJsmNQAAABB0Uk5T////////////////////AOAjXRkAAACySURBVHjaLJBJksUgDEPleYCE+9/2m3R79cqiJBmcY+Vc544yEB+5Px/hgBYRXVZbVduHHuUoxshIynkwWwWzkIQedZRk4z1ourNIHLtKiMQUwtaSBkVY5+xymVttyZ3kGsZWHe2TPY7JlXiGtgW3n2A2Q/DIsSZ9d78PUoRjGqnllnHWaW4rcwKnppeIlN9q0TTJ9zAP2yv1HgbYkndonJjjk+/x/PcZYxD+T69e+gkwAA5pCModastHAAAAAElFTkSuQmCC',
	char_water:'B4AAAAKCAMAAACUqR4dAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFLUf5CBiGGzfhrrj/VGf5DSW5Jze8ZXf7RVv6fYz2DR2SRVXHBBR+ECGkIS6f////Nl+UiwAAABB0Uk5T////////////////////AOAjXRkAAACmSURBVHjaJJAJDsAgCARZRK5W/f9vC9ZEGXeiBumcg8zE6YG/dLSzKxXqE9oCmDpveraavr9Ot2HaWklCVza5yYPW+ZhEePESsUG8r40ITRD2CBG3jQrFyHkiRWKEVUZYEeI+AkfJ3WkBqAtNGkvXGScXFBERZ2kVkYv19iQrZNSTTHN1b0vdmQtvY15xp+9SvLd1MM/5Xn2S5/8tdcFde+bdfAIMAN+uCTize/ISAAAAAElFTkSuQmCC',
	char_earth:"AoAAAAKCAMAAAC67D+PAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRF869JWDkniFYuTzYmuXk5c0cqpWc0aEIpmmMwYj4o0Y5AklsvrXE5sG04fFEu////FRTjmQAAABB0Uk5T////////////////////AOAjXRkAAABTSURBVHjaFMxBEgAhCAPBEEBBVvn/b1dvfZgadAvpqd3oGbt8pjSkLL5dUxU+DDAeUXAsYB+5jFjLgo+sbR9P3nY6B5162ZJVFNX7bZV86l+AAQCSFAKN/eAG9gAAAABJRU5ErkJggg==",
	char_fire:'B4AAAAKCAMAAACUqR4dAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRF5tUz0ycA5pMB5nEA5uR2tgUApQEB41cAyBgA5rQBrQMB4EsAoAEB3DsAvQ0A////UDoupAAAABB0Uk5T////////////////////AOAjXRkAAACnSURBVHjaTFAHDgMxCGNcyGD9/7eFXKUWKZFlB7ADmWkmlt8yyf+COuEar2621mgodR+58lmT9DYNXEp+inL28HoCeZRp8yhSJlHBlpGIyUs2pA0P62qSH4CWcxTaemVmePbGWmkKD3D5rB4Awt59xtqbZ7ShuQnIR5rXbHJpaxZMeKOJEjqjFFXOmOMGy6XYC1PWDBF581tc5zeufXOf+H1JUx8BBgBCeQvjw9HJ0AAAAABJRU5ErkJggg==',
    bonus_air:'AUAAAAFCAMAAAC6sdbXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACRQTFRFjubnjuTljuXmfp+fjuTkhb6+hb29hb+/fp2dhsTEh8jI////rpbyLwAAAAx0Uk5T//////////////8AEt/OzgAAACZJREFUeNpi4OZm5OZm4OZkYOBm4OBiYgHSzOxsQBFuVm5ugAADAArVALzuU+I7AAAAAElFTkSuQmCC',
    bonus_water:'AUAAAAFCAMAAAC6sdbXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACdQTFRFODbqNTadNzbmODbpMzZgMzZjODbsNTagNTaqODboNjawNTac////ec9JrQAAAA10Uk5T////////////////AD3oIoYAAAAmSURBVHjaDMjJAQAgCMCweiAq3X9ezTPoUdwLmXd0MLL+2PQJMAAMqADTvV+DLwAAAABJRU5ErkJggg==',
    bonus_earth:'AUAAAAFCAMAAAC6sdbXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACRQTFRFpXkepHgedlkedFcep3oeonYefF0eTz8edFgegWAeUUAe////o3d/VAAAAAx0Uk5T//////////////8AEt/OzgAAACVJREFUeNoMyEECABAMwLCOMfT//50cg4biTqRuLPCN+cejLcAACs8AvYqeONIAAAAASUVORK5CYII=',
    bonus_fire:'AUAAAAFCAMAAAC6sdbXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACdQTFRF/x8LyhEA/xsHiRcNjBcNzBEA2RIA/x4KyRAA/x0J1BEA/yAM////uYlT9gAAAA10Uk5T////////////////AD3oIoYAAAAmSURBVHjaDMjJAQAgCMCweiAq3X9ezTPoUbyFjJUdnLH/2PQJMAAM9ADTzPy5GAAAAABJRU5ErkJggg==',
    font:'PUAAAAFCAMAAACq/VpOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFAAAA////pdmf3QAAAAJ0Uk5T/wDltzBKAAAA00lEQVR42oRTCxYEIQiC+196Z6ZU0Ho7n7IylEiQ4PM/z+rCxtchB9tv2/xsZEuxYTjdDkwYAthmJO7CpqC9HT039c8M+5M4OxwaC+VC4xUj5sa9iv0dcBxTkZT1DI1Fb/hXzpVNj6Ur7HFRZ+vsSuuIjhCsosgY9jomTPcr68MZ6zxL5bhQmaHTuYkNSXzet5PWfoaYWufMlEyk6SgpcmqtDdhOw+7/JSuetIaZmFpYXW/HUddNR5zqOve6+lanwREt91HXPkPwb+0rXfF5258AAwAyjQMMm1O0UQAAAABJRU5ErkJggg==',
    the_void:'CQAAAAMCAMAAAA9Ie/xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFaACrMgBXVwCRiADeHgA2eQDHRQB0////6lfCKgAAAAh0Uk5T/////////wDeg71ZAAAA0ElEQVR42jyRC5IEMQhCxe/9b7yP7MykuyomIqCJY60U91kR+Q2vPyFJdV+3ysepzI3ql1NU6GSQbidqr0FVAr/Lh0og6RszZe0uh0QKrhi9YEtWrJWZytAedcA1qRxpYOW6AhmDBo7Zy+iZW8vHLELOY4SW+GG1I8rxEJYabTRhLBU0BGjCTPakpPiU/56gRRFPYTeEG6+77MPFYY4eJYpjft2p+cZjgpjEAH7OLd9j0GVyP2+6ZUWK3wPgsen1Tdyznd9TrJja90Cttz8BBgBnVQd2Fr5FWwAAAABJRU5ErkJggg==',
    portal:'CQAAAAMCAMAAAA9Ie/xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFDWwAEYYAH+wAFJcAEHcAGeEAGdQA////Voo4XgAAAAh0Uk5T/////////wDeg71ZAAAAkUlEQVR42nyRyxKFMAhDCYH2//9YQn20d3FZOEc9Eie1eQy8B+uGmgI7nR1A95HELVnN4QiRiwZaslEo6McRumbn9BC2nGUJIl3WYHaE/FsyzCzycu6trjQjbZOspdSiEkJxZQcZn6Slb9zoOPgRN01fC3w+L6Z/Pw78qcAXOX7K5F4mqfLfMjdrPxY+x3IJMADSKAjx6fXVPwAAAABJRU5ErkJggg==',
    block:'A4AAAAOCAMAAAAolt3jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFVlpHj5Z3qq6SoaaItbqhrrSaREg3c3leF532gAAAAFlJREFUeNpsj1EOwCAIQ5VKe/8brzCyZcnej74gUBe5XriobWB8lFIIA1Cu77LMjNAuRUk73G47TY6ef01U7+fxjDo1a7QX2XoRFTcToyM6pOSQzx984yXAAPb3AnOuDTfNAAAAAElFTkSuQmCC'

};

// load images
for(var img in images)
{
    numImages++;
}
for(var img in images)
{
    var src = images[img];
    images[img] = new Image();
    images[img].onload = function() { loadedImages++; };
    images[img].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA" + src;
}

var startTick = new Date(),
    lastTick = startTick,
    lastIntervalHandle,
    isMenu = 0,
    credWidth;

function doMenuCommon()
{
    updateBaseXForm();

    var y = -1, x,i;

    for( ; y < Y_CELLS / 2 + 1; y ++ )
    {
        for( x = -1; x < X_CELLS / 2 + 1; x ++ )
        {
            ctx_drawImage(ctx, IMG_BACKGROUND, 2 * x * CELL_SIZE, 2 * y * CELL_SIZE );
        }
    }

    for ( i in buttons ) {
        btn_Draw(buttons[i]);
    }
}

function menuLoop() {

    isMenu = 1;

    doMenuCommon();

    var credits = "Developed for GSSOC";
    credWidth = get_5x5_width(credits) * 2 + 22;

    print_10x10_white( ctx, credits, WIDTH - credWidth, HEIGHT - 33 );

    if( isOverCreds )
    {
        ctx.beginPath();
        ctx.strokeStyle="#fff";
        ctx.lineWidth="2";
        ctx_MoveTo(ctx, WIDTH - 168, HEIGHT-18);
        ctx_LineTo(ctx, WIDTH - 20, HEIGHT-18 );
        ctx.stroke();
    }

    ctx_drawImage(ctx, menuTitle0, 210, 77 );

    ctx_drawImage(ctx, menuTitle1, 230, 180 );


    flipBuffer();
}

function selectLevelLoop()
{
    isMenu = 0;

    doMenuCommon();

    print_20x20_grey( ctx, "Choose your level", 208, 44 );
    print_20x20( ctx, "Choose your level", 204, 40 );

    flipBuffer();
}

var buttons = [];
var windows = [];

function renderToCanvas (width, height, renderFunction) {
    var buffer = createCanvas(width,height);

    var ctx = getContext2D(buffer);

    ctx_ClearRect(ctx, width, height );
    renderFunction(ctx, width, height);

    return buffer;
};

function drawBubble(ctx, w, h)
{
    var radius = 22 * w / 244;
    var doff = 20 * w / 244;

    var r = w;
    var b = h  - radius;

    ctx.beginPath();
    ctx.strokeStyle="#056";
    ctx.fillStyle = "#fff";
    ctx.lineWidth="1";
    ctx_MoveTo(ctx,radius, 0);
    ctx_LineTo(ctx,r-radius, 0);
    ctx_quadraticCurveTo(ctx,r, 0, r, radius);
    ctx_LineTo(ctx,r, b-radius);
    ctx_quadraticCurveTo(ctx,r, b, r-radius, b);

    ctx_LineTo(ctx,r - radius * 2 / 3, b + doff);
    ctx_LineTo(ctx,r - radius * 3, b );

    ctx_LineTo(ctx,radius, b);
    ctx_quadraticCurveTo(ctx,0, b, 0, b-radius);
    ctx_LineTo(ctx,0, radius);
    ctx_quadraticCurveTo(ctx,0, 0, radius, 0);
    ctx.fill();
    ctx.stroke();

}

function roundRect(ctx, x, y, width, height, radius) {

    ctx.beginPath();
    ctx_MoveTo(ctx,x + radius, y);
    ctx_LineTo(ctx,x + width - radius, y);
    ctx_quadraticCurveTo(ctx,x + width, y, x + width, y + radius);
    ctx_LineTo(ctx,x + width, y + height - radius);
    ctx_quadraticCurveTo(ctx,x + width, y + height, x + width - radius, y + height);
    ctx_LineTo(ctx,x + radius, y + height);
    ctx_quadraticCurveTo(ctx,x, y + height, x, y + height - radius);
    ctx_LineTo(ctx,x, y + radius);
    ctx_quadraticCurveTo(ctx,x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function createButtonBk(ctx, width, height)
{
    ctx.fillStyle = '#056';
    ctx.strokeStyle = '#023';
    ctx.lineWidth = 1;

    roundRect(ctx, 2, 2, width-4, height-4, 2 );
}

function createWinBk(ctx, width, height)
{
    ctx.fillStyle = '#002838';
    ctx.strokeStyle = '#389';
    ctx.lineWidth = 2;

    roundRect(ctx, 2, 2, width-4, height-4, 11 );
}

function onNewGame()
{
    createLevelSelection();
}

///////////////////////////////////////////////////////////////////////
// Game

var levels = [
"\
00000000000000\
00000000000000\
0c00000000000x\
gggggggggggggg\
gggggggggggggg\
gggggggggggggg\
gggggggggggggg\
gggggggggggggg\
"
,  /* 2 */
"\
00000000000000\
00000000000000\
00000W0c00000x\
ggggggggwwwwwg\
gggggggggwwwgg\
gggggggggggggg\
gggggggggggggg\
gggggggggggggg\
"
,  /* 3 */
"\
00000000000000\
00000000000000\
000000000000x0\
00000000000000\
00000A0c00000g\
gggggggggggggg\
gggggggggggggg\
gggggggggggggg\
"
,  /* 4 */
"\
00000000000000\
00000000000000\
000W000c0F0000\
ggggg--ggggggg\
ggggg00ggggggg\
ggggg0000000xg\
gggggggwwwgggg\
gggggggggggggg\
"
,  /* 5 */
"\
0000000000gggg\
x0000000000000\
ggggg00ggggg0g\
gF00cW0000Ag0g\
g--ggggwwwgg0g\
000000ggggg00g\
ggggg0000000gg\
gggggggggggggg\
"
,  /* 6 */
"\
00000000000000\
00000000000000\
0000000ggggg00\
0000000E000000\
ggg0v00gg000cA\
ggggg0gggggggg\
ggggg0000xgggg\
gggggggggggggg\
", /* 7 */
"\
0000000x00g000\
00000ggv00000g\
000000000g0000\
00g00v00000g00\
0000ggg0000000\
gggggVggg0gggg\
gggc00000Agggg\
gggggggggggggg\
", /* 8 */
"\
00000gg00ggggg\
00000gggv0W0gg\
00000gg00g0000\
ggggggg0000g00\
x0000gg0000c0A\
ggggwggggwgggg\
ggggwwwwwwwwwg\
gggggggggggggg\
", /* 9 */
"\
gggggggggggggg\
gc000ggg2F01gg\
gggg0ggggggggg\
gggg0ggggggggg\
ggggA002v000gg\
gggg0ggg---ggg\
gggg1gggg000xg\
gggggggggggggg\
", /* 10 */
"\
gggggggggggggg\
g000000000100g\
g0F000g000gxgg\
gwg---0c00gggg\
gwggv1AgW0v00g\
gwwwgggggwwwwg\
gggwwwwwwwwwwg\
gggggggggggggg\
", /* 11 */
"\
gggggggggggggg\
g0g0c00g000020\
g0g000000100gx\
g0gVggg--ggwgg\
g00A000000g2gg\
g0g0gW0ggggggg\
ggg0g00000F1gg\
gggggggggggggg\
", /* 12 */
"\
gggggggggggggg\
gF00000c00001g\
g-g-g0ggg0V0xg\
g0gE000000F0gg\
ggg-ggg0ggg00g\
ggW0g1g000000g\
gggwwwgAV00g-g\
ggggggggA0ggAg\
", /* 13 */
"\
ggggg0gggggggg\
g000g00c0gggxg\
g000E00gv0000g\
gv0g00E0000ggg\
g00000gV0Egg0g\
gg000000ggg00g\
ggg0000A00000g\
ggggAggggggggg\
", /* 14 */
"\
gggggggggggggg\
g2c0000000001g\
ggggg---ggggAg\
g2000BW00F0g0g\
gggBg0030gwwwg\
x3g000000ggggg\
ggg00B0000001g\
gggBgggggggggg\
"
, /* 15 */
"\
000000g0020000\
0gv00000Eg000x\
000g00001000g2\
g0000g0000000V\
0000010g0c000A\
00000A000g0g00\
ggg00V0000A00g\
gggggggggggggg\
", /* 16 */
"\
gggggggggggggg\
g0000V00000c1g\
gggB0000gwgg-g\
g0000000ggggwg\
g000000F0B0gxg\
gE00gB0gg00ggg\
ggg0W0000BV01g\
gggBgBgggggggg\
", /* 17 */
"\
gggggggggggggg\
g100g00000000B\
gg00g0gggg0000\
gv00g0gc0g0000\
00v0g0ggAgE000\
gx00g0000g0000\
ggg0gggggg001B\
gggggggggggggg\
", /* 18 */
"\
gggggggggggggg\
gV00000gv0A01g\
g0g000000Bgggg\
x0g-gBv000F01g\
gwgwg00000gggg\
gwwwg00000W00g\
ggggg0c000gggg\
gggggBgggBgggg\
", /* 19 */
"\
ggg0B0v0x0002g\
gBg0000000000g\
g0g00c0000002g\
g0100g0000000g\
g0000gg0000000\
gBW00W0A000000\
ggg00000000001\
ggggBggggggggg\
", /* 20 */
"\
gggggggggggggg\
g0E4v300Fv3g2g\
g0gg-g0ggwggxg\
g00g020ggggggg\
g00ggg4000000g\
g010010W00000g\
ggg00Ac00gv0Ag\
ggggggggwwwwgg\
"
];


var curLvl;
var curLvlAtStart;

var X_CELLS = 14;
var Y_CELLS = 8;
var CELL_SIZE = 56;
var HALF_CELL_SIZE = CELL_SIZE / 2;

var levelBuf = createCanvas(X_CELLS * CELL_SIZE,Y_CELLS * CELL_SIZE);

var charX, charY, prevCharX, prevCharY,
    inFreeFall, airElemPushingBlock, isOverBlock, isOnGround,
    startX, startY,
    targX, targY,
    charCellX, charCellY,
    targCellX, targCellY,
    superTargCellX, superTargCellY,
    charState = 'e', charT,
    charMovesCount,hadMovement,clickedForMovement,
    levelNum = 0, inVictory = 0, toDieSoon = -1, charDead, fireAnimIdx = 0, anim_x3_frameIdx = 0,
    portalledToX, portalledToY,
    cellMovementFinilized
    ;

var HALF_CHAR_HEIGHT;

var inGame = false;
var bonuses;
var bubble;
var woods;
var voids;
var portals;
var blocks;

var levelSpecificLogicFunc;

LEVEL_X = ( WIDTH - levelBuf.width ) / 2;
LEVEL_Y = ( HEIGHT - levelBuf.height ) / 2;

function prepareBlockRender(ctx,tx,ty,angCoef)
{
    ctx.save();

    ctx.translate( tx * CELL_SIZE, ty * CELL_SIZE );
    ctx.rotate( Math.PI * angCoef );
}

function prepareLvl( ln )
{
    levelNum = ln;

    var maxLevel = ln,
        i = 0, x, y = 0, img, ch, xx, yy, totalCells = X_CELLS * Y_CELLS,
        obj,
        lvlData = levels[ ln ],
        ctx = getContext2D(levelBuf),
        ct, ci, s;


    if( !is_undef( localStorage['elepuzzle_max_level'] ) )
    {
        var storageVal = localStorage['elepuzzle_max_level'];

        if( isNaN( storageVal ) )
            storageVal = 0;

        maxLevel = maxi( storageVal, ln );
    }

    localStorage['elepuzzle_max_level'] = maxLevel;

    bonuses = [];
    bubble = 0;
    woods = [];
    voids = [];
    portals = [];
    blocks = [];

    levelSpecificLogicFunc = null;

    curLvl = lvlData;
    curLvlAtStart = lvlData;

    ctx.fillStyle = '#000';
    ctx.fillRect( 0, 0, levelBuf.width, levelBuf.height );

    for( ; y < Y_CELLS / 2; y ++ )
    {
        for( x = 0; x < X_CELLS / 2; x ++ )
        {
            ctx_drawImage(ctx, IMG_BACKGROUND, 2 * x * CELL_SIZE, 2 * y * CELL_SIZE );
        }
    }

    x = 0; y = 0;

    for( ; i < totalCells; i ++, x ++ )
    {
        if( x >= X_CELLS ) { x = 0; y ++ ; }

        ch = curLvl.charAt( i );

        if( ch == 'v' || ch == 'V' )
        {
            obj = {};

            obj.cellX = x;
            obj.cellY = y;

            obj.dir = 1;
            obj.t = 0;

            obj.isVertical = ch == 'V' ? 1 : 0;

            voids.push( obj );

            setCellAt( x, y, '0' );
        }
    }

    for( i in voids )
    {
        obj = voids[i];

        for( s = 0; s < 2; s ++ )
        {
            ci = 0;

            for( ; ; ci -= s * 2 - 1 )
            {
                if( obj.isVertical )
                {
                    if( obj.cellY + ci < 0 ||
                        obj.cellY + ci > Y_CELLS - 1 )
                        break;

                    ct = getCellAt( obj.cellX, obj.cellY + ci );
                }
                else
                {
                    if( obj.cellX + ci < 0 ||
                        obj.cellX + ci > X_CELLS - 1 )
                        break;

                    ct = getCellAt( obj.cellX + ci, obj.cellY );
                }

                if( isCellWaterObstacle( ct ) || ct == 'B' )
                {
                    break;
                }
            }

            if( s )
                obj.lowerB = ci + 1;
            else
                obj.upperB = ci - 1;
        }

        obj.t = -obj.lowerB / (obj.upperB - obj.lowerB);

    }

    x = 0; y = 0;
    for( i = 0 ; i < totalCells; i ++, x ++ )
    {
        if( x >= X_CELLS ) { x = 0; y ++ ; }

        ch = curLvl.charAt( i );

        img = null;

        if( ch == 'B' )
        {
            obj = {
                cellX : x,
                top : y,
                bottom : y,
                t : 0,
                dir :1
            };

            setCellAt( x, y, '0' );

            for( yy = y + 1; yy < Y_CELLS; yy ++ )
            {
                if( getCellAt( x, yy ) == 'B' )
                {
                    setCellAt( x, yy, '0' );

                    obj.bottom = yy;
                    break;
                }
            }

            blocks.push( obj );
        }

        if( ch >= '1' && ch <= '9' )
        {
            portals.push( { idx: ch, x : x, y : y } );
            setCellAt( x, y, '0' );
        }

        if( ch == 'g' ) img = IMG_GROUND;
        if( ch == 'x' ) img = IMG_EXIT;

        if( ch == 'c' )
        {
            charCellX = targCellX = superTargCellX = x;
            charCellY = targCellY = superTargCellY = y;
            charX = targX = getXFromCell(x) + HALF_CELL_SIZE;
            charY = targY = getYFromCell(y) + HALF_CELL_SIZE;
            charT = 1;
        }

        if( img )
        {
            ctx_drawImage( ctx, img,
                            x * CELL_SIZE + (CELL_SIZE - img.width) / 2,
                            y * CELL_SIZE + (CELL_SIZE - img.height) / 2 );

            if( ch =='g')
            {
                if( getCellAt( x, y - 1 ) != 'g' )
                {
                    ctx_drawImage(ctx, IMG_GROUND_UP,
                                        x * CELL_SIZE,
                                        y * CELL_SIZE );

                }

                if( getCellAt( x, y + 1 ) != 'g' )
                {
                    prepareBlockRender( ctx, x + 1, y + 1, 1 );

                    ctx_drawImage( ctx, IMG_GROUND_UP, 0, 0 );

                    ctx.restore();
                }

                if( getCellAt( x + 1, y ) != 'g' )
                {
                    prepareBlockRender( ctx, x + 1, y, 0.5 );

                    ctx_drawImage( ctx, IMG_GROUND_UP, 0, 0 );
                    ctx.restore();
                }

                if( getCellAt( x - 1, y ) != 'g' )
                {
                    prepareBlockRender( ctx, x, y + 1, -0.5);

                    ctx_drawImage(ctx, IMG_GROUND_UP, 0, 0 );
                    ctx.restore();
                }
            }
        }

        img = null;

        if( ch == 'A' )
        {
            img = IMG_BONUS_AIR;
        }

        if( ch == 'W' )
        {
            img = IMG_BONUS_WATER;
        }

        if( ch == 'F' )
        {
            img = IMG_BONUS_FIRE;
        }

        if( ch == 'E' )
        {
            img = IMG_BONUS_EARTH;
        }

        if( ch == '-' )
        {
            woods.push( { x : x, y : y, onFire : false } );
        }

        if( img )
        {
            bonuses.push(
                {
                    img : img,
                    cellX : x,
                    cellY : y,
                    t : sndRnd() * Math.PI,
                    x : getXFromCell( x ) - img.width / 2,
                    y : getYFromCell( y ) - img.height / 2
                } );
        }
    }



    //------------------------------------------------------
    charState = 'e';

    charMovesCount =
        inVictory =
        inFreeFall =
        charDead =
        airElemPushingBlock =
        cellMovementFinilized =
        prevCharX =
        prevCharY =
        isOnGround =
            0;

    portalledToX = portalledToY = toDieSoon = -1;

    windows[ GAME_WND_WIN ].incoming = true;
    windows[ GAME_WND_WIN ].tdir = 0;

    windows[ GAME_WND_LOSE ].incoming = true;
    windows[ GAME_WND_LOSE ].tdir = 0;

    //-------------------------------------------------------
    // tutorial

    obj = create_Bubble();

    if( levelNum == 0 )
    {
        obj.x = getXFromCell(14) - IMG_SPEECH_BUBBLE.width - 14;
        obj.y = getYFromCell(1) - 6;
        obj.tx = renderText( [ "This is the exit", "Tap it to go there" ] );

        bubble = obj;
    }

    if( levelNum == 1 )
    {
        obj.x = getXFromCell(6) - IMG_SPEECH_BUBBLE_BIG.width - 14;
        obj.y = getYFromCell(1) - 28;
        obj.tx = renderText( [ "Tap here to get the water", "token to be able to move", "inside or over water" ] );

        obj.img = IMG_SPEECH_BUBBLE_BIG;
        obj.isFirst = true;
        obj.text_offset = 16;

        bubble = obj;

        levelSpecificLogicFunc = level1LogicFunc;
    }

    if( levelNum == 2 )
    {
        obj.x = getXFromCell(6) - IMG_SPEECH_BUBBLE.width - 14;
        obj.y = getYFromCell(3) - 6;
        obj.tx = renderText( [ "Tap here to get the", "air token and fly!" ] );
        obj.isFirst = true;

        bubble = obj;

        levelSpecificLogicFunc = level2LogicFunc;
    }

    if( levelNum == 3 )
    {
        obj.x = getXFromCell(10) - IMG_SPEECH_BUBBLE.width - 14;
        obj.y = getYFromCell(1) - 12;
        obj.tx = renderText( [ "Get fire token to burn", "the wooden bridge!" ] );
        obj.isFirst = true;

        bubble = obj;

        levelSpecificLogicFunc = level3LogicFunc;
    }

    if( levelNum == 5 )
    {
        obj.x = getXFromCell(10) - IMG_SPEECH_BUBBLE.width - 14;
        obj.y = getYFromCell(3) - 18;
        obj.tx = renderText( [ "Avoid the void!" ] );
        obj.text_offset = 20;

        bubble = obj;

        levelSpecificLogicFunc = level5LogicFunc;
    }

    if( levelNum == 7 )
    {
        levelSpecificLogicFunc = level7LogicFunc;
    }

    if( levelNum == 8 )
    {
        obj.x = getXFromCell(5) - IMG_SPEECH_BUBBLE_BIG.width - 14;
        obj.y = getYFromCell(5) - 26;
        obj.tx = renderText( [ "Use portals for", "teleporting to a", "different location" ] );
        obj.img = IMG_SPEECH_BUBBLE_BIG;

        bubble = obj;

        levelSpecificLogicFunc = level8LogicFunc;
    }
}

function level1LogicFunc()
{
    if( charState == 'w' && bubble.isFirst )
    {
        bubble.x = getXFromCell(14) - IMG_SPEECH_BUBBLE.width - 14;
        bubble.y = getYFromCell(1) - 18;

        bubble.img = IMG_SPEECH_BUBBLE;
        bubble.text_offset = create_Bubble().text_offset;

        bubble.tx = renderText( [ "Tap here to get", "to the exit now" ] );

        bubble.isFirst = false;
        bubble.t = 0;
    }
}

function level2LogicFunc()
{
    if( charState == 'a' && bubble.isFirst )
    {
        bubble.x = getXFromCell(13) - IMG_SPEECH_BUBBLE.width - 14;
        bubble.y = getYFromCell(1) - 18;

        bubble.img = IMG_SPEECH_BUBBLE;

        bubble.tx = renderText( [ "Fly to the exit now!" ] );

        bubble.text_offset = 20;

        bubble.isFirst = false;
        bubble.t = 0;
    }
}

function level3LogicFunc()
{
    if( charState == 'f' )
    {
        bubble = 0;
    }
}

function level5LogicFunc()
{
    if( !is_undef( typeof voids[ 0 ].x ) )
    {
        bubble.x = voids[ 0 ].x - 220;
    }
}

function level7LogicFunc()
{
    if( charState == 'w' && !bubble )
    {
        bubble = create_Bubble();

        bubble.x = getXFromCell(10) - IMG_SPEECH_BUBBLE_BIG.width - 37;
        bubble.y = getYFromCell(4) - 37;
        bubble.tx = renderText( [ "You can dive in", "and out of water", "when in water state" ] );
        bubble.img = IMG_SPEECH_BUBBLE_BIG;
    }
}

function level8LogicFunc()
{
    if( bubble )
    {
        if( charY - bubble.y > 33 )
        {
            bubble = 0;
        }
    }
}

function getCellX( cx )
{
    return ( ( cx - LEVEL_X ) / CELL_SIZE ) | 0;
}

function getXFromCell( cx )
{
    return cx * CELL_SIZE + LEVEL_X;
}

function getYFromCell( cy )
{
    return cy * CELL_SIZE + LEVEL_Y;
}

function getCellY( cy )
{
    return ( ( cy - LEVEL_Y ) / CELL_SIZE ) | 0;
}

function lerp( a, b, t )
{
    return a + ( b - a ) * t;
}

function getCellAt( cx, cy )
{
    return curLvl.charAt( Math.min( Math.max( cx, 0 ), X_CELLS - 1 ) + Math.min( Math.max( cy, 0 ), Y_CELLS - 1 ) * X_CELLS );
}

function setCellAt( cx, cy, val, i )
{
    i = mini( maxi( cx, 0 ), X_CELLS - 1 ) + mini( maxi( cy, 0 ), Y_CELLS - 1 ) * X_CELLS;
    curLvl = curLvl.substring(0, i) + val + curLvl.substring(i+1);
}

function isCellGroundObstacle( cell )
{
    return cell == 'g' || cell == '-';
}

function isCellGroundObstacleXY( x, y )
{
    return isCellGroundObstacle( getCellAt( x, y ) );
}

function isBlocked( x, y, blo, blodiff, i )
{
    for( i in blocks  )
    {
        blo = blocks[ i ];

        if( blo.cellX == x )
        {
            blodiff = (blo.y - getYFromCell(blo.cellY))/CELL_SIZE;

            if( blo.cellY == y && blodiff < 0.75
                    ||
                blo.cellY == y - 1 && blodiff > 0.25 )
                return 1;
        }
    }

    return 0;
}

function isCellWaterObstacle( cell )
{
    return cell == 'g' || cell == '-' || cell == 'w';
}

function isCellWaterObstacleXY( x, y )
{
    return isCellWaterObstacle( getCellAt( x, y ) );
}

function getBlockCollisionForAir(i,blo)
{
    for( i in blocks )
    {
        blo = blocks[ i ];

        if( mabs(charX - blo.x - HALF_CELL_SIZE) < HALF_CELL_SIZE )
        {
            if( blo.y > charY && blo.y - charY < HALF_CHAR_HEIGHT && blo.dir < 0 )
            {
                return blo;
            }

            if( blo.y < charY && charY - blo.y - CELL_SIZE < HALF_CHAR_HEIGHT && blo.dir > 0 )
            {
                return blo;
            }
        }
    }

    return null;
}

function getCollisionPointY()
{
    var minDist = 1E9,
            cx = getCellX( charX ),
            cy = getCellY( charY ),
            yfc = getYFromCell( cy ),
            yy = cy, i, blo, blockMinDist;

    for( i in blocks )
    {
        blo = blocks[ i ];

        if( mabs(charX - blo.x - HALF_CELL_SIZE) < HALF_CELL_SIZE && charY < blo.y )
        {
            minDist = mini( blo.y - charY, minDist );
        }
    }

    blockMinDist = minDist;

    for( ; yy < Y_CELLS; yy ++, yfc += CELL_SIZE )
    {
        if( charState != 'a' && isCellGroundObstacleXY( cx, yy )
                ||
            charState == 'w' && isCellWaterObstacleXY( cx, yy ) )
        {
            if( yfc > charY )
            {
                minDist = mini( yfc - charY, minDist );
                break;
            }
        }
    }

    if( minDist >= 1E9  )
    {
        if( charState == 'w' && cy == Y_CELLS - 1 && getCellAt( cx, cy ) == 'w' )
        {
            minDist = getYFromCell( Y_CELLS ) - charY;
        }
    }

    isOverBlock = blockMinDist <= minDist;

    return charY + minDist;
}

function updateFreeFall()
{
    if( charState != 'a' )
    {
        var collY = getCollisionPointY();

        if( collY > charY )
        {
            var prospTarg = collY - HALF_CHAR_HEIGHT;

            targY = prospTarg;

            if( !inFreeFall )
            {
                startY = charY;
                charT = 0;

                inFreeFall = 1;
            }

            if( prospTarg - charY > 5 )
            {
                startX = targX = charX;

                superTargCellX = targCellX = charCellX;
                superTargCellY = targCellY = charCellY;
            }
        }
    }
}

function updateTargCoordsFromCellCoords( isXSlide )
{
    charT = 0;

    startX = getXFromCell( charCellX );
    targX = getXFromCell( targCellX );

    startY = getYFromCell( charCellY );
    targY = getYFromCell( targCellY );

    targX += HALF_CELL_SIZE;
    startX += HALF_CELL_SIZE;

    if( charState == 'a' )
    {
        startY += HALF_CELL_SIZE;
        targY += HALF_CELL_SIZE;
    }
    else
    {
        startY += CELL_SIZE - HALF_CHAR_HEIGHT;
        targY += CELL_SIZE - HALF_CHAR_HEIGHT;

        if( isXSlide )
        {
            var colPtY = getCollisionPointY() - HALF_CHAR_HEIGHT;
            startY = mini( startY, colPtY );
            targY = mini( targY, colPtY );
        }
    }
}

function updateCellTarget()
{

    updateFreeFall();

    var isXSlide = 0;

    if( superTargCellX != charCellX && ( !inFreeFall || isOverBlock || (inFreeFall && isOnGround ) ) )
    {
        inFreeFall = 0;

        superTargCellY = targCellY = charCellY;

        if( superTargCellX > charCellX )
        {
            targCellX = charCellX + 1;
        }
        else
        {
            targCellX = charCellX - 1;
        }

        if( isCellGroundObstacleXY( targCellX, charCellY ) || isBlocked( targCellX, charCellY ) )
        {
            superTargCellX = targCellX = charCellX;
            return;
        }

        if( charState == 'a' && getCellAt( targCellX, charCellY ) == 'w' )
        {
            superTargCellX = targCellX = charCellX;
            return;
        }

        targCellY = charCellY;

        isXSlide = 1;

        hadMovement = 1;
    }
    else
    {
        if( superTargCellY != charCellY && ( !inFreeFall || ( inFreeFall && isOnGround ) )&& !(isOverBlock && charState != 'a' ) )
        {
            superTargCellX = targCellX = charCellX;

            if( charState == 'a' )
            {
                if( superTargCellY > charCellY )
                {
                    targCellY = charCellY + 1;
                }
                else
                {
                    targCellY = charCellY - 1;
                }

                if( isCellWaterObstacleXY( charCellX, targCellY ) || isBlocked( charCellX, targCellY  ) )
                {
                    superTargCellY = targCellY = charCellY;
                    return;
                }

                hadMovement = 1;
            }

            if( charState == 'w' )
            {
                if( superTargCellY > charCellY )
                {
                    targCellY = charCellY + 1;
                }
                else
                {
                    targCellY = charCellY - 1;
                }

                if( getCellAt( charCellX, targCellY ) != 'w' && !
                    ( getCellAt( charCellX, charCellY ) == 'w' && getCellAt( charCellX, targCellY ) == '0' ) )
                {
                    superTargCellY = targCellY = charCellY;
                    return;
                }

                hadMovement = 1;
            }

            inFreeFall = 0;
        }
        else
        {
            superTargCellY = targCellY = charCellY;
        }
    }

    if( charCellX != targCellX || charCellY != targCellY )
    {
        updateTargCoordsFromCellCoords( isXSlide );
        cellMovementFinilized = 0;
    }
}

function launchWin(id)
{
    windows[ id ].isVisible = true;
    windows[ id ].tdir = 1.0;
    windows[ id ].t = 0;
}

function I_Die()
{
    if( !charDead )
    {
        SND_DESTROYED.play();

        charDead = 1;

        toDieSoon = 0.44;
    }
}

var xfm_S = 1, setViewportWidth = 0, setViewportHeight = 0;

function updateBaseXForm()
{
    if( !is_undef( innerWidth ) )
    {
        viewportwidth = innerWidth;
        viewportheight = innerHeight;

        if( viewportwidth != setViewportWidth
            ||
            viewportheight != setViewportHeight
            )
        {
            var s = viewportwidth / viewportheight > WIDTH / HEIGHT ? viewportheight / HEIGHT : viewportwidth / WIDTH;

            mainCtx.canvas.width = WIDTH * s;
            mainCtx.canvas.height = HEIGHT * s;

            xfm_S = s;

            canvas.style.left = ((viewportwidth - WIDTH * s) / 2 | 0) + "px";
            canvas.style.top = ((viewportheight - HEIGHT * s ) / 2 | 0) + "px";

            setViewportWidth = viewportwidth;
            setViewportHeight = viewportheight;
        }
    }
}

function flipBuffer()
{
    mainCtx.drawImage( bufferCanvas, 0, 0, WIDTH, HEIGHT, 0, 0, mainCtx.canvas.width, mainCtx.canvas.height );
}

function checkOtherCharCollisions()
{
    var i, elem = getCellAt( charCellX, charCellY );

    if( elem == 'W' || elem == 'E' ||
        elem == 'F' || elem == 'A'
        )
    {
        var newState = elem.toLowerCase();

        superTargCellX = targCellX = charCellX;
        superTargCellY = targCellY = charCellY;

        charState = newState;

        if( charState == 'a')
            SND_WIND.play();
        else
            SND_TRANSFORM.play();

        inFreeFall = 0;

        setCellAt( charCellX, charCellY, '0' );

        updateTargCoordsFromCellCoords( false );

        for( i in bonuses )
        {
            if( bonuses[ i ].cellX == charCellX && bonuses[ i ].cellY == charCellY )
            {
                bonuses.splice( i, 1 );
                break;
            }
        }
    }

    if( elem == 'x' && !inVictory )
    {
        bubble = 0;
        levelSpecificLogicFunc = null;
        inVictory = 1;
        SND_WIN.play();

        if( levelNum == 19 )
        {
            windows[ GAME_WND_WIN ].txt = "Game Complete!";
            buttons[ 2 ].txt = "Main  Menu";
        }

        launchWin( GAME_WND_WIN );
    }

    if( charState == 'f' )
    {
        if( getCellAt( charCellX, charCellY + 1 ) == '-' )
        {
            for( i in woods )
            {
                var wood = woods[ i ];
                if( wood.x == charCellX && wood.y == charCellY + 1 && !wood.onFire )
                {
                    wood.onFire = true;
                    wood.fireT = 0;
                }
            }
        }

        if( getCellAt( charCellX, charCellY + 1 ) == 'w'
            ||
            getCellAt( charCellX, charCellY ) == 'w'
            )
        {
            I_Die();
        }
    }
}

var justPortalled = 0;

function checkPortalCollisions()
{
    var i, p, ii, pp;

    for( i in portals )
    {
        p = portals[ i ];
        if( p.x == charCellX && p.y == charCellY
                &&
            ( p.x != portalledToX || p.y != portalledToY ) )
        {
            for( ii in portals )
            {
                pp = portals[ ii ];
                if( ii != i && p.idx == pp.idx )
                {
                    portalledToX = pp.x;
                    portalledToY = pp.y;
                    charCellX = targCellX = superTargCellX = pp.x;
                    charCellY = targCellY = superTargCellY = pp.y;
                    inFreeFall = 0;
                    updateTargCoordsFromCellCoords( false );
                    charX = startX;
                    charY = startY;
                    SND_PORTAL.play();
                    justPortalled = 1;
                    return;
                }
            }
        }
    }
}

function gameLoop()
{
    isMenu = 0;

    var i, x, y, xx, yy,
        now = new Date(),
        elapsedSeconds = mini( (now - lastTick) / 1000, 0.22),
        totalSeconds = (now - startTick) / 1000,
        obj, t0, t1, tt, img;

    updateBaseXForm();

    inGame = true;

    lastTick = now;

    scrollImage( IMG_WATER, IMG_WATER_SRC, totalSeconds * 8 );

    //---------------------------------------------
    //----- Update

    if( toDieSoon >= 0 )
    {
        toDieSoon -= elapsedSeconds;

        if( toDieSoon < 0 )
        {
            setTimeout( function() { SND_LOSE.play(); }, 400 );
            launchWin( GAME_WND_LOSE );
            bubble = 0;
            levelSpecificLogicFunc = null;
            inVictory = 1;
        }
    }

    if( !inVictory && !charDead )
    {
        if( charCellX != portalledToX ||
            charCellY != portalledToY
            )
        {
            portalledToX = -1;
            portalledToY = -1;
        }

        for( i in voids )
        {
            obj = voids[ i ];

            var cd = obj.upperB - obj.lowerB;
            var d = cd * CELL_SIZE;

            obj.t += obj.dir * elapsedSeconds / cd;

            if( obj.t > 1 )
            {
                obj.dir = -obj.dir;
                obj.t = 2 - obj.t;
            }

            if( obj.t < 0 )
            {
                obj.t = -obj.t;
                obj.dir = -obj.dir;
            }

            if( obj.isVertical )
            {
                x = getXFromCell( obj.cellX );
                y = getYFromCell( obj.cellY + obj.lowerB ) + d * obj.t;
            }
            else
            {
                x = getXFromCell( obj.cellX + obj.lowerB ) + d * obj.t;
                y = getYFromCell( obj.cellY );
            }

            x += HALF_CELL_SIZE;
            y += HALF_CELL_SIZE;

            obj.x = x - IMG_VOID[ 0 ].width / 2;
            obj.y = y - IMG_VOID[ 0 ].height / 2;

            if( Math.sqrt( (x - charX ) * (x - charX ) + (y - charY ) * (y - charY ) ) < HALF_CELL_SIZE )
            {
                I_Die();
            }
        }

        for( i in blocks )
        {
            obj = blocks[ i ];

            if( mabs( charX - obj.x - HALF_CELL_SIZE ) < HALF_CELL_SIZE )
            {
                var todie = 0;
                if( obj.dir > 0 )
                {
                    var cell = getCellAt( charCellX, charCellY + 1 );

                    if( cell == 'g' || cell == '-' )
                    {
                        if( charY > obj.y + HALF_CELL_SIZE && getYFromCell( charCellY + 1 ) - obj.y - CELL_SIZE < HALF_CHAR_HEIGHT * 1.5 )
                        {
                            todie = 1;
                        }
                    }
                }
                else
                {
                    cell = getCellAt( charCellX, charCellY - 1 );

                    if( cell == 'g' || cell == '-' )
                    {
                        if( charY < obj.y + HALF_CELL_SIZE && obj.y - getYFromCell( charCellY ) < HALF_CHAR_HEIGHT * 1.5 )
                        {
                            todie = 1;
                        }
                    }
                }

                if( todie )
                {
                    obj.dir = 0;
                    I_Die();
                    break;
                }
            }
        }

        charT += elapsedSeconds * 8;

        if( charState == 'a' )
        {
            airElemPushingBlock = getBlockCollisionForAir();
        }

        var isInAirElemPush = airElemPushingBlock && charState == 'a';

        if( isInAirElemPush )
        {
            charX = lerp( startX, targX, mini( charT, 1 ) );

            if( charY < airElemPushingBlock.y )
                charY = airElemPushingBlock.y - HALF_CHAR_HEIGHT;
            else
                charY = airElemPushingBlock.y + CELL_SIZE + HALF_CHAR_HEIGHT;

            startY = targY = charY;

            charCellX = getCellX( charX );
            charCellY = getCellY( charY );

            superTargCellX = targCellX;
            superTargCellY = targCellY = charCellY;


            if( prevCharX != charX || prevCharY != charY )
            {
                checkOtherCharCollisions();
                checkPortalCollisions();
            }
        }

        if( inFreeFall && !isInAirElemPush )
        {
            charY = startY + charT * charT * 4;
            charX = startX;

            var needCheckStuff = 1;

            if( charY >= targY )
            {
                isOnGround = 1;

                if( targY - startY > HALF_CELL_SIZE )
                {
                    SND_FALL.play();
                }

                charY = targY;

                if( isOverBlock )
                {
                    startY = charY;
                    charT = 2;
                }
                else
                {
                    charT = 0;
                    inFreeFall = 0;
                }

                if( prevCharX == charX || prevCharY == charY )
                {
                    needCheckStuff = 0;
                }
            }
            else
            {
                isOnGround = 0;
            }

            charCellX = getCellX( charX );
            charCellY = getCellY( charY );

            if( charState == 'f' && getCellAt( charCellX, charCellY ) == 'w'
                ||
                charCellY >= Y_CELLS
                )
            {
                I_Die();
            }

            if( needCheckStuff )
            {
                checkOtherCharCollisions();
                checkPortalCollisions();
            }

            updateFreeFall();
        }

        if( !inFreeFall && !isInAirElemPush )
        {
            if( charT < 1 )
            {
                charX = lerp( startX, targX, charT );
                charY = lerp( startY, targY, charT );
            }
            else
            {
                var prevCharState = 0;
                if( !cellMovementFinilized )
                {
                    prevCharState = charState;

                    cellMovementFinilized = 1;

                    charCellY = targCellY;
                    charCellX = targCellX;

                    checkPortalCollisions();

                    if( hadMovement && clickedForMovement )
                    {
                        charMovesCount ++;
                        clickedForMovement = 0;
                        hadMovement = 0;
                    }

                    charX = targX;
                    charY = targY;

                    checkOtherCharCollisions();

                    if( charState == 'w' )
                    {
                        if( getCellAt( charCellX, charCellY + 1 ) == '-' )
                        {
                            for( i in woods )
                            {
                                obj = woods[ i ];
                                if( obj.x == charCellX && obj.y == charCellY + 1
                                    &&
                                    obj.onFire
                                    )
                                {
                                    I_Die();
                                }
                            }
                        }
                    }

                    if( charCellY >= Y_CELLS || charCellY < 0 || charCellX < 0 || charCellX >= X_CELLS  )
                    {
                        I_Die();
                    }

                    startX = charX;
                    startY = charY;
                }

                updateCellTarget();

                if( prevCharState == 'a' && targCellX == charCellX && targCellY == charCellY && !justPortalled )
                {
                    SND_FALL.play();
                }
            }
        }
    }

    justPortalled = 0;

    //---------------------------------------------
    //----- Draw

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx_drawImage(ctx, levelBuf, LEVEL_X, LEVEL_Y );

    fireAnimIdx = ( fireAnimIdx + elapsedSeconds * 11 ) % IMG_WOOD_FIRE.length;
    anim_x3_frameIdx = ( anim_x3_frameIdx + elapsedSeconds * 10 ) % 3;

    for( i in woods )
    {
        obj = woods[ i ];
        ctx_drawImage(ctx, IMG_WOOD, getXFromCell(obj.x), getYFromCell(obj.y) );
    }

    //-------------------------------
    // Blocks

    for( i in blocks )
    {
        obj = blocks[ i ];
        x = getXFromCell( obj.cellX );
        y = getYFromCell( obj.top );

        var dst;

        xx = x;
        yy = getYFromCell( obj.bottom );

        dst = obj.bottom - obj.top;

        obj.t += elapsedSeconds * obj.dir / dst;

        if( obj.t >= 1 )
        {
            obj.t =  2 - obj.t;
            obj.dir = -obj.dir;
        }

        if( obj.t <= 0 )
        {
            obj.t = -obj.t;
            obj.dir = -obj.dir;
        }

        x = lerp( x, xx, obj.t );
        y = lerp( y, yy, obj.t );

        obj.x = x;
        obj.y = y;

        obj.cellY = mini( maxi( getCellY( y ), obj.top ), obj.bottom );

        ctx_drawImage(ctx, IMG_BLOCK, x, y );
    }

    //-------------------------------
    // Portals

    img = IMG_PORTAL[ anim_x3_frameIdx | 0 ];

    for( i in portals )
    {
        obj = portals[ i ];

        ctx_drawImage(ctx, img,
                        getXFromCell( obj.x ) + ( CELL_SIZE - img.width ) / 2,
                        getYFromCell( obj.y ) + ( CELL_SIZE - img.height ) / 2 );
    }

    for( i in voids )
    {
        obj = voids[ i ];
        ctx_drawImage(ctx, IMG_VOID[ anim_x3_frameIdx | 0 ], obj.x, obj.y );
    }

    img = IMG_CHAR_EARTH;
	
	if( charState == 'a' ) img = IMG_CHAR_AIR[ anim_x3_frameIdx | 0 ];
    if( charState == 'f' ) img = IMG_CHAR_FIRE[ anim_x3_frameIdx | 0 ];
    if( charState == 'w' ) img = IMG_CHAR_WATER[ anim_x3_frameIdx  | 0 ];

    var w2 = img.width / 2, h2 = img.height / 2, off_x, off_y;

    ctx.translate( -w2, -h2 );
    ctx_drawImage(ctx, img, charX, charY );
    ctx.translate( w2, h2 );

    for( i in bonuses )
    {
        obj = bonuses[ i ];

        obj.t += elapsedSeconds * 5;

        ctx_drawImage(ctx, obj.img, obj.x + HALF_CELL_SIZE, ( obj.y + HALF_CELL_SIZE + sine( obj.t ) * 6 ) | 0 );
    }

    //-------------------------------
    // FIRE

    for( i = 0; i < woods.length;  )
    {
        obj = woods[ i ];

        xx = getXFromCell(obj.x);
        yy = getXFromCell(obj.y);

        if( obj.onFire )
        {
            obj.fireT += elapsedSeconds;

            if( obj.fireT > 2.33 )
            {
                setCellAt( obj.x, obj.y, '0' );
                woods.splice( i, 1 );
                SND_DESTROYED.play();
                continue;
            }

            img = IMG_WOOD_FIRE[ fireAnimIdx | 0 ];

            ctx_drawImage(ctx,  img,
                            xx + (CELL_SIZE - img.width) / 2,
                            yy - img.height + IMG_WOOD.height / 2 );
        }

        i ++;
    }

    //-------------------------------

    for( y = 0; y < Y_CELLS; y ++ )
    {
        for( x = 0; x < X_CELLS; x ++ )
        {
            if( curLvl.charAt( x + y * X_CELLS ) == 'w' )
            {
                ctx_drawImage(ctx, IMG_WATER, LEVEL_X + x * CELL_SIZE, LEVEL_Y + y * CELL_SIZE );
            }
        }
    }


    //-------------------------------
    // UI

    print_15x15( ctx, "Level " + ( levelNum + 1 ), 22, 33 );

    var msg =  "Moves: " + charMovesCount;
    print_15x15( ctx, msg, WIDTH - get_5x5_width(msg) * 3 - 19, 33 );

    for(  i in windows )
    {
        var obj = windows[ i ];

        if( obj.isVisible )
        {
            obj.t = mini( obj.t + elapsedSeconds * obj.tdir, 1 );

            if( obj.incoming )
            {
                t0 = power( obj.t, 1.75 );
                t1 = power( obj.t, 3 );

                obj.x = obj.sx + (obj.ex - obj.sx) + ( obj.ex - obj.sx ) * power( 2, -3* power( t1 * 4, 0.75 ) ) * sine( (t1*4-0.5) * Math.PI );
                obj.y = obj.sy + (obj.ey - obj.sy) + ( obj.ey - obj.sy ) * power( 2, -3* power( t0 * 4, 0.75 ) ) * sine( (t0*4-0.5) * Math.PI );
            }
            else
            {
                obj.x = obj.ex - obj.t * obj.t * obj.t * WIDTH * 4;
                obj.y = obj.ey;

                if( obj.t >= 1.0 && !is_undef( obj.onOut ) )
                {
                    obj.onOut();
                    obj.isVisible = false;
                }
            }

            ctx_drawImage(ctx, obj.img, obj.x, obj.y );
        }

        print_20x20_grey( ctx, obj.txt, obj.x + (obj.img.width - get_5x5_width(obj.txt) * 4) / 2 + 3, obj.y + 124 );
        print_20x20( ctx, obj.txt, obj.x + (obj.img.width - get_5x5_width(obj.txt) * 4) / 2, obj.y + 121);
    }

    for( i in buttons )
    {
        obj = buttons[ i ];

        if(obj.prnt)
        {
            if( !obj.prnt.isVisible )
                continue;

            obj.x = obj.offx + obj.prnt.x;
            obj.y = obj.offy + obj.prnt.y;
        }

        btn_Draw( obj );
    }

    // Speech Bubbles

    if( bubble )
    {
        bubble.t += elapsedSeconds;

        var offset = -48 * mabs( sine( bubble.t * Math.PI * 0.67 * 5 ) ) * maxi ( 0.67 -  bubble.t, 0  ) | 0;

        ctx_drawImage(ctx, bubble.img, bubble.x, bubble.y + offset);
        ctx_drawImage(ctx, bubble.tx, bubble.x + (bubble.img.width - bubble.tx.width)/2, bubble.y + bubble.text_offset + offset );
    }

    if( levelSpecificLogicFunc )
        levelSpecificLogicFunc();

    prevCharX = charX;
    prevCharY = charY;

    flipBuffer();
}
/** @const */ var GAME_WND_WIN = 0;
/** @const */ var GAME_WND_LOSE = 1;

function onNext()
{
    windows[ GAME_WND_WIN ].incoming = false;
    windows[ GAME_WND_WIN ].t = 0;
}

function onRestart()
{
    windows[ GAME_WND_LOSE ].incoming = false;
    windows[ GAME_WND_LOSE ].t = 0;
}

function doRestart()
{
    if( !inVictory )
        prepareLvl( levelNum );
    else
        SND_RECHAZADO.play();
}

function doQuit()
{
    createMenu();
}

function createGame()
{
    var winBk = amplifyImage( renderToCanvas( 110, 82, createWinBk ), 4),
        restartBk = amplifyImage( renderToCanvas( 40, 12, createButtonBk ), 4),
        buttBk = amplifyImage( renderToCanvas( 56, 20, createButtonBk ), 4),
        w, b;

    windows = [];
    buttons = [];

    buttons.push( create_Button( restartBk, "Restart", doRestart, 8, HEIGHT - 110 ) );
    buttons.push( create_Button( restartBk, "Quit", doQuit, 8, HEIGHT - 64 ) );

    w = create_Window( winBk );

    w.txt = "Level Complete!";

    w.onOut = function()
    {
        if( levelNum == 19 )
        {
            createMenu();
        }
        else
        {
            prepareLvl( levels.indexOf(curLvlAtStart) + 1 );
        }
    }

    windows[ GAME_WND_WIN ] = w;

    b = create_Button( buttBk, "Next Level", onNext, ( w.img.width - buttBk.width ) / 2, w.img.height - 121 );
    btn_Parentize( b, w );

    buttons.push( b );

    w = create_Window( winBk );

    w.txt = "Level Failed!";

    w.onOut = function()
    {
        prepareLvl( levelNum );
    }

    windows[ GAME_WND_LOSE ] = w;

    b = create_Button( buttBk, "Restart", onRestart, ( w.img.width - buttBk.width ) / 2, w.img.height - 121 );
    btn_Parentize( b, w );

    buttons.push( b );

    IMG_SPEECH_BUBBLE = amplifyImage( renderToCanvas( 64, 18, drawBubble ), 4 );
    IMG_SPEECH_BUBBLE_BIG = amplifyImage( renderToCanvas( 72, 24, drawBubble ), 4 );
}

///////////////////////////////////////////////////////////////////////

function createLevelSelection()
{
    buttons = [];

    var lvlBk = amplifyImage( renderToCanvas( 40, 24, createButtonBk ), 4),
        maxLevel = 0,
        i = 0;

    if( !is_undef( localStorage['elepuzzle_max_level'] ) )
    {
        maxLevel = localStorage['elepuzzle_max_level'];
    }

    if( isNaN( maxLevel ) )
        maxLevel = 0;

    for( ; i < 20; i ++ )
    {
        buttons[ i ] = create_Button(lvlBk, i <= maxLevel ? "Lev " + (i + 1) : "Locked",

                i <= maxLevel
                        ?
                function (i){
                    return function(){
                    createGame();

                    prepareLvl( i );

                    clearInterval(lastIntervalHandle);

                    lastTick = new Date();
                    lastIntervalHandle = setInterval(gameLoop, 1000 / 30); } }(i)
                            :
                function () { SND_RECHAZADO.play(); }
                ,
                ( i % 5 ) * 154 + 12, 88 + ( i / 5 | 0 ) * 90 );
    }

    clearInterval(lastIntervalHandle);
    lastIntervalHandle = setInterval(selectLevelLoop, 1000 / 30);
}

///////////////////////////////////////////////////////////////////////

var menuTitle0, menuTitle1;

function printTitle(str)
{
    return function(tctx)
    {
        print_15x15_grey( tctx, str, 1, 1 );
        print_15x15_grey( tctx, str, 2, 2 );
        print_15x15( tctx, str, 0, 0 );
    };
}

function createMenu()
{
    buttons = [];

    var buttBk = amplifyImage( renderToCanvas( 67, 18, createButtonBk ), 4 );

    menuTitle0 = amplifyImage( renderToCanvas( 132, 24 , printTitle("Element") ), 3 );
    menuTitle1 = amplifyImage( renderToCanvas( 132, 24 , printTitle("Puzzle") ), 3 );

    buttons[ 0 ] = create_Button( buttBk, "Start", onNewGame, ( WIDTH - buttBk.width ) / 2, 300 );

    clearInterval(lastIntervalHandle);
    lastIntervalHandle = setInterval(menuLoop, 1000 / 30);
}

function loadLoop()
{
    ctx_ClearRect(ctx,WIDTH,HEIGHT);
    ctx.fillStyle = '#389';
    ctx.fillText( "Loading... ", ( WIDTH - 100 ) / 2, HEIGHT / 2);

    flipBuffer();

    if( loadedImages == numImages )
    {
        var mapS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.,!?', i, chr;
        for( i in mapS )
        {
            chr = mapS.charAt( i );
            fontmap[ chr ] = 6 * i;

            if( chr >= 'A' && chr <= 'Z' )
            {
                fontmap[ chr.toLowerCase() ] = 6 * i;
            }
        }

        IMG_BACKGROUND = amplifyImage( images.bkGround, 4 );
        IMG_GROUND = amplifyImage( images.ground, 4 );
        IMG_GROUND_UP = amplifyImage( images.ground_up, 4 );
        IMG_WATER_SRC = amplifyImage( images.water, 4, 0.67 );
        IMG_WATER = createCanvas(IMG_WATER_SRC.width,IMG_WATER_SRC.height);

        scrollImage( IMG_WATER, IMG_WATER_SRC, 0 );

        IMG_WOOD = amplifyImage( images.wood, 4 );
        IMG_WOOD_FIRE = [];
        IMG_WOOD_FIRE[ 0 ] = amplifyImage( cutImage( images.wood_fire, 0, 14 ), 4 );
        IMG_WOOD_FIRE[ 1 ] = amplifyImage( cutImage( images.wood_fire, 14, 28 ), 4 );
        IMG_WOOD_FIRE[ 2 ] = amplifyImage( cutImage( images.wood_fire, 28, 42 ), 4 );
        IMG_WOOD_FIRE[ 3 ] = amplifyImage( cutImage( images.wood_fire, 42, 56 ), 4 );
        IMG_EXIT = amplifyImage( images.exit, 4 );

        IMG_CHAR_AIR = [];
        IMG_CHAR_AIR[ 0 ] = amplifyImage( cutImage( images.char_air, 0, 10 ), 4 );
        IMG_CHAR_AIR[ 1 ] = amplifyImage( cutImage( images.char_air, 10, 20 ), 4 );
        IMG_CHAR_AIR[ 2 ] = amplifyImage( cutImage( images.char_air, 20, 30 ), 4 );

        IMG_CHAR_EARTH = amplifyImage( images.char_earth, 4 );

        HALF_CHAR_HEIGHT = IMG_CHAR_EARTH.width / 2;

        IMG_CHAR_FIRE = [];
        IMG_CHAR_FIRE[ 0 ] = amplifyImage( cutImage( images.char_fire, 0, 10 ), 4 );
        IMG_CHAR_FIRE[ 1 ] = amplifyImage( cutImage( images.char_fire, 10, 20 ), 4 );
        IMG_CHAR_FIRE[ 2 ] = amplifyImage( cutImage( images.char_fire, 20, 30 ), 4 );
        IMG_CHAR_WATER = [];

        IMG_CHAR_WATER[ 0 ] = amplifyImage( cutImage( images.char_water, 0, 10 ), 4 );
        IMG_CHAR_WATER[ 1 ] = amplifyImage( cutImage( images.char_water, 10, 20 ), 4 );
        IMG_CHAR_WATER[ 2 ] = amplifyImage( cutImage( images.char_water, 20, 30 ), 4 );

        IMG_BONUS_AIR = amplifyImage( images.bonus_air, 4 );
        IMG_BONUS_EARTH = amplifyImage( images.bonus_earth, 4 );
        IMG_BONUS_FIRE = amplifyImage( images.bonus_fire, 4 );
        IMG_BONUS_WATER = amplifyImage( images.bonus_water, 4 );

        IMG_VOID = [];
        IMG_VOID[ 0 ] = amplifyImage( cutImage( images.the_void, 0, 12 ), 4 );
        IMG_VOID[ 1 ] = amplifyImage( cutImage( images.the_void, 12, 24 ), 4 );
        IMG_VOID[ 2 ] = amplifyImage( cutImage( images.the_void, 24, 36 ), 4 );

        IMG_PORTAL = [];
        IMG_PORTAL[ 0 ] = amplifyImage( cutImage( images.portal, 0, 12 ), 4 );
        IMG_PORTAL[ 1 ] = amplifyImage( cutImage( images.portal, 12, 24 ), 4 );
        IMG_PORTAL[ 2 ] = amplifyImage( cutImage( images.portal, 24, 36 ), 4 );

        IMG_BLOCK = amplifyImage( images.block, 4 );

        IMG_FONT = images.font;

        IMG_FONT_X2_WHITE = amplifyImage( changeMonoSpriteColor( IMG_FONT, 255, 255, 255 ), 2 );

        IMG_FONT_X3 = amplifyImage( changeMonoSpriteColor( IMG_FONT, 255, 255, 255 ), 3 );
        IMG_FONT_GREY_X3 = amplifyImage( changeMonoSpriteColor( IMG_FONT, 64, 63, 64 ), 3 );

        IMG_FONT_X4 = amplifyImage( changeMonoSpriteColor( IMG_FONT, 255, 255, 255 ), 4 );
        IMG_FONT_GREY_X4 = amplifyImage( changeMonoSpriteColor( IMG_FONT, 64, 63, 64 ), 4 );

        createMenu();
    }
}

lastIntervalHandle = setInterval(loadLoop, 1000 / 30);

}());