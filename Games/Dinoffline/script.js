var gid = id => document.getElementById(id);
    document.addEventListener('contextmenu', event => event.preventDefault());
    var cd = clas =>
    {
        var elem = document.createElement('div');
        elem.className = clas;
        return elem;
    }
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    var debri = [cd('debri debri1'), cd('debri debri2'), cd('debri debri3')];
    var map_elems = [];
    //console.log = () => '';
    function generate_map()
    {

        /* KÖZÉPSŐ 50vw A JÁTÉKTÉR*/
        for(var i = 0; i < 72; ++i) {
            var map_elem = cd('map_slice');
            map_elem.style.transform = 'rotateX(' + i * 5 + 'deg) translateZ(110vw)';
            //map_elem.style.background = 'hsl(' + Math.random() + 'turn,70%, 70%)';
            for(var j = 0; j < Math.random() * 30; ++j)
            {
                var debri2 = debri[~~(Math.random() * 3)].cloneNode(true);
                debri2.style.top = Math.random() * 100 + '%';
                debri2.style.left = Math.random() * 100 + '%';
                map_elem.appendChild(debri2);
            }
          /*var cactuselem = Math.random() < .33 ? bird.cloneNode(true) : (Math.random() < 5 ? cactus.cloneNode(true) : rock.cloneNode(true));
            cactuselem.style.left = Math.random() * 100 + '%';
            map_elem.appendChild(cactuselem);*/
            //map_elem.appendChild(cd('test'));
            map_elems[i] = map_elem;
            gid('map_roll').appendChild(map_elems[i]);
        }
    }
    var cactus = cd('model_cont');
    (function(){
        for(var i = 0; i < 4; ++i)
        {
            var cactus_part = cd('cactus_part');
            cactus_part.style.transform = 'rotateY(' + (90 * i) + 'deg) translateZ(.74vw)';
            cactus.appendChild(cactus_part);
        }
        for(var i = 0; i < 4; ++i)
        {
            var cactus_part = cd('cactus_part2');
            cactus_part.style.transform = 'translateY(-2vw) rotateX(' + (90 * i) + 'deg) translateZ(.488vw)';
            cactus.appendChild(cactus_part);
        }
        for(var i = 0; i < 4; ++i)for(var j = 0; j < 2; ++j)
        {
            var cactus_part = cd('cactus_part3');
            cactus_part.style.transform = 'translateX(' + j * (5) + 'vw) translateY(-2.25vw) rotateY(' + (90 * i) + 'deg) translateZ(.492vw)';
            cactus.appendChild(cactus_part);
        }
        cactus.appendChild(cd('cactus_top'));
        cactus.appendChild(cd('cactus_top2'));
        cactus.appendChild(cd('cactus_top2 cactus_top3'));


    })();

    var rock = cd('model_cont');
    (function(){
        var rock1 = cd('model_cont');
        for(var i = 0; i < 6; ++i)
        {

            var elem = cd('rock_part');
            if(i < 4)
            {
                elem.style.transform = 'rotateY(' + i * 90 + 'deg) translateZ(1vw)';
            }
            else if(i === 5) elem.style.transform = 'rotateX(' + 90 + 'deg) translateZ(1vw)';
            else elem.style.transform = 'rotateX(' + -90 + 'deg) translateZ(1vw)';
            rock1.appendChild(elem);


        }
        rock1.style.perspective = '6vw';
        rock1.style.transform = 'rotateX(-90deg) translateZ(-1.2vw)';
        rock1.style.transformStyle = 'preserve-3d';
        rock.appendChild(rock1);
        var rock2 = cd('model_cont');
        for(var i = 0; i < 6; ++i)
        {

            var elem = cd('rock2_part');
            if(i < 4)
            {
                elem.style.transform = 'rotateY(' + i * 90 + 'deg) translateZ(.495vw)';
            }
            else if(i === 5) elem.style.transform = 'rotateX(' + 90 + 'deg) translateZ(.495vw)';
            else elem.style.transform = 'rotateX(' + -90 + 'deg) translateZ(.495vw)';
            rock2.appendChild(elem);


        }
        rock2.style.perspective = '6vw';
        rock2.style.transform = 'rotateX(-90deg) translateZ(-.45vw) translateX(1.9vw) translateY(-2.1vw)';
        rock2.style.transformStyle = 'preserve-3d';

        rock.appendChild(rock2);

    })();

    var bird = cd('model_cont');
    (function(){
        var bird_cont = cd('model_cont2');
        var bird_torso = cd('model_cont2');
        for(var i = 0; i < 4; ++i)
        {
            var elem = cd('bird_torso_part');
            elem.style.transform = 'rotateY(' + i * 90 + 'deg) translateZ(.5vw)';
            bird_torso.appendChild(elem);
        }
        bird_torso.style.transform = 'rotateX(90deg)';

        var bird_head = cd('model_cont2');

        bird_head.appendChild(cd('bird_head_part'));
        bird_head.appendChild(cd('bird_head_front'));
        bird_head.appendChild(cd('bird_head_side bird_head_side1'));
        bird_head.appendChild(cd('bird_head_side bird_head_side2'));
        bird_head.style.transform = 'translateY(1vw) translateZ(1.1vw) translateX(-.75vw)';

        var bird_wing1 = cd('model_cont2 bird_wing1');
        bird_wing1.appendChild(cd('bird_wing_top bird_wing1_top'));
        bird_wing1.appendChild(cd('bird_wing_top bird_wing1_bottom'));
        bird_wing1.appendChild(cd('bird_wing_back'));
        bird_wing1.appendChild(cd('bird_wing_front'));

        var bird_wing2 = cd('model_cont2 bird_wing2');
        bird_wing2.appendChild(cd('bird_wing_top bird_wing1_top'));
        bird_wing2.appendChild(cd('bird_wing_top bird_wing1_bottom'));
        bird_wing2.appendChild(cd('bird_wing_back'));
        bird_wing2.appendChild(cd('bird_wing_front'));


        bird_cont.appendChild(bird_head);
        bird_cont.appendChild(bird_wing1);
        bird_cont.appendChild(bird_wing2);
        bird_cont.appendChild(bird_torso);
        bird_cont.style.transform = 'translateY(-7vw)';
        bird.appendChild(bird_cont);



    })();
    var coin = cd('model_cont coin_cont');
    (function(){
        var coin_side = cd('coin_side');
        coin_side.style.transform = 'translateZ(.125vw) rotateZ(-45deg)';
        coin.appendChild(coin_side.cloneNode(true));
        coin_side.style.transform = 'translateZ(-.125vw) rotateZ(-45deg)';
        coin.appendChild(coin_side.cloneNode(true));
        for(var i = 0; i < 4; ++i)
        {
            var coin_side_side = cd('coin_side_side');
            coin_side_side.style.transform = 'rotateX(90deg) rotateY(' + (i * 90 + 45) + 'deg) translateZ(1.725vw) ';
            coin.appendChild(coin_side_side);
        }
    })();
    var dino_parts = {heads: [], eyes: [], tails: []};
    dino_parts.eyes[0] = cd('dino_eyes');
    dino_parts.eyes[0].style.backgroundImage = 'url(eyes0.png)';
    dino_parts.eyes[1] = cd('dino_eyes');
    dino_parts.eyes[1].style.backgroundImage = 'url(eyes1.png)';
    dino_parts.eyes[2] = cd('dino_eyes');
    dino_parts.eyes[2].style.backgroundImage = 'url(eyes2.png)';
    dino_parts.eyes[3] = cd('dino_eyes');
    dino_parts.eyes[3].style.backgroundImage = 'url(eyes3.png)';
    dino_parts.eyes[4] = cd('dino_eyes');
    dino_parts.eyes[4].style.backgroundImage = 'url(eyes4.png)';

    dino_parts.heads[0] = cd('dino_head');
    (function(){
        for(var i = 0; i < 6; ++i)
        {
            var elem = cd('dino_head_side');
            if(i < 4)elem.style.transform = 'rotateY(' + (i * 90) + 'deg) translateZ(1vw)';
            else if(i < 5) elem.style.transform = 'rotateX(90deg) translateZ(1vw)';
            else elem.style.transform = 'rotateX(-90deg) translateZ(1vw)';

            dino_parts.heads[0].appendChild(elem);
        }
        var eyes = cd('dino_eyes');
        eyes.style.transform = 'translateZ(-1.01vw)';
        eyes.style.backgroundImage = 'url(eyes0.png)';
        dino_parts.heads[0].appendChild(eyes);

    })();
    dino_parts.heads[1] = cd('dino_head');
    (function(){
        for(var i = 0; i < 6; ++i)
        {
            var elem = i < 4 ? cd('dino_head_longside') : cd('dino_head_side');
            if(i < 4)elem.style.transform = 'rotateY(' + (i * 90) + 'deg) translateZ(1vw)';
            else if(i < 5) elem.style.transform = 'rotateX(90deg) translateZ(1.5vw)';
            else elem.style.transform = 'rotateX(-90deg) translateZ(1.5vw)';

            dino_parts.heads[1].appendChild(elem);
        }
        var eyes = cd('dino_eyes');
        eyes.style.transform = 'translateZ(-1.01vw)';
        eyes.style.backgroundImage = 'url(eyes0.png)';
        dino_parts.heads[1].appendChild(eyes);

    })();

    dino_parts.tails[0] = cd('');
    dino_parts.tails[1] = cd('dino_tail');
    (function(){
        for(var i = 0; i < 2; ++i) {
            var elem = cd('dino_tail_ball');
            elem.style.transform = 'rotateZ(' + i * 90 + 'deg) rotateX(90deg)';
            dino_parts.tails[1].appendChild(elem);
        }

    })();

    dino_parts.tails[2] = cd('dino_tail');
    (function(){
        for(var i = 0; i < 6; ++i)
        {
            var elem = cd('dino_tail_box');
            if(i < 4)elem.style.transform = 'rotateY(' + (i * 90) + 'deg) rotateY(90deg) translateZ(.7vw)';
            else if(i === 4) elem.style.transform = 'rotateX(90deg) translateZ(.7vw)';
            else elem.style.transform = 'rotateX(-90deg) translateZ(.7vw)';

            dino_parts.tails[2].appendChild(elem);
        }

    })();
    dino_parts.leg = cd('dino_leg');
    (function(){
        for(var i = 0; i < 2; ++i)
        {
            var elem = cd('dino_leg_part');
            elem.style.transform = 'rotateY(' + (i * 90) + 'deg)';
            dino_parts.leg.appendChild(elem);
        }

    })();

    dino_parts.torso = cd('model_cont');
    (function(){
        for(var i = 0; i < 6; ++i)
        {
            var elem = i < 4 ? cd('dino_torso') : cd('dino_torso_ends');
            if(i < 4)elem.style.transform = 'rotateZ(' + (i * 90) + 'deg) rotateX(90deg) translateZ(1.2vw)';
            else if(i < 5) elem.style.transform = 'rotateX(0) translateZ(1.7vw)';
            else elem.style.transform = 'rotateX(0) translateZ(-1.7vw)';
            dino_parts.torso.appendChild(elem);
        }
        for(var i = 0; i < 2; ++i)for(var j = 0; j < 2; ++j)
        {
            var elem2  = cd('base_cont');
            elem2.appendChild(dino_parts.leg.cloneNode(true));
            if(j == 1)elem2.lastChild.style.animationDelay = '.5s';
            elem2.style.transform = 'translateY(1.2vw) translateZ(' + (1 - (i * 2)) + 'vw) translateX(' + (.6 - (j * 1.2)) + 'vw)';
            dino_parts.torso.appendChild(elem2);

        }
        this.head = dino_parts.heads[0].cloneNode(true);
        this.head.style.transform = 'translateZ(2vw)';
        dino_parts.torso.appendChild(this.head);


    })();

    var dino = [];
    dino[1] = cd('model_cont');
    dino[2] = cd('model_cont');
    var dino_look = [];
    dino_look[1] = [0,0,0];
    dino_look[2] = [0,0,0];
    function construct_dino(num)
    {

        dino[num] = cd('model_cont');
        for(var i = 0; i < 6; ++i)
        {
            var elem = i < 4 ? cd('dino_torso') : cd('dino_torso_ends');
            if(i < 4)elem.style.transform = 'rotateZ(' + (i * 90) + 'deg) rotateX(90deg) translateZ(1.25vw)';
            else if(i < 5) elem.style.transform = 'rotateX(0) translateZ(1.75vw)';
            else elem.style.transform = 'rotateX(0) translateZ(-1.75vw)';
            dino[num].appendChild(elem);
        }
        for(var i = 0; i < 2; ++i)for(var j = 0; j < 2; ++j)
        {
            var elem2  = cd('base_cont');
            elem2.appendChild(dino_parts.leg.cloneNode(true));
            if(j == 1)elem2.lastChild.style.animationDelay = '.5s';
            elem2.style.transform = 'translateY(1.2vw) translateZ(' + (1 - (i * 2)) + 'vw) translateX(' + (.6 - (j * 1.2)) + 'vw)';
            dino[num].appendChild(elem2);

        }
        this.head = dino_parts.heads[dino_look[num][1]].cloneNode(true);
        this.head.style.transform = 'translateX(.25vw) translateY(-.5vw) translateZ(-2.6vw)';
        this.head.getElementsByClassName('dino_eyes')[0].style.backgroundImage = 'url(eyes' + dino_look[num][0] + '.png)';
        dino[num].appendChild(this.head);

        this.tail = dino_parts.tails[dino_look[num][2]].cloneNode(true);
        this.tail.style.transform = 'translateZ(2.3vw) translateX(.25vw) translateY(.5vw)';
        dino[num].appendChild(this.tail);
    }
    construct_dino(1);


    var dino_shop_items =
        {
            Eyes: [
                {
                    name: 'Default Eyes',
                    look: dino_parts.eyes[0],
                    price: 0
                },
                {
                    name: 'Low-Res Eyes',
                    look: dino_parts.eyes[1],
                    price: 0
                },
                {
                    name: 'Frightened Eyes',
                    look: dino_parts.eyes[2],
                    price: 5
                },
                {
                    name: 'Sunglasses',
                    look: dino_parts.eyes[3],
                    price: 10
                },
                {
                    name: 'Cyclops Eye',
                    look: dino_parts.eyes[4],
                    price: 10
                }

            ],
            Heads: [
                {
                    name: 'Default Head',
                    look: dino_parts.heads[0],
                    price: 0
                },
                {
                    name: 'Long Head',
                    look: dino_parts.heads[1],
                    price: 5
                }
            ],
            Tails: [
                {
                    name: 'No Tail',
                    look: cd(''),
                    price: 0
                },
                {
                    name: 'Ball Tail',
                    look: dino_parts.tails[1],
                    price: 3
                },
                {
                    name: 'Box Tail',
                    look: dino_parts.tails[2],
                    price: 3
                }
            ]
        };

    function construct_shop() {
        for(var i in dino_shop_items)
        {
            var elemname = cd('part_category');
            elemname.innerHTML = i;
            gid('dino_parts').appendChild(elemname);

            for(var j in dino_shop_items[i])
            {
                var elem = cd('part_elem');
                var price = cd('part_price');
                price.innerHTML = dino_shop_items[i][j].price == 0 ?  'Free' : dino_shop_items[i][j].price + '$';
                var look = cd('part_content');
                look.appendChild(dino_shop_items[i][j].look.cloneNode(true));
                if(i == 'Heads')look.lastChild.style.transform = 'translateY(2.5vw)';
                else if(i == 'Tails')look.lastChild.style.transform = 'translateY(2.5vw) translateX(2.5vw)';
                elem.appendChild(look);
                elem.appendChild(price);
                elem.setAttribute('buy','apply_item(shop_player, "' + i + '", ' + j + ')');
                elem.onclick = function () {eval(this.getAttribute('buy'))};
                gid('dino_parts').appendChild(elem);



            }
        }
    }
    construct_shop();
    var shop_player = 1;
    function open_shop()
    {
        gid('main_menu').style.display = 'none';
        gid('dino_shop').style.display = 'block';
        gid('coin_amount').innerHTML = coins + '$';
        customize(current_dino);
    }
    function close_shop()
    {
        gid('main_menu').style.display = 'block';
        gid('dino_shop').style.display = 'none';
    }
    var current_dino = 1;
    function customize(num)
    {
        current_dino = num;
        gid('dinoinspection_cont').innerHTML = '';
        gid('dinoinspection_cont').appendChild(dino[num]);


    }
    var shop_help = {Eyes: 0, Heads: 1, Tails: 2};
    function apply_item(player, type, id)
    {
        var item = dino_shop_items[type][id];
        if(confirm('Are you sure you want to apply ' + item.name + ' for ' + item.price + '$ ?'))
        {
            if(coins < item.price)
            {
                alert("You don't have enough money for this!");
                return;
            }

            coins -= item.price;
            gid('coin_amount').innerHTML = coins + '$';
            dino_look[current_dino][shop_help[type]] = id;
            construct_dino(current_dino);
            customize(current_dino);
            save();
            gid('player').appendChild(dino[1].cloneNode(true));
            gid('player2').appendChild(dino[2].cloneNode(true));
        }

    }

    var player_model = dino[1];
    var player2_model = dino[2];

   /* gid('player').style.setProperty('--color4', 'lightgreen');
    gid('player').style.setProperty('--color5', 'dodgerblue');*/
    var player_pos = 50;
    var player_height = 0;
    var border_left = 15;
    var border_right = 85;
    function move_player(amount, player)
    {
        if(player === undefined || player == 1) {
            if (player_pos + amount < border_right && player_pos + amount > border_left) player_pos += amount;
        }
        else
        {

            if(player2_pos + amount < border_right && player2_pos + amount > border_left)player2_pos += amount;
        }
        refresh_player_look();
    }

    //PLAYER 2 stats

    var player2_pos = 50;
    var player2_height = 0;
    var walk_mode2 = false;
    var jump_mode2 = false;
    var move_interval2;
    var jump_interval2;

    //PLAYER 2 stats


    /*gid('player2').style.setProperty('--color4', 'orange');
    gid('player2').style.setProperty('--color5', 'red');*/


    var walk_mode = false;
    var jump_mode = false;
    var move_interval;
    var jump_interval;
    window.onkeydown = function(event)
    {
        event = event || window.event;
        button_press(event);
    };
    window.onkeyup = function(event)
    {
        event = event || window.event;
        button_release(event);
    };
    function button_press(event) {

        if(game_started) {
            var keycode = event.charCode || event.keyCode;
            if (keycode === 65 && !walk_mode) start_move_interval(-.4, 1);
            else if (keycode === 68 && !walk_mode) start_move_interval(.4, 1);
            else if ((keycode === 87 || keycode === 32) && !jump_mode) start_jump_interval(1);

            if(game_type == 'multi')
            {
                if (keycode === 37 && !walk_mode2) start_move_interval(-.4, 2);
                else if (keycode === 39 && !walk_mode2) start_move_interval(.4, 2);
                else if ((keycode === 38) && !jump_mode2) start_jump_interval(2);
            }

        }
        else first_click();

    }
    function button_release(event)
    {
        if(game_started) {
            var keycode = event.charCode || event.keyCode;
            if (keycode == 68 || keycode == 65) stop_move_interval(1);
            else if (keycode === 32 || keycode === 87) jump_direction = jump_direction === 'down' ? 'down' : 'startdown';

            if(game_type == 'multi')
            {
                if (keycode == 37 || keycode == 39) stop_move_interval(2);
                else if (keycode === 38) jump_direction2 = jump_direction2 === 'down' ? 'down' : 'startdown';
            }
        }
    }
    function start_move_interval(amt, player)
    {

        var amt2 = amt;
        stop_move_interval(player);
        if(player === undefined || player == 1) {
            walk_mode = true;
            move_interval = setInterval(function () {
                move_player(amt2, 1);
            }, 25)
        }
        else
        {

            walk_mode2 = true;
            move_interval2 = setInterval(function () {
                move_player(amt2, 2);
            }, 25)
        }
    }
    function stop_move_interval(player)
    {
        if(player === undefined || player == 1) {
            clearInterval(move_interval);
            walk_mode = false;
        }
        else
        {
            clearInterval(move_interval2);
            walk_mode2 = false;
        }
    }
    var jump_direction;
    var jump_direction2;
    function start_jump_interval(player)
    {
        stop_jump_interval(player);
        if(player === undefined || player == 1) {
            jump_direction = 'up';
            jump_mode = true;
            jump_interval = setInterval(function(){player_jump(1)}, 25);
        }
        else
        {
            jump_direction2 = 'up';
            jump_mode2 = true;
            jump_interval2 = setInterval(function(){player_jump(2)}, 25);
        }
    }
    function stop_jump_interval(player)
    {
        if(player === undefined || player == 1) {
            jump_mode = false;
            clearInterval(jump_interval);
        }
        else
        {
            jump_mode2 = false;
            clearInterval(jump_interval2);
        }
    }
    var prev_player_height = 0;
    var prev_player2_height = 0;
    var min_jump = 5;
    var max_jump = 8;
    function player_jump(player)
    {

        if(player === undefined || player == 1) {
            if (jump_direction === 'up') player_height += .4;
            else if (jump_direction === 'down') player_height -= .4;
            else if (jump_direction === 'startdown') {

                if (player_height >= prev_player_height && player_height <= min_jump) {


                    player_height += .5;
                }
                else {
                    player_height -= .5;
                    jump_direction = 'down';
                }

            }
            if (player_height > max_jump) jump_direction = 'down';
            if (player_height <= 0) {
                player_height = 0;
                stop_jump_interval(1);
            }

            prev_player_height = player_height;
        }
        else
        {
            if (jump_direction2 === 'up') player2_height += .4;
            else if (jump_direction2 === 'down') player2_height -= .4;
            else if (jump_direction2 === 'startdown') {

                if (player2_height >= prev_player2_height && player2_height <= min_jump) {


                    player2_height += .5;
                }
                else {
                    player2_height -= .5;
                    jump_direction2 = 'down';
                }

            }
            if (player2_height > max_jump) jump_direction2 = 'down';
            if (player2_height <= 0) {
                player2_height = 0;
                stop_jump_interval(2);
            }

            prev_player2_height = player2_height;
        }
        refresh_player_look();
    }
    function refresh_player_look()
    {
        gid('player').style.transform = 'translateX(' + ((player_pos / 2) - 25) + 'vw) translateZ(32vw) translateY(' + (-107.5 - player_height) + 'vw) rotateX(75deg)';
        gid('player2').style.transform = 'translateX(' + ((player2_pos / 2) - 25) + 'vw) translateZ(32vw) translateY(' + (-107.5 - player2_height) + 'vw) rotateX(75deg)';
    }
    var map_rate = -0.2;
    var player_length = 0;
    var active_slice_temp = 15 * 5;
    var active_slice = 15;
    generate_map();
    var i = 0;
    function map_move()
    {
        ++i;
        player_length = player_length + map_rate >= 360 ? player_length + map_rate - 360 : (player_length + map_rate < 0 ? player_length + map_rate + 360 : player_length + map_rate);
        gid('map_roll').style.transform = 'rotateX(' + player_length + 'deg)';
        active_slice_temp = active_slice_temp - map_rate >= 360 ? active_slice_temp - map_rate - 360 : (active_slice_temp - map_rate < 0 ? active_slice_temp - map_rate + 360 : active_slice_temp - map_rate);
        var active_slice_prev = active_slice;
        active_slice = ~~(active_slice_temp / 5);
        if(active_slice !== active_slice_prev)
        {
            spawn_time();
        }
       if(game_started) map_rate -= 0.0002;

        setTimeout(map_move, 1000 / 60);
    }
    var points = 0;
    function add_point()
    {
        if(game_started) {
            ++points;
            var l = String(points).length;
            gid('point_cont').innerHTML = (l == 1 ? '0000' : (l == 2 ? '000' : (l == 3 ? '00' : (l == 4 ? '0' : '')))) + '' + points + 'pts';
        }
    }
    var point_interval = setInterval(add_point, 100);

    var obsticles =
        {
            cactus: {
                width: 10,
                height: 4,
                length: .15,
                elevation: 0,
                look: cactus,
                event: 'd'
            },
            rock: {
                width: 5,
                height: 5,
                length: .2,
                elevation: 0,
                look: rock,
                event: 'd'
            },
            bird: {
                width: 10,
                height: 3,
                length: 1,
                elevation: 7,
                look: bird,
                event: 'd'
            },
            coin: {
                width: 4,
                height: 4,
                length: .4,
                elevation: 0,
                look: coin,
                event: 'c'
            }
        };
    //max 90 min 10
    function add_obsticle(type, pos_x, pos_y)
    {
        var elem = obsticles[type].look.cloneNode(true);
        elem.style.left = 'calc(50% - 25vw + ' + (pos_x / 2) + 'vw)';
        map_elems[pos_y].appendChild(elem);
    }
    map_move();


    var daystate_deg = 0;
    var dayinterval = setInterval(function(){
        daystate_deg += .3;
        daystate_deg = ~~(daystate_deg * 1000) / 1000;
        if(~~daystate_deg === 180 && daystate === 'day') change_daystate();
        else if(~~daystate_deg === 360 && daystate === 'night')
        {
            change_daystate();
            daystate_deg = 0;
        }
        gid('sunmoon_cont').style.transform = 'rotate(' + daystate_deg + 'deg)';
        gid('moon').style.transform = 'rotate(' + -daystate_deg + 'deg)';
    }, 25);
    var daystate = 'day';
    function change_daystate()
    {
        if(daystate == 'day')
        {
            daystate = 'night';
            gid('container').style.setProperty('--color1', 'var(--colorreal5)');
            gid('container').style.setProperty('--color2', 'var(--colorreal4)');
            gid('container').style.setProperty('--color4', 'var(--colorreal2)');
            gid('container').style.setProperty('--color5', 'var(--colorreal1)');
        }
        else
        {
            daystate = 'day';
            gid('container').style.setProperty('--color1', 'var(--colorreal1)');
            gid('container').style.setProperty('--color2', 'var(--colorreal2)');
            gid('container').style.setProperty('--color4', 'var(--colorreal4)');
            gid('container').style.setProperty('--color5', 'var(--colorreal5)');
        }
        //setTimeout(change_daystate, 10000);
    }
   // setTimeout(change_daystate, 10000);
    var obsticles_placed = [];
    function spawn(obj, slice, pos)
    {
        var elem = obsticles[obj].look;
        elem.style.left = 'calc(50% - 25vw + ' + (~~((pos / 2) * 100) / 100) + 'vw)';
        obsticles_placed.push(
            {
                type: obj,
                pos: pos,
                slice: slice,
                look: elem.cloneNode(true),
                dcount: 0
            }
        );
        map_elems[slice].appendChild(obsticles_placed[obsticles_placed.length - 1].look);
    }
    function despawn(slice)
    {
        for(var i in obsticles_placed)
        {
            if(obsticles_placed[i] != undefined && obsticles_placed[i].slice == slice)
            {
                obsticles_placed[i].look.outerHTML = '';
                obsticles_placed[i] = undefined;
            }
        }
    }
    var spawn_distance = isChrome ? 7 : 4;
    var despawn_distance = isChrome ? 2 : 1;
    function spawn_time()
    {
        var spawn_for = active_slice + spawn_distance < 72 ? active_slice + spawn_distance : active_slice + spawn_distance - 72;
        var amount = ~~(Math.random() * 4);
        despawn(active_slice - despawn_distance < 0 ? active_slice - despawn_distance + 72 : active_slice - despawn_distance);
        for(var i = 0; i < amount; ++i)
        {
            spawn((Math.random() > .94 && game_started) ? 'coin' : ['cactus', 'rock', 'bird'][~~(Math.random() * 3)], spawn_for, Math.random() * 100);
        }
    }
    var dino_width = 3;
    var dino_length = 7;
    var dino_height = 5;
    var death_count = 0;
    function check_collisions()
    {
        if(game_started) {
            //console.log('hi');
            for (var i in obsticles_placed) {
                //console.log(i + '-' + obsticles_placed[i].slice + '-' + active_slice);
                if (obsticles_placed[i] !== undefined && obsticles_placed[i].slice === active_slice) {
                    var x_col = false;
                    var y_col = false;
                    var z_col = false;

                    var player_in_slide_pos = ((player_length) / 5) - Math.floor((player_length) / 5);
                    var object_length_half = obsticles[obsticles_placed[i].type].length / 2;
                    if (player_in_slide_pos > .8 - object_length_half && player_in_slide_pos < .8 + object_length_half) z_col = true;

                    var object_width_half = obsticles[obsticles_placed[i].type].width / 2;
                    var object_left = obsticles_placed[i].pos;
                    if (player_pos < object_left + object_width_half && player_pos > object_left - object_width_half) x_col = true;

                    var object_height = obsticles[obsticles_placed[i].type].height;
                    var object_elevation = obsticles[obsticles_placed[i].type].elevation;

                    if (object_elevation === 0 && player_height < object_height) y_col = true;
                    else if ((player_height < object_elevation + object_height && player_height > object_elevation) || (player_height + dino_height < object_elevation + object_height && player_height + dino_height > object_elevation)) y_col = true;


                    if (z_col && y_col && x_col) {
                        if (obsticles[obsticles_placed[i].type].event == 'd') {
                            ++obsticles_placed[i].dcount;
                            if (obsticles_placed[i].dcount >= 1) die(1);
                        }
                        else if(obsticles[obsticles_placed[i].type].event == 'c')
                        {
                            obsticles_placed[i].look.outerHTML = '';
                            obsticles_placed[i] = undefined;
                            collect_coin();
                        }
                    }
                    else obsticles_placed[i].dcount = 0;

                    if(game_type == 'multi')
                    {
                       x_col = false;
                       y_col = false;


                        if (player2_pos < object_left + object_width_half && player2_pos > object_left - object_width_half) x_col = true;


                        if (object_elevation === 0 && player2_height < object_height) y_col = true;
                        else if ((player2_height < object_elevation + object_height && player2_height > object_elevation) || (player2_height + dino_height < object_elevation + object_height && player2_height + dino_height > object_elevation)) y_col = true;

                        if (z_col && y_col && x_col) {
                            if (obsticles[obsticles_placed[i].type].event == 'd') {
                                ++obsticles_placed[i].dcount;
                                if (obsticles_placed[i].dcount >= 1) die(2);
                            }
                            else if(obsticles[obsticles_placed[i].type].event == 'c')
                            {
                                obsticles_placed[i].look.outerHTML = '';
                                obsticles_placed[i] = undefined;
                                collect_coin();
                            }
                        }
                        else obsticles_placed[i].dcount = 0;
                    }


                }
            }
        }
    }
    setInterval(check_collisions);
    var game_started = false;

    function first_click()
    {
        gid('press_a_button').style.opacity = 0;
        gid('button_cont').style.opacity = 1;
        gid('description').style.opacity = 1;
        gid('highscore').style.opacity = 1;
        if(isChrome)gid('container').style.filter = 'blur(1.5vw)';

        setTimeout(function(){gid('press_a_button').style.display = 'none';}, 55);
    }
    var menumsgs = {
        start: "You play as a dinosaur trying to get as far as possible. You will encounter several obsticles throughout your journey. You can either go around them or jump over them. Cover as much distance as you can and beat the High Score, or (even better) race with one of your buddies!",
        welcome: "Welcome to Dinoffline! A DOM-based 3D remake of the famous Chrome Dino Game!",
        save: "This game contains an autosave feature, but if you want you can also transfer your save files! Save the text you get from 'Export Save', paste it into 'Import Save' on another PC to continue from where you left off!",
        models: "Inspect 3D models of the different obsticles and enemies you encounter during your journey",
        maker: "Create YOUR unique dinosaur using our Dino Customiser and spend your hard earned coins on cosmetics!",
        single: "Cover as much distance as possible! The further you get, the more points you will have.<br/>Change your position with 'A' and 'D' or the arrow keys, jump with 'W', 'UP' or 'Space'",
        multi: "Race with your friend! The person who bumps into an obsticle first loses!<br/>Player 1 can walk with 'A' and 'D' and jump with 'W' or 'Space'.<br/>Player 2 can walk with the arrow keys and jump with 'Up'",
        back: "Back to the Main Menu"
    };
    function show_msg(msg)
    {
        gid('description').innerHTML = menumsgs[msg];
    }

    show_msg('welcome');
    player_height = 1000;
    refresh_player_look();
    gid('point_cont').style.display = 'none';
    gid('coin_cont').style.display = 'none';
    var coins = 0;
    var highscore = 0;

    function create_save()
    {


        var dino1 = JSON.stringify(dino_look[1]);
        var dino2 = JSON.stringify(dino_look[2]);
        var savestring = dino1 + '|' + dino2 + '|' + coins + '|' + highscore;
        prompt('Here is your save code!', savestring);

    }
    var save_elems;
    function import_save()
    {
        var code = prompt('Please enter your save code');
        if(code !== null) {

            save_elems = code.split('|');
            //console.error(save_elems[0]);
            dino_look[1] = JSON.parse(save_elems[0]);
            dino_look[2] = JSON.parse(save_elems[1]);
            coins = Number(save_elems[2]);
            highscore = Number(save_elems[3]);
            alert('Save successfully imported!');
        }
    }
    function save()
    {
        var dino1 = JSON.stringify(dino_look[1]);
        var dino2 = JSON.stringify(dino_look[2]);
        localStorage.save = dino1 + '|' + dino2 + '|' + coins + '|' + highscore;
    }
    function load()
    {
        if(localStorage.save !== undefined && localStorage.save != '')
        {
            var code = localStorage.save;
            save_elems = code.split('|');
            dino_look[1] = JSON.parse(save_elems[0]);
            dino_look[2] = JSON.parse(save_elems[1]);
            coins = Number(save_elems[2]);
            highscore = Number(save_elems[3]);
        }
    }
    load();

    function inspect(item)
    {
        gid('inspection_cont').innerHTML = '';
        var elem = obsticles[item].look.cloneNode(true);
        elem.style.left = '50%';
        elem.style.transform = 'translateZ(0vw) rotateX(0)';
        if(item === 'bird')
        {
            elem.childNodes[0].style.transform = '';
        }
        else if(item === 'coin') {
            elem.style.animation = 'none';
            elem.style.animationPlayState = 'paused';
        }
        gid('inspection_cont').appendChild(elem);

    }
    function open_inspect()
    {
        gid('main_menu').style.display = 'none';
        gid('inspect_area').style.display = 'block';
    }
    function close_inspect()
    {
        gid('main_menu').style.display = 'block';
        gid('inspect_area').style.display = 'none';
        show_msg('welcome');
    }


    var move_mode = false;
    var client_x_ex = -1;
    var client_y_ex = -1;
    var current_object = 0;
    function object_move_start(event)
    {
        if(event.button == 2) rotate_interval_enabled = true;
        else rotate_interval_enabled = false;

        move_mode = true;
        client_x_ex = -1;
        client_y_ex = -1;
        clearInterval(rotate_interval);
    }
    function object_move_end(event)
    {

        move_mode = false;
        client_x_ex = -1;
        client_y_ex = -1;
        var to_x = client_x_ex - (event.touches ? event.touches[0].pageX : event.clientX);
        var to_y = client_y_ex - (event.touches ? event.touches[0].pageY : event.clientY);
        rotate_interval = setInterval(function(){auto_rotate()});

    }
    function object_move(event)
    {
        if(move_mode) {

            if (client_x_ex >= 0) {


                var to_x = client_x_ex - (event.touches ? event.touches[0].pageX : event.clientX);
                var to_y = client_y_ex - (event.touches ? event.touches[0].pageY : event.clientY);
                interval_x = to_x / 2;
                interval_y = to_y / 2;
                rotate_object(-to_x, to_y);


            }
            client_x_ex = event.touches ? event.touches[0].pageX : event.clientX;
            client_y_ex = event.touches ? event.touches[0].pageY : event.clientY;
        }
    }
    var can_move = true;
    function rotate_object(y, x)
    {
        var temp_transform = window.getComputedStyle(document.getElementById('inspection_cont').childNodes[0]).transform;
        document.getElementById('inspection_cont').childNodes[0].style.transform = ' rotateX(' + (x / 3) + 'deg) rotateY(' + (y / 3) + 'deg)' + temp_transform;
    }
    var rotate_interval;
    var interval_x;
    var interval_y;
    var rotate_interval_enabled = false;
    function auto_rotate()
    {
        interval_x -= (interval_x * .008);
        interval_y -= (interval_y * .008);
        if(rotate_interval_enabled)rotate_object(-interval_x, interval_y);
        if(~~(interval_x * 1000) == 0 && ~~(interval_y * 1000) == 0) clearInterval(rotate_interval);
    }

    gid('inspection_box').onmousedown = object_move_start;
    gid('inspection_box').onmouseup = object_move_end;
    gid('inspection_box').onmousemove = object_move;

    function open_playgame()
    {
        gid('button_cont').style.display = 'none';
        gid('button_cont2').style.display = 'block';
    }
    function close_playgame()
    {
        gid('button_cont').style.display = 'block';
        gid('button_cont2').style.display = 'none';
        show_msg('welcome');
    }
    function despawn_all()
    {
        for(var i = 0; i < 72; ++i)
            despawn(i);
    }
    var game_type;
    function start_new_game(type)
    {
        //player_length = 0;
        points = 0;
        player_height = 0;
        map_rate = -.2;
        player_pos = 50;
        game_started = true;
        gid('menu').style.display = 'none';
        gid('death_screen').style.display = 'none';
        if(isChrome)gid('container').style.filter = 'blur(0)';

        despawn_all();
        game_type = type;
        gid('coin_cont').style.display = 'block';
        if(type === 'single')
        {
            player_pos = 50;
            gid('point_cont').style.display = 'block';
        }
        if(type === 'multi') {
            player_pos = 35;
            player2_pos = 65;
            player2_height = 0;
            gid('player2').style.display = 'block';
        }
        refresh_player_look();
    }

    function die(pl)
    {

        game_started = false;
        map_rate = 0;
        if(isChrome)gid('container').style.filter = 'blur(1.5vw)';
        gid('death_screen').style.display = 'block';
        if(game_type === 'single') gid('death_msg').innerHTML = 'Your score: ' + points;
        else if(pl == 1) gid('death_msg').innerHTML = 'Player 2 won!';
        else gid('death_msg').innerHTML = 'Player 1 won!';
        gid('point_cont').style.display = 'none';
        gid('coin_cont').style.display = 'none';
        if(points > highscore) highscore = points;
               save();
        update_highscore();
        stop_move_interval(1);
        stop_move_interval(2);
    }

    function update_highscore()
    {
        gid('highscore').innerHTML = 'Your highscore is ' + highscore;
        gid('coin_cont').innerHTML = coins + '$';
    }
    update_highscore();


    function collect_coin()
    {

        ++coins;
        gid('coin_cont').innerHTML = coins + '$';

    }
    gid('coin_cont').innerHTML = coins + '$';
    function back_to_menu()
    {
        gid('death_screen').style.display = 'none';
        gid('player2').style.display = 'none';
        gid('menu').style.display = 'block';
        close_playgame();
        map_rate = -.2;
        show_msg('welcome');
        player_height = 1000;
        refresh_player_look();
    }
    construct_dino(1);
    construct_dino(2);

    gid('player').appendChild(dino[1].cloneNode(true));
    gid('player2').appendChild(dino[2].cloneNode(true));