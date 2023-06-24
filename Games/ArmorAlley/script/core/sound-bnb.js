import { gameEvents, EVENTS } from './GameEvents.js';
import { oneOf, soundManager, winloc } from './global.js';
import { utils } from '../core/utils.js';
import { addSequence, addSound, getSound, playSound, skipSound } from './sound.js';
import { game } from './Game.js';
import { common } from './common.js';
import { gamePrefs } from '../UI/preferences.js';
import { isGameOver } from './logic.js';
import { effects } from './effects.js';
import { net } from './network.js';
import { snowStorm } from '../lib/snowstorm.js';

const bnb = {};
const playImmediately = { playImmediately: true };
const excludeThrottling = { excludeThrottling: true };
const fixedPlaybackRate = true;

const { shuffle } = utils.array;

// sound playback functions

let lastPlayedBnBSound = null;

let soundsToPlayBNB = [];

let nextBNBTimer;
let nextBNBTimeout;

// called by sound.js
const queueBNBSound = (obj = {}) => soundsToPlayBNB.push(obj);

/**
 * sounds.bnb[name] = { ... }
 * [s1, s2, s3];                               // legacy array. play() gets one sound at a time, array shuffled after last sound picked.
 * addSequence(s1, s2, s3);                    // play() goes through all items, and returns a flat array of sounds to play in sequence.
 * [s1, () => Math.random() >= 0.5 ? s2 : s3]  // functions can be provided, allowing run-time logic and sound selection.
 * addSequence(s1, addSequence(s2, () => {})); // nesting of both sequences and functions should work.
 */

function getBnBSound(ref) {

  if (!gamePrefs.bnb) return;

  if (!ref) return;

  if (ref.isSequence) return getBnBSound(getSoundFromSequence(ref));

  if (ref.length && !ref.isSoundArray) return getBnBSound(getSoundFromArray(ref));

  if (ref instanceof Function) return getBnBSound(ref());

  return ref;

}

function getSoundFromSequence(ref) {

  if (!ref?.forEach) return;

  let result = [];
  let soundItem;

  ref.forEach((item) => {

    if (!item) {
      console.warn('getSoundFromSequence: WTF no item?', ref, item);
      return;
    }

    soundItem = getSound(item);

    // guard
    if (soundItem === undefined) {
      console.warn('getSoundFromSequence - missing sound?', ref, item, soundItem);
      return;
    }

    if (soundItem === false) {
      console.warn('getSoundFromSequence: boolean false - ignoring', ref, item, soundItem);
      return;
    }

    result.push(soundItem);

  });

  // prevent recursion through this result
  result.isSoundArray = true;

  return result;

}

function playSequence(soundReference, exports, sequenceOptions = {}) {

  // single sound, sequence, or nested variant
  let sounds = getBnBSound(soundReference);

  if (!sounds) return;

  // only skip a sequence if this sequenceOptions method is provided, and returns false-y.
  const playNextCondition = soundReference.playNextCondition || sequenceOptions.playNextCondition || (() => true);

  const soundOptions = {
    onfinish: function(sound) {

      const { parentSoundObject } = sound;

      // bail if a sound didn't play, if the playNextCondition is false-y, or we're at the end.
      if (sound.skipped || !playNextCondition(sound)) {

        // if a sequence, and this is the first, then drop all the others.
        if (parentSoundObject.sequenceOffset === 0) {

          // note length - 1, we have already processed the first sound in the sequence.
          const removed = soundsToPlayBNB.splice(0, parentSoundObject.sequenceLength);

          // ensure those objects are destroyed, too.
          removed.forEach((removedItem) => {
            if (removedItem?.soundObject?.sound) {
              removedItem.soundObject.sound.parentSoundObject = null;
              removedItem.soundObject.sound.destruct();
              removedItem.soundObject.sound = null;
            }
          });

        }

        sequenceOptions?.onfinish?.apply(sound, [sound]);

        return;
        
      }

      // last sound? fire onfinish if specified.
      // be liberal: allow for "missing" sounds, too. Derrrr.
      if (parentSoundObject.sequenceOffset >= parentSoundObject.sequenceLength - 1) {
        sequenceOptions?.onfinish?.apply(sound, [sound]);
      }

      nextBNBSoundIfPaused();

    }
  }

  // filter out false boolean results, given () => logic.
  sounds = sounds.filter((sound => sound !== false));

  // note: sequenceOffset is provided to each.
  sounds.forEach((sound, index) => {

    // sequence -> sound objects for max delay
    if (soundReference.maxDelay) {
      sound.maxDelay = soundReference.maxDelay;
    }

    // hackish. TODO: move these to somewhere better?
    sound.sequenceOffset = index;
    sound.sequenceLength = sounds.length;

    // by default, subsequent sounds are allowed to take as long as they need to play.
    // if the first sound is skipped, then subsequent ones will be removed entirely.
    // if already true, let it be.
    sound.excludeDelay = sound.excludeDelay || (index > 0);

    playSound(sound, exports, {
      ...soundOptions,
      maxDelay: soundReference.maxDelay
    });

  });

}

function nextBNBSoundIfPaused() {

  if (!gamePrefs.bnb || !soundsToPlayBNB.processing) return;

  // if the game is paused, setFrameTimeout()-based callbacks may not be happening.
  // use the classic, instead.
  if (game.data.paused && !nextBNBTimeout) {
    soundsToPlayBNB.processing = false;
    nextBNBTimeout = window.setTimeout(() => {
      nextBNBTimeout = null;
      playQueuedBNBSounds();
    }, 500);
  }

}

function nextBNBSound() {

  if (!soundsToPlayBNB.processing) return;

  nextBNBSoundIfPaused();
 
  // guard
  if (nextBNBTimer) return;
  
  // slight delay between sounds, when processing queue
  nextBNBTimer = common.setFrameTimeout(() => {
    nextBNBTimer = null;
    // a sound has finished, or is being skipped (because it was throttled etc.)
    soundsToPlayBNB.processing = false;
  }, 250);

}

function resetBNBSoundQueue() {

  soundsToPlayBNB = [];
  soundsToPlayBNB.processing = false;

}

function playQueuedBNBSounds() {

  var now = Date.now();

  // sound playback failed / onfinish callback was missed, or game was paused / window was blurred, computer went to sleep etc.
  if (soundsToPlayBNB.processing && soundsToPlayBNB.length && now - soundsToPlayBNB[0].queued > 66666 && !isGameOver()) {
    console.warn(`Stuck or delayed sound queue? ${soundsToPlayBNB.processing ? 'Resetting "processing" flag' : ' processing = false'}`, soundsToPlayBNB.length, soundsToPlayBNB);
    console.warn('sounds in queue:', soundsToPlayBNB.map((bnbSound) => bnbSound));
    console.warn('sound that may have gotten stuck:', lastPlayedBnBSound);
    console.warn('soundManager.soundIDs', soundManager.soundIDs.join(', '));
    // soundsToPlayBNB.processing = false;
    // return;
  }

  if (soundsToPlayBNB.length && !soundsToPlayBNB.processing) {

    soundsToPlayBNB.processing = true;

    // take the first one.
    const item = soundsToPlayBNB.shift();

    lastPlayedBnBSound = item;

    // if no sound, just skip - this applies to throttled sounds.
    if (!item.soundObject.sound) return nextBNBSound();

    const options = item.soundObject.soundOptions;

    // TODO: verify the source of `throttle`.
    const throttle = item.throttle || options.throttle || item.soundObject.throttle || 0;

    const lastPlayed = item.soundObject.lastPlayed || 0;

    let delay = (now - item.queued);

    // if unspecified, go with a huge delay.
    const maxDelay = item.soundObject.maxDelay || item.maxDelay || 99999;

    const delayed = (delay >= maxDelay && !item.soundObject.excludeDelay);

    const throttled = (!item.soundObject.excludeThrottling && lastPlayed && throttle && (now - lastPlayed < throttle));

    // if this sound is the second (or greater) in a sequence, never skip.
    const isContinuingSequenceSound = (item.soundObject.sequenceOffset > 0);

    // skip if a BnB sound is queued, but pref was disabled in the meantime
    if (!gamePrefs.bnb) {
      item.soundObject.skip = true;
    }

    // too late to play, OR, too fast to replay
    if ((delayed || throttled || item.soundObject.skip) && !isContinuingSequenceSound) {

      const url = item.soundObject.options.url.substr(item.soundObject.options.url.lastIndexOf('/') + 1);

      if (delayed) {
        console.log(`Delayed (${delay} > ${maxDelay} msec)`, url, item);
      }

      if (throttled) {
        console.log(`Throttled ${now - lastPlayed} / ${throttle}, ${url}`);
      }

      if (item.soundObject.skip) {
        console.log('Skipping (part of sequence?)', url, item);
      }

      // hackish: mark as "skipped"
      item.soundObject.sound.skipped = true;

      // hackish
      item.soundObject.sound.sequenceOffset = item.soundObject.sequenceOffset;
      item.soundObject.sound.sequenceLength = item.soundObject.sequenceLength;

      // special case: fire onfinish() immediately, if specified.
      if (item.localOptions.onfinish) {
        item.localOptions.onfinish.apply(item.soundObject.sound, [{ ...item.soundObject.sound, skipped: true }]);
      }

      // fire the original onfinish, too.
      if (item.soundObject.options.onfinish && item.soundObject.options.onfinish !== item.localOptions.onfinish) {
        item.soundObject.options.onfinish.apply(item.soundObject.sound, [{ ...item.soundObject.sound, skipped: true }]);
      }

      return nextBNBSound();

    }

    const playDelay = item.soundObject.delay || (isContinuingSequenceSound ? 500 : 0);

    item.soundObject.lastPlayed = now + playDelay;

    playAndThen(item, nextBNBSound, playDelay);

  }

}

function playAndThen(soundReference, callback, delay = 0) {

  // given a sound reference, play it "and then" fire a custom callback.
  if (!soundReference?.soundObject || !callback) {
    console.warn('WTF no soundObject or missing callback?', soundReference, callback);
    return;
  }

  // preserve existing SMSound onfinish, if specified.
  const _onfinish = soundReference.soundObject.options.onfinish;

  const { sound } = soundReference.soundObject;

  const newOnFinish = function() {

    // hackish: avoid recursion
    if (soundReference.localOptions.onfinish && soundReference.localOptions.onfinish !== newOnFinish) soundReference.localOptions.onfinish.apply(sound, [sound]);

    // fire the original, if specified
    if (_onfinish) _onfinish.apply(sound, [sound]);

    sound.destruct();

    // break circular reference
    sound.parentSoundObject.sound = null;
    sound.parentSoundObject = null;

    // now, the local callback.
    callback();

  }

  function play() {
    
    // Note: firing this event counts toward *prevents* the "this is boring" commentary.
    gameEvents.fire(EVENTS.boring);

    sound.play({
      ...soundReference.localOptions,
      onfinish: newOnFinish
    });

  }

  if (delay) {
    if (game.data.paused) {
      window.setTimeout(play, delay);
    } else {
      common.setFrameTimeout(play, delay);
    }
  } else {
    play();
  }

}

function getSoundFromArray(ref) {

  if (!ref?.length) return;

  if (!ref.soundIndex) ref.soundIndex = 0;

  const arrayItem = ref[ref.soundIndex];

  // have we hit the end?
  if (++ref.soundIndex >= ref.length) {
    // shuffle could be done here, if not a sequence AND shuffle isn't excluded.
    ref.soundIndex = null;
  }

  // prevent recursion through nested array results
  if (arrayItem instanceof Array) {
    arrayItem.isSoundArray = true;
  }

  return arrayItem;

}

// --- BnB sound config ---

// https://youtu.be/nSsYgd96seg

function bnbURL(file) {
  if (window.location.hostname === 'localhost') return `audio/bnb/${file}.wav`;

  // SM2 will determine the appropriate format to play, based on client support.
  // URL pattern -> array of .ogg and .mp3 URLs
  return [
    `audio/mp3/bnb/${file}.mp3`,
    `audio/ogg/bnb/${file}.ogg`,
    `audio/bnb/${file}.wav`
  ];
}

const soundCache = {};

function add(url, volume = 50, throttle = 5000, onfinish, extraOptions = null) {
  
  let cacheable = !onfinish && !extraOptions;

  const cacheKey = `${url}_${volume}_${throttle}`;

  // eligible for re-use?
  if (soundCache[cacheKey] && cacheable) return soundCache[cacheKey];

  const sound = addSound(
    Object.assign({
      fixedPlaybackRate,
      url: bnbURL(url),
      volume,
      onfinish,
      throttle
    }, extraOptions)
  );

  if (cacheable) soundCache[cacheKey] = sound;

  return sound;

}

// volume for "very loud" (compressed) sounds
const VL_VOLUME = 20;

function addVL(url, ...rest) {
  return add(url, VL_VOLUME, ...rest);
}

function addBnBEvent(key, soundURLs) {

  const newSounds = [];

  soundURLs = shuffle(soundURLs);

  soundURLs.forEach((url) => {
    newSounds.push(addSound({
      url: bnbURL(url),
      volume: 50,
      fixedPlaybackRate
    }));
  });

  bnb[key] = shuffle(newSounds);

}

bnb.bnbYes = add('bnb_yes');

bnb.buttheadWhoaCool = shuffle([
  add('butthead_whoa'),
  add('butthead_that_was_cool'),
  add('bh_that_was_cool_vs'),
  add('butthead_cool'),
  add('bh_yes_a'),
  add('bh_yes_b'),
  add('bh_yes_c'),
  add('bh_yes_d'),
  add('butthead_[whoa]_did_you_see_that'),
  add('bh_cool'),
  bnb.bnbYes,
  add('bh_this_rocks'),
  addVL('bh_alright_cool_b_yeah'),
  addVL('bh_whoa_cool_excited'),
  addVL('bh_whoa_excited_laugh'),
  addVL('bh_yeah_excited_laugh'),
  addVL('bh_yes_excited'),
  addVL('bh_uh_alright'),
  addVL('bh_uh_cool'),
  addVL('bh_whoa_check_it_out'),
  addVL('bh_yeah_thats_cool')
]);
bnb.buttheadWhoaCool.maxDelay = 750;

bnb.settleDownBeavis = shuffle(
  add('bh_settle_down_beavis'),
  add('bh_settle_down_beavis_da'),
  addVL('bh_settle_down_beavis_wta')
);

bnb.buttheadCoolestThingEver = add('b_coolest_thing_ive_ever_seen');

bnb.lotsOfLaughs = shuffle([
  add('b_bh_laugh_lots_we_like_to_have_fun', 40),
  add('b_bh_laugh_lots_yeah', 40)
]);

bnb.rainstormMonologue = (() => {

  let phase = 0;
  const phases = ['', 'rain', 'hail', 'turd'];

  function whileplaying() {

    const { position } = this;

    if (!position) phase = 0;

    const state = phases[phase];

    function nextPhase() {
      phase++;
      updateStormStyle();
    }

    function updateStormStyle() {
      effects.updateStormStyle(phases[phase]);
      // only "start" if there is something coming down.
      if (phase) snowStorm.start();
    }

    if (!phase && position > 3000) {

      nextPhase();

      game.objects.notifications.add('☂️ Weather update: rainstorm 🌧️');
     

    } else if (state === 'rain' && position > 9500) {

      nextPhase();

      game.objects.notifications.add('☂️ Weather update: hailstorm 🌨️');

    } else if (state === 'hail' && position > 14000) {

      nextPhase();

      game.objects.notifications.add('☂️ Weather update: TURD STORM 💩😱');

      common.setFrameTimeout(() => {
        // back to regular snow
        phase = 0;
        updateStormStyle('snow');
        game.objects.notifications.add('☂️ Note: Snow can be enabled in game options. 🌨️');
      }, 15000);

      // eventually, stop snowing.
      common.setFrameTimeout(() => updateStormStyle(''), 15000);

    }

  }

  return addSequence(
    addVL('b_you_know_whatd_be_cool_rain_hailstorm', undefined, undefined, { whileplaying }),
    addVL('b_whoa_check_it_out_bh'),
    bnb.buttheadCoolestThingEver,
    addVL('b_whoa_thats_right_youre_right_again_bh'),
    bnb.lotsOfLaughs
  );

})();

bnb.beavisLightsOut = (() => {

  let phase = 0;
  const phases = ['default', 'lightsOut', 'lightsOn', 'end'];

  let body;

  function whileplaying() {

    if (!body) {
      body = document.body;
    }

    const { position } = this;

    if (!position) phase = 0;

    const state = phases[phase];

    if (!phase && position > 256) {

      phase++;
      if (body) body.style.opacity = 0.50;

    } else if (state === 'lightsOut' && position > 9100) {

      phase++;
      if (body) body.style.opacity = 0.66;

      // start a long fade, soon.
      common.setFrameTimeout(() => {
        if (!body) return;
        body.style.transition = 'opacity 15s linear';
        body.style.opacity = 1;
      }, 1000);
      
    } else if (state === 'lightsOn' && position > 27000) {

      phase++;

      // just in case this is $$$
      if (body) body.style.transition = '';

    }

  }

  function onfinish() {

    if (body) {
      body.style.opacity = 1;
      body = null;
    }

  }

  return addVL('b_bh_lights_out_dark_lets_go_to_stewarts', undefined, undefined, { whileplaying, onfinish });

})();

bnb.giganticSchlongConversation = addSequence(
  add('b_btw_gigantic_schlong', 40),
  add('b_yeah_and_im_hung_like_a_horse'),
  add('b_anyone_wanna_see_my_unit'),
  add('b_ahh_no_way')
);

bnb.beavisMonologues = shuffle([
  add('b_were_gonna_score_slots'),
  addVL('b_are_we_gonna_be_bald_i_dunno'),
  bnb.beavisLightsOut,
  addSequence(
    addVL('b_big_wiener_question'),
    bnb.giganticSchlongConversation
  ),
  addVL('b_have_you_been_getting_any'),
  addVL('b_here_i_sit_toilet_monologue'),
  addVL('b_knock_knock_joke'),
  addVL('b_one_of_these_things_song'),
  addSequence(
    add('b_pet_snake_joke'),
    bnb.giganticSchlongConversation
  ),
  addSequence(
    add('b_sailboat_question_talking_sense', 40),
    () => bnb.beavisRetorts
  ),
  addVL('bh_hey_beavis_do_something_funnny_or_something'),
  bnb.rainstormMonologue
]);

// hacks
if (winloc.match(/rain/i)) {
  bnb.beavisMonologues = bnb.rainstormMonologue;
} else if (winloc.match(/lightsOut/i)) {
  bnb.beavisMonologues = bnb.beavisLightsOut;
}

bnb.buttheadMonologues = shuffle([
  addVL('bh_eyeball_in_your_butt_you_always_say_stuff_like_that'),
  addVL('bh_happiness_you_said_penis'),
  addVL('bh_kinda_groovy_i_guess_so_i_was_just_kidding_dumbass'),
  addSequence(
    addVL('bh_mockery_this_sucks_b_can_you_handle_this_bh_i_gotta_take_a_leak'),
    addVL('bh_you_mean_youre_gonna_go_polish_your_helmet_you_are_correct_sir')
  ),
  addVL('bh_so_like_uh_did_you_ask_for_poofy_hair'),
  addVL('bh_uh_time_to_break_out_the_cards'),
  addVL('bh_were_all_gonna_die_speech'),
  addSequence(
    addVL('bh_yeah_check_this_out_golf_commentary'),
    addVL('bh_boioioing_b_you_cant_really_do_that_butthead')
  )
]);

bnb.p1InsultsBeavis = shuffle([
  addVL('b_i_think_p1_must_have_read_my_book_on_how_to_score'),
  addVL('b_p1_is_a_lazy_sob'),
  addVL('b_p1_is_stupid'),
  addVL('b_hey_bh_do_you_smell_toast_bh_p2_got_burned')
]);

bnb.p1InsultsButthead = shuffle([
  addVL('bh_p1_is_a_dumbass'),
  addVL('bh_p1_scores_about_as_much_as_you_b'),
]);

bnb.p2InsultsBeavis = addVL('b_p2_is_sucking');

bnb.p2InsultsButthead = shuffle([
  addVL('bh_i_think_this_game_is_too_hard_for_p2_hard'),
  addVL('bh_p2_sucks_loser'),
]);

bnb.p1ComplimentsButthead = addVL('bh_uh_p1_is_kicking_ass');

bnb.p2ComplimentsButthead = shuffle([
  addVL('bh_p2_is_some_sort_of_scoring_machine'),
  addVL('bh_whoa_p2_is_smart_and_stuff')
]);

bnb.beavisComplaints = shuffle([
  addVL('b_dammit_i_keep_losing'),
  addVL('b_dammit_i_lose_money_even_when_were_playing_for_funsies'),
  addVL('b_dammit_this_game_sucks')
]);

bnb.beavisRetorts = shuffle([
  addVL('b_dammit_shutup'),
  addVL('b_fartknocker_dumbass_bh_settle_down_dumbass'),
  addVL('b_gonna_read_a_magazine_tell_me_when_this_is_over'),
  addVL('b_heh_shut_up_fartknocker'),
  add('b_i_cant_concentrate_with_you_talking_bunghole', 40),
  addVL('b_i_knew_that_i_was_just_kidding'),
  addVL('b_i_suck_heh'),
  addVL('b_i_think_i_might_start_crying_pretty_soon'),
  addSequence(
    addVL('b_im_gonna_go_to_the_kitchen'),
    addVL('bh_you_mean_youre_gonna_go_polish_your_helmet_you_are_correct_sir'),
    addVL('bh_uh_you_can_play_by_yourself_then')
  ),
  addVL('b_oh_boy_this_sucks_disappointed'),
  addVL('b_oh_yeah_heh_heh'),
  addVL('b_oh_yeah_youre_right_heh'),
  addVL('b_rarr_great'),
  addVL('b_shut_up_aggressive'),
  addVL('b_shut_up_butthead_uh_heh'),
  addVL('b_shut_up_butthead_x'),
  addVL('b_shut_up_so_i_can_concentrate'),
  addVL('b_thank_you_very_much'),
  addVL('b_thank_you_very_much_elvis2'),
  addVL('b_thank_you_very_much_elvis_short'),
  addVL('b_that_was_pretty_good_heh'),
  addVL('b_the_amazing_butthead'),
  addSequence(
    addVL('b_well_im_gonna_go_spank_my_monkey'),
    addVL('bh_uh_you_can_play_by_yourself_then')
  ),
  addVL('b_well_ok_maybe_youre_right'),
  addVL('b_what_bh_i_didnt_say_anything'),
  addVL('b_yeah_up_yours'),
  addVL('b_you_need_to_shut_up_so_i_can_concentrate'),
  addVL('b_heh_yeah_shut_up_fartknocker')
]);

bnb.bGoodQuestionResponse = addSequence(
  addVL('b_good_question_wondering_myself'),
  () => Math.random() >= 0.5 && addVL('bh_oh_yeah_go_figure')
);

bnb.beavisTry = addVL('b_at_least_i_try_heh');

bnb.takeSoLong = add('bh_dammit_beavis_arent_you_done_yet_how_come_you_always_take_so_long');

bnb.buttheadInsultsArray = shuffle([
  addVL('bh_b_how_come_youre_such_a_weirdo'),
  addVL('bh_b_im_gonna_have_to_ask_you_to_leave'),
  addVL('bh_b_shut_up_if_you_arent_gonna_say_something_cool_shut_up'),
  addVL('bh_b_you_dumbass_open_your_eyes'),
  addVL('bh_beavis_fatherly_stop_it'),
  addVL('bh_boy_i_tell_you_beavis_youre_a_stupid_sob'),
  addVL('bh_dammit_beavis_just_nod_your_head'),
  addSequence(
    addVL('bh_dammit_beavis_quit_trying_to_outsmart_me'),
    add('b_is_this_a_god_dam')
  ),
  addVL('bh_dammit_beavis_shut_up_angry'),
  addSequence(
    addVL('bh_dammit_beavis_stop_it'),
    add('b_is_this_a_god_dam')
  ),
  addSequence(
    addVL('bh_dammit_beavis_you_always_ruin_everything'),
    () => Math.random() >= 0.5 && bnb.beavisTry
  ),
  addVL('bh_dumbass_heh_heh'),
  addVL('bh_dumbass_to_b'),
  addVL('bh_kiss_my_ass_beavis'),
  addVL('bh_shut_up_beavis_huh'),
  addVL('bh_shut_up_beavis_laugh2'),
  addVL('bh_uh_huh_huh_huh_dumbass'),
  addVL('bh_uh_you_dumbass'),
  addVL('bh_uh_youre_never_gonna_score_beavis'),
  addVL('bh_uhh_that_was_dumb_b'),
  addVL('bh_whoa_have_you_been_paying_attention_at_school_wussy'),
  addVL('bh_would_you_like_some_fries_with_that_b'),
  addVL('bh_youre_a_dumbass_yell'),
  addVL('bh_youre_homophobic_beavis'),
  addVL('bh_youre_never_gonna_score_b_shut_up_cellphone'),
  addVL('bh_buttmunch_heh'),
  addVL('bh_that_was_all_like_a_bunch_of_crap'),
  add('butthead_hey_slow_down'),
  add('butthead_quit_screwing_around'),
  add('butthead_uh_what_are_you_doing'),
  bnb.takeSoLong,
  add('butthead_whats_your_problem_dumbass'),
  add('butthead_you_dork'),
  add('butthead_you_dumbass'),
]);

bnb.buttheadInsults = Object.assign(
  addSequence(
    bnb.buttheadInsultsArray,
    bnb.beavisRetorts
  ), {
    // special case: beavis' retort is baked into this particular sound.
    playNextCondition: (sound) => !sound?.url?.match(/phobic/i)
  }
);

bnb.buttheadIdle = add('vs_butthead_was_i_supposed_to_be_doing_something');

bnb.beavisIdle = addSequence(
  add('butthead_whats_taking_you_so_damn_long'),
  bnb.beavisRetorts
);

bnb.buttheadComplaints = shuffle([
  addVL('bh_that_sucks_exclamation'),
  addVL('bh_this_is_bad_i_mean_it_sucks'),
  add('butthead_that_sucked'),
  add('butthead_this_is_starting_to_piss_me_off'),
  add('butthead_this_sucks'),
  bnb.buttheadIdle,
  addVL('bh_this_sucks_actually_all_the_time_mean_it'),
  addSequence(
    add('whoa_i_just_figured_this_sucks'),
    () => bnb.beavisOhYeah
  ),
  add('bh_this_sucks_more_than_ever_da', 40),
  add('bh_this_sucks_bh_yeah_it_really_sucks_da', 40)
]);

bnb.uhOh = add('butthead_uh_oh');

bnb.hurryUpButthead = addSequence(
  add('vs_beavis_hurry_up_butthead', 40),
  () => Math.random() >= 0.5 && add('bh_beavis_fatherly')
);

bnb.thoughtWeWereGonnaScore = add('b_dammit_butthead_i_thought_we_were_gonna_score_today', 75);
bnb.thoughtWeWereGonnaScore.throttle = 60000;

bnb.beavisBeerAndScore = addSequence(
  add('b_dammit_butthead_we_came_here_to_drink_beer_and_score', 50),
  () => bnb.neverScored
);
bnb.beavisBeerAndScore.throttle = 60000;

bnb.beavisBigSchlong = add('beavis_schlong', 50);
bnb.beavisBigSchlong.excludeDelay = true;

bnb.schlong = addSequence(
  bnb.beavisBigSchlong,
  () => Math.random() >= 0.5 && bnb.bigOne,
  () => Math.random() >= 0.5 && bnb.mightNeedThatSomeday
);
bnb.schlong.excludeDelay = true;

bnb.bigOne = add('bh_yeah_thats_a_big_one_alright');
bnb.bigOne.excludeDelay = true;

bnb.gonnaKickYourAss = add('beavis_im_gonna_kick_your_ass_right_now');

bnb.youSuckButthead = add('vs_beavis_you_suck_butthead');

bnb.shutUpButthead = shuffle([
  add('b_shut_up_butthead2', 40),
  add('b_shut_up_butthead_i_score_all_the_time', 40)
]);

bnb.almostThere = add('butthead_uh_almost_there_dude');

bnb.comeToBeavisToo = add('b_yeah_come_to_beavis_too_boioioing', 50);
bnb.comeToBeavisToo.maxDelay = 1000;

bnb.gonnaScore = shuffle([
  add('bh_this_is_it_beavis_were_finally_going_to_score_thank_god'),
  add('bh_were_gonna_score', 40),
  add('b_were_gonna_score', 40),
  add('b_were_gonna_score_x2', 40)
]);

bnb.beavisReallyGonnaScore = add('b_cool_im_gonna_score_really_gonna_happen', 40);

bnb.beavisReally = shuffle([
  add('beavis_no_way_really'),
  add('b_really_cool')
]);

bnb.mightNeedThatSomeday = add('b_thats_mine_might_need_that_someday');

bnb.taDammit = shuffle([
  add('ta_well_now_hold_on_a_minute'),
  add('ta_ahh_dammit'),
  add('ta_dammit_2'),
  add('ta_dammit_3'),
  add('ta_dammit_4'),
  add('ta_dammit_5')
]);

bnb.beavisCapturedBunker = shuffle([
  add('beavis_i_scored', 75),
  add('beavis_yeah'),
  add('beavis_yeah_yeah'),
  add('beavis_come_on', 85),
  addVL('b_stop_in_the_name_of_the_law_vl'),
  bnb.mightNeedThatSomeday,
  ...bnb.taDammit
]);

bnb.buttheadCapturedBunker = shuffle([
  add('bh_did_i_just_score_da', 40),
  add('butthead_come_to_butthead', 60),
  ...bnb.taDammit,
  addSequence(
    add('butthead_yes_we_got_another_one', 50),
    () => Math.random() >= 0.5 && bnb.beavisReally
  ),
  add('bh_kneel_before_your_king')
]);

bnb.hardReminder = addSequence(
  addVL('bh_uh_does_that_remind_you_of_anything_beavis'),
  addVL('bh_hard_laugh'),
  () => bnb.boioioing,
  bnb.lotsOfLaughs
);

bnb.notEasyResponse = shuffle([
  add('bh_settle_down_beavis_noone_said_it_would_be_easy'),
  addVL('bh_yeah_really_i_thought_this_game_was_supposed_to_be_cool'),
  addVL('bh_uh_oh_yeah_i_knew_that'),
  bnb.hardReminder
]);

bnb.beavisReallyHard = addSequence(
  add('b_dammit_this_is_really_hard_butthead'),
  bnb.notEasyResponse
);

bnb.beavisTooHard = addSequence(
  shuffle([
    add('beavis_dammit_they_make_this_too_hard'),
    add('vs_beavis_whoa_thats_hard')
  ]),
  bnb.notEasyResponse
);

bnb.beavisLostBunker = shuffle([
  add('beavis_damn_son_of_a_bitch'),
  bnb.buttheadInsults,
  ...bnb.beavisComplaints
]);
bnb.beavisLostBunker.maxDelay = 1000;

bnb.buttheadLostBunker = shuffle([
  add('butthead_uh_oh'),
  add('butthead_uhh_wait_a_minute'),
  add('butthead_this_sucks'),
  addSequence(
    add('bh_dammit_this_sucks_its_like_too_hard_or_something'),
    addVL('bh_uh_does_that_remind_you_of_anything_beavis'),
    addVL('bh_hard_laugh'),
    bnb.lotsOfLaughs
  ),
  ...bnb.buttheadComplaints
]);
bnb.buttheadLostBunker.maxDelay = 1000;

bnb.buttheadOKGetReadyDude = add('butthead_ok_get_ready_dude');

bnb.beavisGonnaBeCool = shuffle([
  add('b_this_is_gonna_be_cool_laugh'),
  addVL('b_whoa_this_is_gonna_be_cool'),
  addVL('b_todays_army')
]);
bnb.beavisGonnaBeCool.excludeDelay = true;

bnb.buttheadGonnaBeCool = add('bh_this_is_gonna_be_cool');
bnb.buttheadGonnaBeCool.excludeDelay = true;

bnb.beavisYeahMeToo = shuffle([
  add('b_yeah_yeah_me_too_i_want_some_too_that_would_rule'),
  add('b_oh_yeah_me_too_gonna_do_too')
]);
bnb.beavisYeahMeToo.excludeDelay = true;

bnb.dammitItsBroken = add('b_dammit_its_broken_or_something');
bnb.dammitItsBroken.delay = 2000;

bnb.howToTurnOn = addSequence(
  add('b_i_wonder_how_you_turn_this_damn_thing_on', 50),
  () => Math.random() >= 0.5 && bnb.dammitItsBroken
);

bnb.rumble = add('b_lets_get_ready_to_rumble');

bnb.beavisHereWeGo = add('beavis_voice_here_we_go');

bnb.buttheadLetsFinishThis = addSequence(
  add('bh_cmon_beavis_lets_finish'),
  bnb.beavisYeahMeToo
);

bnb.buttheadGoForItBeavis = add('butthead_go_for_it_beavis');
bnb.buttheadGoForItBeavis.excludeDelay = true;

bnb.beavisMyTurn = add('beavis_my_turn');
bnb.beavisMyTurn.excludeDelay = true;

bnb.beavisThankYouDriveThrough = shuffle([
  add('vs_beavis_thank_you_drive_through', 40),
  add('b_thank_you_drive_through', 40),
  add('beavis_thank_you_drive_through_please'),
  addVL('b_thank_you_drive_through_long'),
  addVL('b_thank_you_my_name_is_beavis_good_night_drive_through'),
  addVL('bh_thank_you_very_much_now_please_get_the_hell_out_of_here')
]);

bnb.beavisThankYouDriveThrough.maxDelay = 500;

bnb.buttheadIDunno = add('butthead_uh_i_dunno', 50);
bnb.buttheadIDunno.maxDelay = 2000;

bnb.beavisBattleship = shuffle([
  add('vs_beavis_you_sank_my_battleship', 40),
  addSequence(
    add('beavis_are_explosions_science', 40),
    () => Math.random() >= 0.5 && bnb.buttheadIDunno
  ),
  ...bnb.beavisThankYouDriveThrough
]);
bnb.beavisBattleship.throttle = 60000;

bnb.buttheadDirectHitBeavis = shuffle([
  add('vs_butthead_direct_hit_beavis', 40),
  addVL('bh_well_that_was_pretty_good_i_guess'),
  bnb.p1ComplimentsButthead
]);
bnb.buttheadDirectHitBeavis.throttle = 60000;

bnb.sixty = add('vs_beavis_60');
bnb.sixtyEight = add('vs_butthead_68');
bnb.sixtyNine = addSequence(
  add('vs_butthead_69'),
  bnb.lotsOfLaughs
);
bnb.seventy = add('vs_bnb_70');

bnb.cockaDoodleDoo = addSequence(
  addVL('b_cockadoodledoo_laugh'),
  bnb.settleDownBeavis
);
bnb.cockaDoodleDoo.throttle = 120000;

bnb.cock = addSequence(
  add('vs_butthead_cock', 75),
  () => Math.random() >= 0.5 && bnb.cockaDoodleDoo
);
bnb.cock.throttle = 15000;

bnb.buttheadUhWhateverDumbass = add('butthead_uh_whatever_dumbass');
bnb.buttheadUhWhateverDumbass.excludeDelay = true;

bnb.beavisNoWayItsMyTurn = shuffle([
  add('beavis_no_way_its_my_turn'),
  add('b_no_way_im_not_leaving_until_i_score', 40),
  add('b_no_way_shut_up_butthole_im_gonna_kick_your_ass', 40),
  add('b_shut_up_butthead2', 40)
]);
bnb.beavisNoWayItsMyTurn.excludeDelay = true;

bnb.buttheadDammitBeavisIWasAboutToScore = add('bh_dammit_beavis_i_was_about_to_score');
bnb.buttheadDammitBeavisIWasAboutToScore.excludeDelay = true;

bnb.thatsALoadOff = add('b_thats_a_load_off_my_mind', 40);

bnb.buttheadWatchTheMaster = shuffle([
  addSequence(
    add('butthead_watch_the_master', 50),
    bnb.thatsALoadOff
  ),
  add('butthead_watch_the_master_long')
]);
bnb.buttheadWatchTheMaster.excludeDelay = true;

bnb.volumeTestSounds = [
  shuffle([
    add('beavis_grunt_3'),
    add('beavis_grunt_4')
  ]),
  add('beavis_xscream_1'),
  add('b_butthole'),
  add('beavis_dammit'),
  add('bh_hit'),
  add('bh_buttmunch')
];

bnb.volumeTestSounds.forEach((sound) => {
  sound.playImmediately = true;
  sound.excludeThrottling = true;
});

bnb.beavisPoopShort = shuffle([
  add('vs_beavis_poop'),
  add('b_poop_short'),
  add('b_stools_poop', 30)
]);
bnb.beavisPoopShort.playImmediately = true;

bnb.beavisPoop = shuffle([
  add('vs_beavis_poop'),
  add('b_poop_short'),
  add('b_poop_heh', 30),
  add('b_stools_poop', 30),
  add('bh_plop', 30)
]);
bnb.beavisPoop.playImmediately = true;

const incomingSMCommon = [
  add('beavis_hey_wait_a_minute_whats_going_on'),
  addSequence(
    add('bh_whats_going_on_here', 40),
    bnb.bGoodQuestionResponse
  ),
  add('beavis_wait_a_minute'),
  add('butthead_uh_oh'),
  add('butthead_uhh_wait_a_minute'),
  add('beavis_dammit'),
  add('web_beavis_ten_six_niner'),
  add('beavis_are_you_threatening_me_tv'),
  add('beavis_are_you_threatening_me')
];

bnb.incomingSmartMissile = shuffle([
  ...incomingSMCommon,
  addSequence(add('beavis_hey_butthead_whats_that'), bnb.buttheadIDunno)
]);
bnb.incomingSmartMissile.maxDelay = 1000;

// rubber chicken-specific variant.
bnb.incomingSmartMissilePlusCock = shuffle([
  ...incomingSMCommon,
  addSequence(add('b_um_heh_whats_that'), bnb.cock),
  bnb.cock
]);

bnb.beavisOhYeah = shuffle([
  add('b_oh_yeah_laugh', 40),
  add('b_oh_yeah_mm_hmm', 40),
  add('b_heh_ill_be_damned_heh', 40),
  addVL('b_whoa_really_ill_be_damned')
]);
bnb.beavisOhYeah.maxDelay = 1000;

bnb.buttheadUhOK = add('bh_uh_ok', 40);

bnb.beavisGetOffMyCaseHippie = add('b_get_off_my_case_hippie', 40);

bnb.notOffToAGoodStartResponse = shuffle([
  ...bnb.beavisOhYeah,
  bnb.beavisGetOffMyCaseHippie,
  bnb.buttheadUhOK,
  addSequence(
    add('b_mr_dvd'),
    add('bh_pretty_smart_b_thanks_bh_dumbass')
  )
]);

bnb.notOffToAGoodStart = addSequence(
  add('dvd_bnb_were_not_off_to_a_very_good_start', 50),
  bnb.notOffToAGoodStartResponse
);
bnb.notOffToAGoodStart.throttle = 60 * 1000 * 5;

bnb.iHateThisStupidGame = add('beavis_i_hate_this_stupid_game');

bnb.bhWhatsTakingYouSoDamnLong = addSequence(
  add('butthead_whats_taking_you_so_damn_long'),
  () => Math.random() >= 0.5 && bnb.bGoodQuestionResponse
);

bnb.beavisLostHelicopter = shuffle([
  bnb.iHateThisStupidGame,
  bnb.thoughtWeWereGonnaScore,
  add('bh_that_was_stupid_beavis_but_it_was_pretty_cool_too'),
  add('beavis_nooooo', 40),
  bnb.beavisTooHard,
  bnb.beavisReallyHard,
  bnb.notOffToAGoodStart,
  add('beavis_freakout'),
  add('beavis_hey_hey_no_ahh'),
  add('beavis_dammit_i_wanna_score_whatever_buttmunch'),
  addSequence(
    add('bh_beavis_fatherly'),
    () => Math.random() >= 0.5 && add('b_dammit', 40),
  ),
  add('b_this_sucks_how_do_they_do_it_in_the_army'),
  addSequence(
    add('beavis_dammit_i_wanna_score', 50),
    () => bnb.neverScored
  ),
  bnb.bhWhatsTakingYouSoDamnLong,
  bnb.buttheadInsults,
  ...bnb.p1InsultsButthead,
  ...bnb.beavisComplaints
]);

bnb.beavisLostHelicopter.maxDelay = 3000;

bnb.beavisEjectedHelicopter = shuffle([
  add('beavis_nooooo', 40),
  add('beavis_freakout'),
  add('beavis_hey_hey_no_ahh'),
  add('butthead_uh_what_are_you_doing'),
  add('butthead_whats_your_problem_dumbass'),
  add('butthead_you_dumbass'),
  addSequence(
    add('bh_beavis_fatherly'),
    () => Math.random() >= 0.5 && add('b_dammit', 40),
  )
]);

bnb.beavisEjectedHelicopter.maxDelay = 2000;

bnb.buttheadEjectedHelicopter = shuffle([
  add('bh_uh_hello_person_playing'),
  add('bh_buttmunch'),
  add('butthead_i_meant_to_do_that', 55),
  add('butthead_uh_okay')
]);
bnb.buttheadEjectedHelicopter.maxDelay = 2000;

bnb.beavisLostUnit = shuffle([
  bnb.iHateThisStupidGame,
  bnb.beavisTooHard,
  add('beavis_freakout'),
  add('beavis_hey_hey_no_ahh'),
  bnb.beavisReallyHard,
  add('butthead_you_dork'),
  add('butthead_you_dumbass'),
  add('bh_beavis_fatherly'),
  add('beavis_damn_son_of_a_bitch'),
  add('beavis_losers'),
  add('beavis_rarr_stop'),
  bnb.buttheadInsults
]);
bnb.beavisLostUnit.maxDelay = 2000;

bnb.buttheadLostHelicopter = shuffle([
  add('butthead_i_meant_to_do_that', 55),
  bnb.beavisTooHard,
  add('beavis_taking_your_sweet_ass_time'),
  add('beavis_whatd_you_do_that_for'),
  add('beavis_wth_are_you_doing_fartknocker'),
  addSequence(
    add('bh_dammit_this_sucks_its_like_too_hard_or_something'),
    addVL('bh_uh_does_that_remind_you_of_anything_beavis'),
    addVL('bh_hard_laugh'),
    bnb.lotsOfLaughs
  ),
  ...bnb.buttheadComplaints,
  bnb.notOffToAGoodStart,
  addSequence(
    bnb.p1InsultsBeavis,
    bnb.buttheadInsultsArray
  ),
  bnb.p2InsultsBeavis
]);
bnb.buttheadLostHelicopter.maxDelay = 3000;

bnb.buttheadLostUnit = shuffle([
  add('butthead_that_sucked'),
  add('butthead_this_is_starting_to_piss_me_off'),
  add('butthead_this_sucks'),
  add('butthead_quit_screwing_around'),
  add('butthead_uh_okay'),
  ...bnb.buttheadComplaints
]);
bnb.buttheadLostUnit.maxDelay = 2000;

bnb.beavisInfantryPickup = [
  add('b_get_over_here', 40),
  add('vs_beavis_youre_coming_with_me', 40)
];
bnb.beavisInfantryPickup.maxDelay = 500;

bnb.comeToButthead = addSequence(
  add('butthead_come_to_butthead', 60),
  () => Math.random() >= 0.5 && bnb.comeToBeavisToo
);

bnb.buttheadInfantryPickup = shuffle([
  bnb.comeToButthead,
  addVL('bh_thank_you_may_i_have_another')
]);
bnb.buttheadInfantryPickup.maxDelay = 500;

bnb.tv = add('da_motel_tv', undefined, undefined, undefined, { onplay: function(sound) { if (!sound.skipped) common.setVideo('whoa_tv'); } });

bnb.letsKickALittleAss = add('butthead_lets_kick_a_little_ass', 60);
bnb.letsKickALittleAss.excludeDelay = true;

bnb.heresACoolGame = add('butthead_heres_a_cool_game');
bnb.heresACoolGame.excludeDelay = true;

bnb.bhLetsRock = add('bh_lets_rock');
bnb.bhLetsRock.throttle = 60000;

bnb.singing = shuffle([
  add('bnb_singing_take_that'),
  add('bnb_singing_2'),
  add('bnb_singing_3'),
  add('bnb_singing_4')
]);
// bnb.singing.playImmediately = true;

bnb.singingSequence = addSequence(
  ...shuffle([
    add('bnb_singing_take_that'),
    add('bnb_singing_2'),
    add('bnb_singing_3'),
    add('bnb_singing_4')
  ])
);
// bnb.singingSequence.playImmediately = true;

bnb.singingShort = shuffle([
  addSound({
    url: bnbURL('bnb_singing_take_that'),
    volume: 50,
    fixedPlaybackRate,
    from: 0,
    to: 5700
  }),
  add('bnb_singing_2'),
  add('bnb_singing_3'),
  add('bnb_singing_4')
]);

// bnb.singingShort.playImmediately = true;

bnb.theAlmightyBungholio = add('beavis_the_almighty_bungholio', 75);

bnb.heyBeavisIThinkWeJustScored = add('bh_hey_beavis_i_think_we_scored', 65);
bnb.heyBeavisIThinkWeJustScored.excludeDelay = true;

bnb.beavisNoNoNoNooo = add('b_no_noo_nooo_nooooo');

bnb.beavisGrunt = shuffle([
  add('beavis_grunt_1'),
  add('beavis_grunt_2'),
  add('beavis_grunt_3'),
  add('beavis_grunt_4')
]);
bnb.beavisGrunt.excludeThrottling = true;
bnb.beavisGrunt.playImmediately = true;

bnb.buttheadBelch = addSound({
  url: bnbURL('butthead_belch'),
  volume: 50
});
bnb.buttheadBelch.excludeThrottling = true;
bnb.buttheadBelch.playImmediately = true;

bnb.screamShort = shuffle([
  add('scream_1'),
  add('scream_2'),
  add('butthead_stuck_1'),
  add('butthead_stuck_2'),
  add('bh_hit'),
  add('bh_hit_a'),
  add('bh_hit_b'),
  add('bh_hit_c'),
  add('beavis_aahhhh', 15),
  add('beavis_ahh_short'),
  add('beavis_freak_short_1'),
  add('beavis_freak_short_2'),
  add('beavis_no_short'),
  add('b_dammit', 40),
  add('beavis_scream'),
  add('b_scream', 40),
  add('b_oww_loud', 35),
  add('b_owww', 40),
  add('beavis_xscream_1', 40),
  add('beavis_xscream_2', 40),
  add('beavis_xscream_3', 40),
  add('beavis_xscream_4', 40),
  add('beavis_xscream_5', 40),
  add('beavis_xscream_6', 40),
  add('beavis_xscream_7', 40),
  add('beavis_xscream_8', 40),
  add('b_ow_1', 40),
  add('b_ow_2', 40),
  add('b_ow_3', 40),
  add('b_ow_4', 40)
]);
bnb.screamShort.maxDelay = 500;
bnb.screamShort.playImmediately = true;

bnb.beavisCutItOutBunghole = add('b_cut_it_out_bunghole', 40);

bnb.beavisScreamPlusCutItOut = Object.assign(addSound({
  url: bnbURL('beavis_aahhhh'),
  fixedPlaybackRate,
  volume: 15,
  onfinish: function(sound) {
    if (!sound || sound.skipped) return;
    playSound(bnb.beavisCutItOutBunghole);
  }
}), { maxDelay: 500, excludeDelay: false, playImmediately: false });

bnb.scream = shuffle([
  ...bnb.screamShort,
  bnb.beavisScreamPlusCutItOut,
  add('b_ahh_fartknocker')
]);
bnb.scream.maxDelay = 500;

bnb.screamPlusSit = shuffle([
  ...bnb.scream,
  add('beavis_sit_or_ill_kick_your_ass'),
]);
bnb.screamPlusSit.playImmediately = false;
bnb.screamPlusSit.pauseBNBQueue = true;

bnb.buttheadCutItOutDumbass = add('butthead_cut_it_out_dumbass');
bnb.buttheadCutItOutDumbass.maxDelay = 500;

bnb.buttheadScreamShort = shuffle([
  add('butthead_stuck_1'),
  add('butthead_stuck_2'),
  add('bh_hit'),
  add('bh_hit_a'),
  add('bh_hit_b'),
  add('bh_hit_c'),
  add('bh_ugh'),
]);
bnb.buttheadScreamShort.playImmediately = true;

bnb.buttheadScream = shuffle([
  ...bnb.buttheadScreamShort,
  // NB: two joined .wav files
  add('butthead_ugh_cut_it_out_dumbass')
  /*
  addSequence(
    add('bh_ugh'),
    add('butthead_cut_it_out_dumbass')
  )
  */
]);
bnb.buttheadScream.maxDelay = 500;

bnb.beavisScreamShort = shuffle([
  add('scream_1'),
  add('scream_2'),
  add('beavis_aahhhh', 15),
  add('beavis_ahh_short'),
  add('beavis_freak_short_1'),
  add('beavis_freak_short_2'),
  add('beavis_no_short'),
  add('b_dammit', 40),
  add('beavis_scream'),
  add('b_scream', 40),
  add('b_oww_loud', 35),
  add('b_owww', 40),
  add('beavis_xscream_1', 40),
  add('beavis_xscream_2', 40),
  add('beavis_xscream_3', 40),
  add('beavis_xscream_4', 40),
  add('beavis_xscream_5', 40),
  add('beavis_xscream_6', 40),
  add('beavis_xscream_7', 40),
  add('beavis_xscream_8', 40)
]);
bnb.beavisScreamShort.maxDelay = 300;
bnb.beavisScreamShort.playImmediately = true;

bnb.beavisScream = shuffle([
  // "ahhh! ... cut it out, bunghole!"
  ...bnb.beavisScreamShort,
  bnb.beavisScreamPlusCutItOut
]);

bnb.beavisScream.maxDelay = 500;

bnb.dvdPrincipalScream = shuffle([
  add('dvd_scream'),
  add('dvd_scream_2'),
  add('dvd_scream_3'),
  add('principal_scream'),
  add('principal_scream_2'),
  add('principal_scream_3'),
  add('principal_scream_4'),
  add('principal_scream_5'),
  add('principal_scream_6')
]);
bnb.dvdPrincipalScream.playImmediately = true;

bnb.iAmFullOfCrap = add('b_yeah_i_am_full_of_crap_ill_be_damned');
bnb.prettyBad = add('b_i_dunno_butthead_its_pretty_bad');
bnb.iKnowShutUp = add('b_um_heh_um_i_know_that_butthead_shut_up');
bnb.thatsPrettyFunnyButthead = add('beavis_thats_pretty_funny_butthead');
bnb.youShouldHaveHeard = add('b_you_should_have_heard_what_you_just_said_bh');

bnb.beavisDontBeStupid = addSequence(
  add('bh_dont_be_stupid_beavis'),
  shuffle([bnb.prettyBad, bnb.thatsALoadOff])
);

bnb.fullOfCrap = addSequence(
  shuffle([add('bh_beavis_youre_full_of_crap'), add('bh_beavis_youre_full_of_crap2')]),
  shuffle([bnb.iAmFullOfCrap, bnb.prettyBad, bnb.iKnowShutUp, bnb.thatsPrettyFunnyButthead, bnb.youShouldHaveHeard])
);

bnb.lyingSack = addSequence(
  addVL('bh_beavis_youre_a_lying_sack_of_turds'),
  shuffle([bnb.thatsPrettyFunnyButthead, bnb.youShouldHaveHeard])
);

bnb.poopQuestion = addSequence(
  add('b_hey_butthead_do_you_have_to_poop', 50),
  shuffle([bnb.lyingSack, bnb.beavisDontBeStupid, bnb.fullOfCrap])
);
bnb.poopQuestion.excludeDelay = true;

bnb.money = shuffle([
  add('b_money_money_laugh'),
  add('b_money_money_money'),
  add('bh_money')
]);
bnb.money.excludeDelay = true;

bnb.beavisCmonButthead = add('vs_cmon_butthead_hit_that_fartknocker', 40, 30000);

bnb.beavisYouMissed = shuffle([
  add('b_are_you_supposed_to_miss_bh'),
  add('b_you_missed_him_bh'),
  add('b_bh_fatherly_stop_it')
]);

bnb.beavisYouMissedResponse = shuffle([
  add('bh_beavis_fatherly'),
  add('bh_uh_hello_person_playing'),
  add('bh_buttmunch'),
  add('butthead_i_meant_to_do_that', 55),
  bnb.buttheadUhWhateverDumbass,
  bnb.buttheadInsults
]);
bnb.beavisYouMissedResponse.excludeDelay = true;

bnb.whatKindOfMessage = addSequence(addVL('b_what_kind_of_message_is_that_sending'), bnb.buttheadIDunno);

bnb.buttheadJerkingMyChain = addSequence(
  shuffle([
    addVL('b_look'),
    addVL('b_what_the_hell_is_that_thing_heh'),
    addVL('b_whoa_check_it_out_bh'),
    addVL('b_ooh_baby_yeah'),
    addVL('b_whoa_whats_that_what_is_that_thing'),
    addVL('b_whoa_what_is_that_thing_heh')
  ]),
  add('bh_jerking_my_chain', 40),
  () => Math.random() >= 0.25 && bnb.whatKindOfMessage
);
bnb.buttheadJerkingMyChain.throttle = 30000;
bnb.buttheadJerkingMyChain.maxDelay = 5000;

bnb.cornholioRepair = shuffle([
  add('vs_beavis_mumbling_eating_1'),
  add('vs_beavis_mumbling_eating_2'),
  add('b_eating_cornholio_transition_sound_1'),
  addVL('b_cornholio_eating'),
  addVL('b_cornholio_coffee'),
  addVL('b_cornholio_coffee_2'),
]);

// bnb.cornholioRepair.playImmediately = true;

bnb.cornholioAnnounce = shuffle([
  add('beavis_i_am_cornholio_loud', 33),
  add('beavis_i_am_cornholio_movie', 65),
  add('beavis_i_am_cornholio_short_tv', 65),
  add('cornholio_i_am_cornholio', 25),
  add('cornholio_you_can_take_me', 25),
  // all these might need to be 30% volume
  add('b_cornholio_the_almighty_bungholio'),
  add('b_cornholio_i_am_cornholio_titicaca_prepare_great_feast'),
  add('b_eating_cornholio_transition_complete'),
  add('b_eating_cornholio_transition_my_bunghole_will_speak_now'),
  add('b_cornholio_i_come_here_to_bring_your_people_tp'),
  addVL('b_are_you_threatening_me_i_am_cornholio'),
  addVL('i_am_the_great_cornholio_gringo_no_bunghole')
]);

bnb.cornholioAnnounce.regularQueueAlways = true;

bnb.cornholioAttack = shuffle([
  add('cornholio_my_bunghole_it_speaks_loud', 33),
  add('cornholio_tp_for_my_bunghole'),
  add('vs_beavis_bungholio_bungholio'),
  add('vs_beavis_cornholio_angry_mutter'),
  add('beavis_the_almighty_bungholio', 33),
  add('beavis_are_you_threatening_me_tv'),
  add('beavis_are_you_threatening_me'),
  add('beavis_you_cannot_escape_the_almighty_bunghole_tv'),
  add('beavis_do_not_make_my_bunghole_angry_tv'),
  add('beavis_tp_for_my_bunghole'),
  add('vs_beavis_you_do_not_want_to_face_the_wrath_of_my_bunghole'),
  add('vs_beavis_i_am_cornholio_my_bunghole_will_speak_now_short'),
  add('cornholio_do_you_have_any_tp', 33),
  // all these might need to be 30% volume
  add('b_cornholio_do_not_make_my_bunghole_angry'),
  add('b_cornholio_do_you_have_any_olio_for_my_bungholio'),
  add('b_cornholio_do_you_have_any_tp'),
  add('b_cornholio_do_you_have_tp'),
  add('b_cornholio_king_of_bungholio'),
  add('b_i_need_a_spatula_for_my_bunghole_the_almighty_bunghole_cornholio'),
  add('b_cornholio_bungholio_x2'),
  add('b_cornholio_caca'),
  add('b_cornholio_i_am_cornholio'),
  add('b_eating_cornholio_i_have_no_bunghole'),
  add('b_eating_cornholio_i_have_no_bunghole_2'),
  add('b_are_you_threatening_me_my_bunghole_will_not_wait'),
  add('bunghole_question'),
  add('bunghole_x3'),
  add('cornholio_i_order_you_to_surrender_your_tp')
]);
bnb.cornholioAttack.throttle = 10000;
bnb.cornholioAttack.regularQueueAlways = true;

bnb.boioioing = shuffle([
  add('boing_a'),
  add('boing_b'),
  add('boing_c'),
  add('boing_d'),
  add('boing_e'),
  add('boing_f'),
  // TODO: DRY
  Object.assign(addVL('b_boioioing_long'), { playImmediately: false }),
  Object.assign(addVL('b_boioioioioing2'), { playImmediately: false }),
  Object.assign(addVL('bh_boioioing_b_you_cant_really_do_that_butthead'), { playImmediately: false })
]);

bnb.boioioing.excludeDelay = true;
bnb.boioioing.throttle = 1000;
bnb.boioioing.playImmediately = true;

bnb.gameOverLose = addSequence(
  add('b_its_all_over_never_gonna_score', 75),
  () => (game.data.isBeavis ? addVL('bh_uhh_yeah_you_lost_the_game_is_over') : add('vs_butthead_game_over_dude', 75)),
  bnb.thoughtWeWereGonnaScore,
  add('bh_uh_hello_person_playing'),
  add('beavis_glad_its_finally_over', 75)
);
bnb.gameOverLose.excludeDelay = true;

bnb.gameOverWin = addSequence(
  bnb.heyBeavisIThinkWeJustScored,
  add('b_really_cool', 65),
  add('beavis_glad_its_finally_over', 65),
  add('dvd_and_in_closing_bravo', 85),
  add('butthead_we_have_a_winner', 85),
  add('beavis_we_did_it_we_got_em_all_score_naked_chicks', 40),
  // all except "b" work for the end of the game.
  oneOf(bnb.boioioing.filter((boing) => boing.options.url.indexOf('boing_b') === -1)),
  add('bh_that_was_stupid_beavis_but_it_was_pretty_cool_too'),
  add('beavis_i_scored', 75)
);
bnb.gameOverWin.excludeDelay = true;
bnb.gameOverWin.playImmediately = false;

bnb.beavisWhoElseWantsSome = add('b_whoa_yeah_who_else_wants_some_cmon_bunghole', 40);

bnb.bhPrettyCoolSometimesBeavis = addVL('bh_youre_pretty_cool_sometimes_b');

bnb.beavisThanks = shuffle([
  add('beavis_i_feel_pretty_good_right_about_now', 65),
  add('b_thanks_butthead', 50),
  add('b_sometimes_i_just_cant_help_myself', 40),
  addVL('b_cool_im_a_lot_smarter_than_i_thought'),
  addVL('b_academy_thank_you_drive_through_speech'),
  addVL('b_fryer'),
  addVL('b_now_thats_nice'),
  addVL('b_thank_you_my_name_is_beavis_good_night_drive_through'),
  bnb.beavisWhoElseWantsSome
]);
bnb.beavisThanks.maxDelay = 3000;

bnb.buttheadCompliment = shuffle([
  add('bh_laugh_do_that_again_b'),
  addSequence(
    bnb.bhPrettyCoolSometimesBeavis,
    bnb.beavisThanks
  ),
  addSequence(
    add('vs_butthead_youre_like_an_expert_marksmith_beavis', 40),
    bnb.beavisThanks
  ),
  add('bh_pretty_smart_b_thanks_bh_dumbass')
]);

bnb.buttheadIRule = shuffle([
  add('butthead_i_rule', 65),
  addVL('bh_it_doesnt_get_much_better_than_this'),
  add('butthead_i_win_again'),
  addVL('bh_yeah_im_cool'),
  addVL('bh_yes_i_rock_at_this_game')
]);

bnb.beavisGouranga = addSequence(
  addVL('b_die_die_die_vl'),
  bnb.buttheadCompliment
);

bnb.beavisCompliment = shuffle([
  addSequence(
    shuffle([
      add('beavis_damn_youre_smooth'),
      add('beavis_boy_youre_pretty_good'),
      add('b_youre_pretty_good_at_that')
    ]),
    bnb.buttheadIRule
  ),
  ...bnb.p2ComplimentsButthead
]);

bnb.buttheadGouranga = addSequence(
  bnb.buttheadWhoaCool,
  bnb.beavisCompliment
);

bnb.beavisYeahGo = Object.assign(
  shuffle([
    add('beavis_come_on', 85),
    add('beavis_yeah'),
    add('beavis_yeah_go_get_it'),
    add('beavis_yeah_yeah'),
    add('beavis_yeah_yeah_go_for_it')
  ]),
  { maxDelay: 1000 }
);

bnb.beavisYes = Object.assign(
  shuffle([
    add('beavis_yes_YES'),
    add('beavis_YES_2'),
    add('b_yes'),
    add('b_yes_a'),
    add('b_yes_b'),
    add('b_yes_c'),
    add('b_whoa'),
    add('beavis_whoa_laugh'),
    add('beavis_YES'),
    add('b_whoa_yesss_did_you_hear_that_butthead'),
    add('beavis_die_laugh'),
    bnb.bnbYes,
    addVL('b_thats_cool')
  ]),
  { maxDelay: 750 }
);

// insults
bnb.bungholeAndSimilar = shuffle([
  addVL('b_what_a_dumbass'),
  add('b_bunghole'),
  add('b_butthole'),
  add('b_buttmunch', 40),
  add('b_bunghole_heh', 30),
  add('b_bunghole_heh2', 30),
  add('beavis_damn_son_of_a_bitch'),
  add('beavis_do_not_make_my_bunghole_angry_tv'),
  add('bh_buttmunch'),
  add('bh_laugh_dumbass'),
  add('bunghole'),
  add('bunghole_question'),
  add('bunghole_x3'),
  add('cornholio_i_order_you_to_surrender_your_tp'),
  add('vs_beavis_bunghole')
]);

bnb.beavisFire = add('beavis_fire_fire_fire_fire');

bnb.explosionFire = {
  ...add('desert_explosion_fire', 100, undefined, undefined, { onplay: function(sound) { if (!sound.skipped) common.setVideo('desert_explosion'); } }),
  ...playImmediately
};

bnb.fire = add('beavis_fire', 100);

bnb.kickedAss = shuffle([
  add('bnb_nirvana_kicked_ass_ruled', 60),
  addVL('b_yeah_this_game_kicks_ass')
]);

bnb.iGotYouBabe = add('i_got_you_babe', 75);
bnb.iGotYouBabe.playCount = 0;
bnb.iGotYouBabe.playImmediately = true;
bnb.iGotYouBabe.excludeThrottling = true;

bnb.muchaMuchacha = {
  ...add('mucha_muchacha', 100),
  ...playImmediately,
  ...excludeThrottling
};

bnb.theme = {
  ...add('theme', 50),
  ...playImmediately,
  ...excludeThrottling
};

bnb.tryAndPayAttention = add('b_try_and_pay_attention_butthead2');

const tvArgs = [
  undefined,
  undefined,
  {
    onplay: function(sound) {
      if (!game.objects.radar.data.isJammed) return skipSound(sound);
      if (!sound.skipped && game.players.local.data.landed) common.setVideo('tv_noise');
    }
  }
];

bnb.radarJammedBeavis = shuffle([
  addSequence(
    add('beavis_what_happened_to_the_tv', 65, ...tvArgs),
    bnb.beavisOhYeah
  ),
  addSequence(
    add('beavis_whats_wrong_with_the_tv', 65, ...tvArgs),
    bnb.buttheadIDunno
  ),
  
  addVL('b_ahh_change_it_bh', ...tvArgs),
  addSequence(
    addVL('b_hey_butthead_you_didnt_put_one_of_those_chips_on_the_tv_that_blocks_the_cool_stuff', ...tvArgs),
    bnb.buttheadIDunno,
    bnb.dammitItsBroken
  ),
  addSequence(
    addVL('b_what_is_this_were_watching_bh_uhh_nothing'),
    addVL('bh_and_were_wasting_time_b_no_this_is_time_well_spent')
  )
]);
bnb.radarJammedBeavis.throttle = 120000;

bnb.radarJammedButthead = add('bh_ugh_i_cant_see');
bnb.radarJammedButthead.throttle = 120000;

bnb.beavisNeverScoredRetorts = shuffle([bnb.schlong, bnb.gonnaKickYourAss, bnb.youSuckButthead, bnb.iKnowShutUp, ...bnb.shutUpButthead].concat(bnb.beavisOhYeah));
bnb.beavisNeverScoredRetorts.delay = 1000;

bnb.neverScored = addSequence(
  add('butthead_you_never_scored_never_will_score', 66),
  shuffle([
    ...bnb.beavisNeverScoredRetorts,
    ...bnb.beavisRetorts
  ])
);
bnb.neverScored.excludeDelay = true;

bnb.beavisWhoaButtheadCheckItOut = add('beavis_whoa_butthead_check_it_out');

bnb.beavisICantSeeAnything = shuffle([
  add('beavis_i_cant_see_anything'),
  add('b_ahh_im_blind')
]);
bnb.beavisICantSeeAnything.throttle = 10000;

bnb.beavisComeOn = add('beavis_come_on', 85);

bnb.beavisPeekaboo = add('beavis_peekaboo');
// note: played via playSoundWithDelay(), so it's important to be snappy.
bnb.beavisPeekaboo.maxDelay = 250;

// "add game menu sequence" - only play subsequent sound(s) before game start, and while the menu is still up.
function addGMS(...params) {
  // decorate each sequence object with a particular "play next" check.
  return Object.assign(addSequence(...params), { playNextCondition: () => !game.data.started });
}

function addIGMS(...params) {
  // in-game menu sequence
  return Object.assign(addSequence(...params), { playNextCondition: () => !net.connected && (!game.data.started || game.data.paused) });
}

bnb.menuOpenV1 = addIGMS(
  add('b_um_heh_whats_that'),
  add('bh_its_like_a_menu_or_something'),
  add('b_menu_nachos_chicks_boobs_beer')
);
bnb.menuOpenV1.playImmediately = true;
bnb.menuOpenV1.excludeShuffle = true;

bnb.menuOpenV2 = addIGMS(
  add('beavis_hey_butthead_whats_that'),
  add('bh_its_like_a_menu_or_something'),
  add('beavis_stupid_read_too_much')
);
bnb.menuOpenV2.playImmediately = true;
bnb.menuOpenV2.excludeShuffle = true;

bnb.menuOpenV3 = addIGMS(
  bnb.beavisWhoaButtheadCheckItOut,
  add('bh_its_like_a_menu_or_something'),
  bnb.beavisOhYeah
);
bnb.menuOpenV3.playImmediately = true;
bnb.menuOpenV3.excludeShuffle = true;

bnb.coolerThanIThought = addVL('b_oh_yeah_this_game_is_gonna_be_cooler_than_i_thought');

bnb.gameMenu = shuffle([
  addGMS(
    add('beavis_whats_this_butthead_something_cool'),
    bnb.coolerThanIThought
  ),
  addGMS(
    add('b_what_the_hell_is_this_crap', 40),
    addVL('bh_worst_crap_ever'),
  ),
  addVL('beavis_whoa_look_a_human_butt'),
  add('b_here_we_go_again_this_sucks_mockery', 40),
  addGMS(
    addVL('bh_i_think_were_in_for_something_special')
  ),
  addGMS(
    add('b_what_the_hell_is_this_crap', 40),
    add('bh_its_like_a_menu_or_something', 60),
    add('beavis_stupid_read_too_much')
  ),
  addGMS(
    bnb.buttheadCoolestThingEver,
    addVL('b_yeah_yeah_this_is_cool_seen_before_it_rules')
  ),
  addVL('b_yeah_this_game_kicks_ass'),
  add('b_lets_get_ready_to_rumble')
]);
bnb.gameMenu.excludeThrottling = true;

bnb.gameMenuHard = utils.array.shuffle([
  bnb.boioioing,
  add('vs_beavis_whoa_thats_hard'),
  addVL('bh_hard_laugh'),
  addVL('bh_i_think_this_game_is_too_hard_for_p2_hard'),
  addGMS(
    add('beavis_dammit_they_make_this_too_hard'),
    addVL('bh_uh_does_that_remind_you_of_anything_beavis'),
    addVL('bh_hard_laugh'),
    bnb.lotsOfLaughs
  ),
  addVL('bh_boioioing_b_you_cant_really_do_that_butthead')
]);
bnb.gameMenuHard.excludeDelay = true;
bnb.gameMenuHard.excludeThrottling = true;

bnb.helicopterDiedReactions = shuffle([
  add('beavis_fire_fire_fire_fire'),
  addVL('b_die_die_die_vl'),
  ...bnb.beavisYes,
  ...bnb.buttheadWhoaCool,
  ...bnb.bungholeAndSimilar,
  ...bnb.kickedAss
]);
bnb.helicopterDiedReactions.maxDelay = 3000;

function initBNBSound() {
  
  bnb.bunkerExplosion = [bnb.explosionFire].concat(shuffle([bnb.fire, bnb.kickedAss, bnb.beavisFire, { ...bnb.buttheadCoolestThingEver, delay: 5000 }]));
  bnb.bunkerExplosion.maxDelay = 1000;

  bnb.beavisTurn = shuffle([bnb.beavisGonnaBeCool, bnb.howToTurnOn, bnb.rumble, bnb.poopQuestion, bnb.iHateThisStupidGame, bnb.beavisHereWeGo].concat(bnb.beavisMonologues));
  bnb.beavisTurn.excludeDelay = true;

  bnb.buttheadTurn = shuffle([bnb.buttheadGonnaBeCool, bnb.buttheadLetsFinishThis, bnb.buttheadOKGetReadyDude, bnb.comeToButthead].concat(bnb.buttheadMonologues));
  bnb.buttheadTurn.excludeDelay = true;

  // player + CPU helicopters crashed
  addBnBEvent(EVENTS.helicopterCollision, [
    'beavis_damn_son_of_a_bitch',
    'beavis_dammit',
    'beavis_hey_hey_no_ahh',
    'beavis_i_hate_this_stupid_game',
    'beavis_losers',
    'beavis_quit_screwing_around',
    'beavis_rarr_stop',
    'beavis_whatd_you_do_that_for',
    'beavis_wth_are_you_doing_fartknocker',
    'butthead_cool',
    'butthead_hey_slow_down',
    'butthead_i_meant_to_do_that',
    'butthead_quit_screwing_around',
    'butthead_that_sucked',
    'butthead_that_was_cool',
    'butthead_this_is_starting_to_piss_me_off',
    'butthead_this_sucks',
    'butthead_uh_okay',
    'butthead_uhh_wait_a_minute',
    'butthead_uh_what_are_you_doing',
    'butthead_whoa',
    'butthead_you_dork',
    'butthead_you_dumbass',
    'bh_uh_hello_person_playing'
  ]);
  bnb[EVENTS.helicopterCollision].maxDelay = 5000;

  bnb[EVENTS.boring] = shuffle(
    addSequence(
      addVL('bh_this_is_boring_b_yeah_really'),
      () => Math.random() >= 0.5 && addVL('bh_boring_before_cool')
    ),
    () => game.data.isBeavis ? bnb.beavisIdle : bnb.buttheadIdle
  );

  return bnb;

}

export {
  initBNBSound,
  playSequence,
  playQueuedBNBSounds,
  queueBNBSound,
  resetBNBSoundQueue,
  soundsToPlayBNB
};