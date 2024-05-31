$(function () {

    the_game = function () {

        if (check_egg_hits_floor(egg1) || check_egg_hits_basket(egg1)) {
            set_egg_to_initial_position(egg1);
        } else {
            egg_down(egg1);
        }

        if (check_egg_hits_floor(egg2) || check_egg_hits_basket(egg2)) {
            set_egg_to_initial_position(egg2);
        } else {
            egg_down(egg2);
        }

        if (check_egg_hits_floor(egg3) || check_egg_hits_basket(egg3)) {
            set_egg_to_initial_position(egg3);
        } else {
            egg_down(egg3);
        }

        if (life > 0) {
            anim_id = requestAnimationFrame(the_game);
        } else {
            stop_the_game();
        }
    };

    anim_id = requestAnimationFrame(the_game);

});