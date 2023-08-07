var gen_arr=[]
var input_arr=[]
var level,can_input,delay,isgameover,playing
var tap=new Audio("assets/audio/tapsound.ogg")
var wintune = new Audio("assets/audio/win.mp3")
var wrong = new Audio("assets/audio/wrong.ogg")
var completed=new Audio("assets/audio/completed.mp3")

function create_game()//to initilize and create game
{
	level=1
	can_input=false
	delay=0
	isgameover=false
	gen_arr=[]
	input_arr=[]
	wintune.pause()
	$(".eachled").removeClass("correctled wrongled")
	$(".ibutton").removeClass("ibuttonpressed ibuttonready ibuttonwrong")
	$(".task_comp p").css("display","none")
	$(".task_comp p").removeClass("animate__animated animate__fadeInUp")
	$(".reactor").removeClass("animate__animated animate__zoomOut")
	$(".reactor").addClass("animate__animated animate__zoomIn")
	for(i=1;i<=5;i++)
	{
		rand=Math.floor(Math.random()*9)+1;
		gen_arr.push(rand)
	}
	output_signals()//starting game
}

function animate_pressed_button(name)//to animate pressed buttons
{
	$("#"+name).addClass("ibuttonpressed")
	setTimeout(function(){
	$("#"+name).removeClass("ibuttonpressed")
	},400)
}
function animate_sequence_button(id)//to animate left sequence buttons
{
	$(id).addClass("active")
	setTimeout(function(){
	$(id).removeClass("active")
	},400)
}

$(".ibutton").click(function()//when user click buttons
{
	if (can_input)
	{
		buttonid=$(this).attr("id")
		validate_input(buttonid)
	}
})

function validate_input(buttonid)//tovalidate user input
{
	animate_pressed_button(buttonid)
	input_arr.push(parseInt(buttonid.charAt(2)))
	if(input_arr[input_arr.length-1]!=gen_arr[input_arr.length-1])
	{
		isgameover=true
		can_input=false
		gameover()
	}
	if(!isgameover)
	{
		tap.play()
		$("#il"+input_arr.length).addClass("correctled")
	}
	if(input_arr.length==level && !isgameover)
	{
		level+=1
		delay=0
		input_arr=[]
		if(level==6)
			win()
		else
		{
			setTimeout(function()
			{
				can_input=false
				$(".rled").removeClass("correctled")
				$(".ibutton").removeClass("ibuttonready")
				output_signals()
			},800)
		}
	}
}
function output_signals()//to give left sequence output to user
{
	setTimeout(function()
	{
		$("#ol"+level).addClass("correctled")
	},500)
	gen_arr.forEach( function(element, index) {
		if(index<level)
		{
			setTimeout(function(){
				tap.play()
				animate_sequence_button("#ob"+element)
			},delay+=1000)
		}
	})
	setTimeout(function(){
		can_input=true
		$(".ibutton").addClass("ibuttonready")
	},delay+=500)
	
}
function gameover()//game over
{
	wrong.play()
	$(".ibutton").removeClass("ibuttonpressed ibuttonready")
	$(".rled").removeClass("correctled")
	$(".ibutton").addClass("ibuttonwrong")
	$(".rled").addClass("wrongled")
	setTimeout(function(){
		$(".ibutton").removeClass("ibuttonwrong")
		$(".rled").removeClass("wrongled")
	},300)
	setTimeout(function(){
		$(".ibutton").addClass("ibuttonwrong")
		$(".rled").addClass("wrongled")
	},600)
	setTimeout(function(){
		create_game()
	},1000)
}

function win()
{
	completed.play()
	$(".task_comp p").css("display","block")
	$(".task_comp p").addClass("animate__animated animate__fadeInUp")
	setTimeout(function(){
		$(".reactor").addClass("animate__animated animate__zoomOut")
		wintune.play()
		clearInterval(playing);
	},1000)
}
function animate_playing()
{
	playing=setInterval(function(){
		$("#speaker").css("visibility","hidden")
		setTimeout(function(){
			$("#speaker").css("visibility","visible")
		},500)
	},1000)
}
$("#startgame").click(function()
{
	create_game()
	animate_playing()
})