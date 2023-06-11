<?php $is_prod = isset($_GET['prod']) && $_GET['prod'] == 1; ?>
<title>Elematter</title>
<?php if($is_prod){ ?>
	<style><?php include('temp/_.css'); ?></style>
<?php } else { ?>
	<link href=css/main.css rel=stylesheet>
<?php } ?>
<!--==============================================================================
Game Element
===============================================================================-->
<div class="g x1">
	<!--==============================================================================
	Play State
	===============================================================================-->
	<div class="s s-play">
		<!--==============================================================================
		UI Top Row
		===============================================================================-->
		<div class="row top-row">
			<div class="game-title">Elematter </div>
			<a class="b b-play s5"><i>&rtrif;</i>Play</a>
			<a class="b b-x1 s2">&times;1</a>
			<a class="b b-x2 s2">&times;2</a>
			<a class="b b-x3 s2">&times;3</a>
		</div>
		<!--==============================================================================
		UI Bottom Row
		===============================================================================-->
		<div class="row bot-row">
			<div class="l s1"><i>&hearts;</i></div>
			<div class="d d-lives s2"> </div>
			<div class="l s1"><i>&there4;</i></div>
			<div class="d d-fragments s2"> </div>
			<div class="l s2">Wave</div>
			<div class="d d-wave s2"> </div>
			<div class="l s2">Next</div>
			<div class="d d-next s4">
				&times;<span class="w w-e"> </span>
				&times;<span class="w w-w"> </span>
				&times;<span class="w w-a"> </span>
				&times;<span class="w w-f"> </span>
			</div>
			<a class="b b-send s4"><i>&raquo;</i>Send Next +<span class="send"> </span> <i>&there4;</i></a>
		</div>
		<!--==============================================================================
		Tower Select/Build Menu
		===============================================================================-->
		<div class="build-menu-wrap">
			<div class="build-menu">
				<div class="build-buttons">
					<a class="build-button build-d"></a>
					<a class="build-button build-e" data-type="e"></a>
					<a class="build-button build-w" data-type="w"></a>
					<a class="build-button build-a" data-type="a"></a>
					<a class="build-button build-f" data-type="f"></a>
				</div>
				<div class="build-info">
					<div class="build-title">
						<span class="build-cost"> </span> <i>&there4;</i>
						<span class="build-type"> </span>
					</div>
					<div class="build-stat build-dmg-wrap">
						<strong>Damage:</strong> <span class="build-mtr"><span></span><span></span><span></span></span> <span class="build-dmg"> </span>
					</div>
					<div class="build-stat build-rng-wrap">
						<strong>Range:</strong> <span class="build-mtr"><span></span><span></span><span></span></span> <span class="build-rng"> </span>
					</div>
					<div class="build-stat build-rte-wrap">
						<strong>Rate:</strong> <span class="build-mtr"><span></span><span></span><span></span></span> <span class="build-rte"> </span>
					</div>
				</div>
			</div>
		</div>
		<!--==============================================================================
		Tower Upgrade/Reclaim Menu
		===============================================================================-->
		<div class="tower-menu-wrap">
			<div class="tower-menu">
				<div class="tower-buttons">
					<a class="tower-button highlight anim"></a>
					<a class="tower-button upgrade" data-action="upgrade">
						<div class="icon">
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
						</div>
					</a>
					<a class="tower-button reclaim" data-action="reclaim">
						<div class="icon">
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
						</div>
					</a>
				</div>
				<div class="tower-info">
					<div class="tower-title">
						<span class="tower-cost"> </span> <i>&there4;</i>
						<span class="tower-label"> </span>
					</div>
					<div class="tower-stat tower-dmg-wrap">
						<strong>Damage:</strong> <span class="tower-dmg"> </span> <i>&raquo;</i> <span class="tower-dmg-next"> </span>
					</div>
					<div class="tower-stat tower-rng-wrap">
						<strong>Range:</strong> <span class="tower-rng"> </span> <i>&raquo;</i> <span class="tower-rng-next"> </span>
					</div>
					<div class="tower-stat tower-rte-wrap">
						<strong>Rate:</strong> <span class="tower-rte"> </span> <i>&raquo;</i> <span class="tower-rte-next"> </span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<?php if($is_prod){ ?>
	<script><?php include('temp/_.js'); ?></script>
<?php } else { ?>
	<script src="js/vendor/jsfxr.js"></script>
	<script src="js/g/g.js"></script>
	<script src="js/g/audio.js"></script>
	<script src="js/g/group.js"></script>
	<script src="js/g/pool.js"></script>
	<script src="js/g/util.js"></script>
	<script src="js/data/audio.js"></script>
	<script src="js/data/map.js"></script>
	<script src="js/data/towers.js"></script>
	<script src="js/data/waves.js"></script>
	<script src="js/entities/bullet.js"></script>
	<script src="js/entities/enemy.js"></script>
	<script src="js/entities/tile.js"></script>
	<script src="js/entities/tower.js"></script>
	<script src="js/entities/wave.js"></script>
	<script src="js/states/play.js"></script>
	<script src="js/game.js"></script>
<?php } ?>