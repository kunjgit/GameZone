<?php

	function in_array_point($x, &$points)
	{
		foreach($points as $point)
		{
			if($point[0] == $x)
			{
				return true;
			}
		}

		return false;
	}

	function search_point($x, &$points)
	{
		for($i = 0; $i < count($points); $i++)
		{
			if($points[$i][0] == $x)
			{
				return $i;
			}
		}

		die('error');
	}

	if($argc < 2)
	{
		die('Missing parameters');
	}

	$source = $argv[1];
	$destination = $argv[2];

	if(!file_exists($source))
	{
		die('Source not exist');
	}

	$material_source = str_replace('.obj', '.mtl', $source);
	if(!file_exists($material_source))
	{
		die('Material not exist');
	}

	// MTL

	$material_lines = file($material_source);

	$materials = Array();
	$active_material = false;

	foreach($material_lines as $line)
	{
		list($command) = explode(' ', $line);

		switch($command)
		{
			case 'newmtl': {

				list($command, $name) = explode(' ', $line);
				$active_material = trim($name);

				break;
			}

			// dyffuse
			case 'Kd': {

				if($active_material)
				{
					list($command, $r,$g,$b) = explode(' ', $line);
					$r = base_convert(round(255*floatval($r)), 10, 16);
					$g = base_convert(round(255*floatval($g)), 10, 16);
					$b = base_convert(round(255*floatval($b)), 10, 16);

					if(strlen($r) == 1) $r = '0'.$r;
					if(strlen($g) == 1) $g = '0'.$g;
					if(strlen($b) == 1) $b = '0'.$b;

					$materials[trim($active_material)] = $r.$g.$b;

					$active_material = false;
				}

				break;
			}
		}
	}

	// OBJ

	$vertices = Array();
	$faces = Array();

	$points = Array();
	$colors = Array();

	$lines = file($source);

	$active_material = false;

	foreach($lines as $line)
	{
		list($command) = explode(' ', $line);

		switch($command)
		{
			case 'usemtl':
			{
				list($command, $name) = explode(' ', $line);
				$active_material = trim($name);

				break;
			}

			case 'v':
			{
				list($v, $x, $y, $z) = explode(' ', str_replace(Array('/',"\n","\t","\r"), '', trim($line)));
				$vertices[] = array($x, $y, $z);

				if(!in_array_point($x, $points))
				{
					$points[] = array($x, ($x >= 0 ? '' : '-') . base_convert($x*1000000,10,36));
				}

				if(!in_array_point($y, $points))
				{
					$points[] = array($y, ($y >= 0 ? '' : '-') . base_convert($y*1000000,10,36));
				}

				if(!in_array_point($z, $points))
				{
					$points[] = array($z, ($z >= 0 ? '' : '-') . base_convert($z*1000000,10,36));
				}

				break;
			}

			case 'f':
			{
				if($active_material)
				{
					list($f, $a, $b, $c) = explode(' ', str_replace(Array('/',"\n","\t","\r"), '', $line));

					$faces[] = array( $a-1, $b-1, $c-1, $active_material); // count from 0
				}
				else
				{
					die('Missing material');
				}

				break;
			}
		}
	}

	// draw JS

	$out = '';
	foreach($points as $p)
	{
		$out .= $p[1] .' ';
	}
	$output = "var _p = \"".trim($out)."\".split(\" \");\n";

	$out = '';
	foreach($vertices as $v)
	{
		$out .= search_point($v[0],$points).' '.search_point($v[1],$points).' '.search_point($v[2],$points).' ';
	}
	$output .= "var _v = \"".trim($out)."\".split(\" \");\n";

	$out = '';
	foreach($faces as $f)
	{
		$out .= base_convert($f[0],10,36)." ".base_convert($f[1],10,36)." ".base_convert($f[2],10,36)." ";
	}
	$output .= "var _f = \"".trim($out)."\".split(\" \");\n";


	$out = '';
	foreach($faces as $f)
	{
		$out .= $materials[$f[3]].' ';
	}

	$output .= "var _c = \"".trim($out)."\".split(\" \");\n";

	file_put_contents($destination, $output);
	die('Save to '.$destination."\n\n");

?>