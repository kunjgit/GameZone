var towerPicker = new (function(canvas){

	this.contextMenu = function(x,y){

	}

	var menu = document.getElementById('menu')

	var currentDrag;
	var lastHover = {x:0,y:0}

	var mousedown = function(){
		currentDrag = this.getAttribute('data-i')

		document.addEventListener('mousemove',mousemove,false)
		document.addEventListener('mouseup',mouseup,false)
	}
	var mouseup = function(){
		document.removeEventListener('mousemove',mousemove,false)
		document.removeEventListener('mouseup',mouseup,false)

		if( lastHover ){

			map.get(lastHover.x , lastHover.y).hover = false

			if( map.get( lastHover.x,lastHover.y ).h <= 1 )
				return

			// test if there is already a tower
			var cell = map.get( lastHover.x,lastHover.y )
			if( cell.tower ){
				// yes , try to upgrade
				var newType = ( cell.tower.type + currentDrag ).split('').sort().join('')
				if( dataTower[ newType ] )
					cell.tower.type = newType
			}else
				// nop place one
				towerPool.addTower(lastHover.x,lastHover.y,currentDrag)

		}
		
	}
	var mousemove = function( e ){

		if( lastHover )
			map.get(lastHover.x , lastHover.y).hover = false

		if( (lastHover=touch.collide( {x:e.pageX -canvas.width/2 , y:e.pageY - canvas.height/2  } ) ) ){

			map.get(lastHover.x , lastHover.y).hover = true

		}
	}

	this.init = function( dataElement ){

		menu.innerHTML = '<ul><li data-i="f" style="background:#DD5616">fire</li><li data-i="e" style="background:#94330D">earth</li></ul>'

		var lis = menu.querySelectorAll('li')
		for( var i = lis.length;i--;)
			lis[i].addEventListener('mousedown',mousedown,false)
	}

})(document.getElementById('canvas'));