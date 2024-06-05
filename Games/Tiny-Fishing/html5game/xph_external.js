
function js_GetExternalGameData(projectName, keyname, extraInfo, defaultValue)
{
	if (window.ZenExternal)
	{
		return ZenExternal.getProjectData(projectName, keyname, extraInfo);
	} else
	{
		return defaultValue;
	}
}

function js_GetExternalData(keyname, extraInfo, defaultValue)
{
	if (window.ZenExternal)
	{
		return ZenExternal.getData(keyname, extraInfo);
	} else
	{
		return defaultValue;
	}
}


function js_LoadExternalFile(filepath)
{
	var x = document.createElement('script');
	x.src = filepath;
	document.getElementsByTagName("head")[0].appendChild(x);
}