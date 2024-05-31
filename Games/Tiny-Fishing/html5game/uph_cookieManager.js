
var version = "1.0";

function cookieSet(argument0, argument1, argument2)
{
	/*
	argument0 = c_name
	argument1 = value
	argument2 = exdays
	*/
	try {
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + argument2);
		var c_value=escape(argument1) + ((argument2==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=argument0 + "=" + c_value;
		return 1;
	} catch(e) {
		return e;
	}
}

function cookieGet(argument0)
{
	try {
		var c_name = argument0;
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start == -1)
		  {
		  c_start = c_value.indexOf(c_name + "=");
		  }
		if (c_start == -1)
		  {
		  c_value = null;
		  }
		else
		  {
		  c_start = c_value.indexOf("=", c_start) + 1;
		  var c_end = c_value.indexOf(";", c_start);
		  if (c_end == -1)
		  {
		c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
		}
		return c_value;
	} catch(e) {
		return e;
	}
}

function cookieExsists(argument0)
{
  try {
	  var cookiename=cookieGet(argument0);
	  if (cookiename!=null && cookiename!="")
	  {
	  return 1;
	  }
	else 
	  {
	  return 0;
	  }
	} catch(e) {
	  return e;
	}
}