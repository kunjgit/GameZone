import { TYPES } from '../core/global.js';
import { game } from '../core/Game.js';
import { gameEvents, EVENTS } from '../core/GameEvents.js';
import { common } from '../core/common.js';
import { gamePrefs } from './preferences.js';
import { net } from '../core/network.js';

const UNKNOWN_VERB = 'UNKNOWN_VERB';

function Stats() {

  let data, exports;

  // tracking for "GOURANGA!"
  const youKilledTypes = {
    [TYPES.missileLauncher]: true,
    [TYPES.tank]: true,
    [TYPES.van]: true,
    [TYPES.infantry]: true,
    [TYPES.engineer]: true,
    // extra types which don't have a cost, but do have "value"
    [TYPES.balloon]: true,
    [TYPES.bunker]: true,
    [TYPES.helicopter]: true,
    [TYPES.turret]: true,
    [TYPES.smartMissile]: true
  };

  function statsStructure() {
    return {
      bullet: 0,
      balloon: 0,
      bunker: 0,
      'missile-launcher': 0,
      gunfire: 0,
      tank: 0,
      van: 0,
      infantry: 0,
      engineer: 0,
      helicopter: 0,
      'smart-missile': 0,
      bomb: 0,
      shrapnel: 0,
      turret: 0
    };
  }
  
  function normalizeObj(obj) {
    if (obj && !obj.data && obj.oParent) {
      obj = obj.oParent;
    }
    return obj;
  }

  function normalizeType(obj) {
    let type = obj.data.type;
    // special case: infantry -> engineer
    if (obj.data.type === TYPES.infantry && obj.data.role) {
      type = TYPES.engineer;
    }
    return type;
  }

  function create(obj) {
    let dataObj, type;
    obj = normalizeObj(obj);
    type = normalizeType(obj);
    dataObj = data[obj.data.isEnemy ? 'enemy' : 'player'].created;
    if (dataObj[type] !== undefined) {
      dataObj[type]++;
    }
  }

  function destroy(obj, options) {
    // there might be no data, so go up the chain.

    let dataObj, type;

    // most objects have oParent, except vans which are "hidden" from radar.
    obj = normalizeObj(obj.oParent || obj);

    type = normalizeType(obj);

    // notify when something was destroyed, if not a "silent" death
    if (!(options?.silent)) maybeNotify(type, obj);

    // note when player destroys MTVIE
    if (obj.data.isEnemy && obj?.data?.attacker?.data?.parentType === TYPES.helicopter && youKilledTypes[type]) {
      gameEvents.fire(EVENTS.youKilledSomething, 'type', type);
    }

    // increment the relevant stat
    dataObj = data[obj.data.isEnemy ? 'enemy' : 'player'].destroyed;

    if (dataObj[type] !== undefined) {
      dataObj[type]++;
    }

  }

  /**
   * by type, behaviours for notifications when units are destroyed including
   * icon type (death vs. explosion) and language / notification options
   */
   const notifyTypes = {
    'chain': {
      verb: 'flew into'
    },
    // special case: missile launchers can destroy things, or be destroyed by an infantry or tank.
    // they typically die with silent: true, when self-destructing in order to launch a missile.
    'missile-launcher': true,
    tank: {
      verb: 'blasted',
      verb_engineer: 'steamrolled',
      verb_infantry: 'steamrolled',
      // hackish: ignore when a tank "hits" a smart missile
      'verb_smart-missile': UNKNOWN_VERB
    },
    van: true,
    infantry: {
      showSkull: true,
      isAn: true
    },
    'parachute-infantry': {
      showSkull: true
    },
    engineer: {
      showSkull: true,
      isAn: true
    },
    balloon: true,
    bunker: {
      exclude: true
    },
    helicopter: {
      showSkull: true,
      verb: 'crashed into',
      'verb_smart-missile': 'hit'
    },
    bomb: {
      exclude: true,
      verb: 'bombed',
      verb_infantry: 'nuked',
      verb_engineer: 'annihilated'
    },
    gunfire: {
      exclude: true,
      verb: 'shot',
      verb_balloon: 'popped',
      verb_bunker: 'blew out',
      verb_helicopter: 'toasted',
      verb_infantry: 'killed',
      verb_engineer: 'killed',
      'verb_smart-missile': 'shot down',
      verb_tank: 'took out'
    },
    shrapnel: {
      exclude: true,
      verb: 'killed',
      verb_balloon: 'popped'
    },
    'smart-missile': {
      // special case: smart missiles are the "attacker" only when hostile.
      hostilePrefix: 'a hostile ',
      // exclude: true,
      verb: 'smoked',
      verb_bunker: 'destroyed',
      verb_infantry: 'killed',
      verb_engineer: 'killed',
      'verb_smart-missile': 'took out'
    },
    'super-bunker': {
      exclude: true
    }
  }

  function formatForDisplay(type, item) {

      // hackish: fixes for display to user
      type = type.replace('missileLauncher', 'missile launcher');
      type = type.replace('smartMissile', 'smart missile');

      // e.g., parachute-infantry
      type = type.replace('-', ' ');

      // special missile check: handle variant types, too. ;)
      if (item.data.type === TYPES.smartMissile) {
        if (item.data.isBanana) {
          type = type.replace('smart missile', '🍌');
        } else if (item.data.isRubberChicken) {
          type = type.replace('smart missile', '🐓');
        }
      }

      return type;

  }

  function getNormalizedUnitName(item) {

    if (!item || !item.data) return;

    // special case: shrapnel and other hostile items can be "from" a helicopter, but ignore the parent type - we want shrapnel.
    if (item.data.hostile) return formatForDisplay(item.data.type, item);
    
    // some objects have `parentType`, e.g., gunfire fired from a tank. by default, we check for that.
    // then, account for infantry which are actually engineers.
    let type = item.data.type;
    
    // special case: if we have a smart missile, don't go up the chain to the missile launcher.
    // otherwise, check the parent and then handle the infantry/engineer case.
    if (type !== TYPES.smartMissile) {
      type = item.data.parentType || normalizeType(item);
    }

    return formatForDisplay(type, item);

  }

  function getHelicopterLabel(helicopter) {

    if (!helicopter?.data) return;

    const { data } = helicopter;

    const localIsEnemy = game.players.local.data.isEnemy;

    if (net.active && data.isRemote && !data.isCPU) {

      let name = gamePrefs.net_remote_player_name;

      // ignore if the default
      if (name === 'guest' || name === 'host') {
        return data.isEnemy === localIsEnemy ? 'your friend' : 'your opponent';
      }

      // e.g., 'The Old Tanker'
      return gamePrefs.net_remote_player_name;

    }

    if (data.isEnemy === game.players.local.data.isEnemy) {
      return `a friendly helicopter`;
    } else {
      if (!net.active) return `the enemy helicopter`;
      // generic
      return `an enemy ${helicopter}`
    }

  }

  function getNormalizedAttackerString(attacker) {

    // common string building: "somebody did something."

    const normalizedType = getNormalizedUnitName(attacker);

    const aData = attacker.data;
    
    // this shouldn't happen.
    if (!normalizedType || !aData) return 'an unknown unit';

    // special case: return hostile objects (shrapnel, expired missiles) as-is.
    if (aData.hostile) return (notifyTypes[aData.type]?.hostilePrefix || '') + normalizedType;

    // treat helicopters as the actor for gunfire, and bombs (e.g., "you bombed a tank") - but not smart missiles, nor shrapnel - e.g., when you died.
    const isHelicopter = (aData?.parentType === TYPES.helicopter || aData.type === TYPES.helicopter) && aData.type !== TYPES.shrapnel && aData.type !== TYPES.smartMissile;

    // build out string, based on enemy/non-enemy and local player.

    // local player, vs. a different helicopter.
    const isYou = aData.id === game.players.local.data.id;

    if (isYou) return 'you';

    // some other helicopter? friend or foe, with or without a name etc.
    if (isHelicopter) {
      return getHelicopterLabel(attacker);
    }

    // enemy case, e.g., "an enemy tank"
    if (aData.isEnemy !== game.players.local.data.isEnemy) return `an enemy ${normalizedType}`;

    // everything else: "your infantry"
    return `your ${normalizedType}`;

  }

  function maybeNotify(type, target) {

    // notify when a game object is being destroyed, given a target died (subject to the type.)
    // e.g., target is a tank object, and its `data.attacker` is the unit or munition which took out the target.
    if (!type || !target) return;

    return common.setFrameTimeout(() => maybeNotifyRAF(type, target), 16);

  }

  function maybeNotifyRAF(type, target) {

    // notify when a game object is being destroyed, given a target died (subject to the type.)
    // e.g., target is a tank object, and its `data.attacker` is the unit or munition which took out the target.
    if (!type || !target) return;

    const notifyItem = notifyTypes[type];

    // lots of types, e.g., gunfire and bombs, can be ignored when they die.
    if (!notifyItem || notifyItem.exclude) return;

    // special case: parachute infantry hit the ground, the parachute didn't open in time.
    if (target.data.didHitGround) {
      game.objects.notifications.add(`${target.data.isEnemy !== game.players.local.data.isEnemy? 'An enemy' : 'Your'} infantry’s parachute failed to open. ☠️`);
      return;
    }

    // the object responsible for killing the target
    const attacker = target.data?.attacker?.data;

    // this should not be common, save for a few units - e.g., a missile launcher that is self-destructing.
    if (!attacker) return;

    // certain targets can be ignored, too. i.e., bunkers don't kill missiles.
    if (notifyTypes[attacker.type]?.exclude) return;

    // did a helicopter die?
    const isHelicopter = (type === TYPES.helicopter);

    // action word based on attacker type; e.g., gunfire = "shot", bomb = "bombed" etc.
    // allow for object-specific interactions also, e.g., gunfire hitting a balloon -> `gunfire = { balloon_verb: 'popped' }`
    const attackerItem = notifyTypes[attacker.type] || {};

    const verb = attackerItem[`verb_${type}`] || attackerItem.verb || UNKNOWN_VERB;

    if (verb === UNKNOWN_VERB) {
      console.warn(`${UNKNOWN_VERB} for type / target`, type, target);
      return;
    }

    // special case: handle when types match, e.g., "their infantry shot one of yours"
    // the attacker may be the gunfire of a tank, so check the parent as well.
    // smart missiles can launch from either helicopters or missile launchers, so don't presume they're the same.
    let isSameType;

    // check the parent, if it's gunfire.
    // e.g., player helicopter's gunfire hitting the CPU helicopter.
    if (attacker.type === TYPES.gunfire) {

      isSameType = (attacker.parentType === type);

    } else {

      // perhaps two missiles, etc., took each other out.
      isSameType = (attacker.type === type);

      // check for helicopter collision - with other helicopter, or a building or ground unit.
      if (isHelicopter) {

        // extra-special case: player + CPU helicopters collided.
        if (attacker.type === TYPES.helicopter) {
          game.objects.notifications.add('You collided with the enemy. ☠️☠️');
          return;
        }

        // helicopter hit something that was not another helicopter.
        // if the helicopter collided with a non-munition - i.e., ground unit or building - bail.
        // this avoids a duplicate notification, e.g., "a balloon hit a helicopter."
        if (attacker.type !== TYPES.smartMissile && attacker.type !== TYPES.bomb && attacker.type !== TYPES.chain) return;

      }

    }

    // special case: "your opponent hit a smart missile", just ignore.
    // the reverse is covered, e.g., "you were smoked by an enemy smart missile."
    if (target.data.type === TYPES.smartMissile && attacker.type === TYPES.helicopter) return;
    
    // if (e.g.) two tanks fought, determine who won. "your" or "their" (attacking) tank "took out one of theirs / yours."
    let didYoursWin = isSameType && !attacker.isEnemy;

    let text;
    let youWonText = 'one of theirs';
    let theyWonText = 'one of yours';

    // special case: when player's helicopter dies, use special verbiage. "You (were) X by a Y"
    if (!isSameType && isHelicopter && target.data.id === game.players.local.data.id) {

      // hacks
      if (attacker.type === TYPES.chain) {
        text = `You ${verb} ${getNormalizedAttackerString(target.data.attacker)} ${notifyItem.showSkull ? '☠️' : '💥'}`
      } else {
        text = `You were ${verb} by ${getNormalizedAttackerString(target.data.attacker)} ${notifyItem.showSkull ? '☠️' : '💥'}`;
      }

    } else if (isHelicopter) {

      // one helicopter shot down the other.
      youWonText = 'the enemy helicopter';
      theyWonText = 'you';
    }

    // if not already set via special case, assign now.

    if (!text) {

      // "something" [shot/bombed/killed] [one of yours|an|a] "something", including same-type and hostile-killed-[enemy|friendly] cases
      text = `${getNormalizedAttackerString(target.data.attacker)} ${verb} ${isSameType ? (didYoursWin ? youWonText : theyWonText) : (attacker.hostile ? (target.data.isEnemy ? 'an enemy ' : 'a friendly ') : (notifyItem.isAn ? 'an ' : 'a ')) + getNormalizedUnitName(target)} ${notifyItem.showSkull ? '☠️' : '💥'}`;

      // hackish: replace helicopter reference
      // TODO: fix this up so the enemy chopper is properly normalized.
      text = text.replace('a helicopter', 'the enemy helicopter');

      // hackish
      if (gamePrefs.bnb) {
        text = text.replace('your turret', (Math.random() >= 0.5 ? 'THE GREAT CORNHOLIO' : 'THE ALMIGHTY BUNGHOLE'));
      }

    }

    text = common.tweakEmojiSpacing(text);

    // don't show if on-screen, *unless* it's the helicopter.
    // TODO: improve target vs. attacker helicopter logic, work onScreen check into notification preferences.
    if (target.data.isOnScreen && (!isHelicopter && attacker.type !== TYPES.helicopter)) return;

    // "go go go", capitalizing the first letter.
    game.objects.notifications.add(text.charAt(0).toUpperCase() + text.slice(1));

  }

  function markEnd() {
    data.time.end = new Date();
  }

  function displayEndGameStats() {

    console.log('TODO: fix endgame stats. 😅');
    return;

    /*
    let i, j, k, items, cols, type, offset, dataSource;
    items = document.getElementById('stats-endgame').getElementsByTagName('tr');
    // data sources
    dataSource = [data.player.destroyed, data.enemy.destroyed];
    offset = 1;
    for (i = 0, j = items.length; i < j; i++) {
      type = items[i].getAttribute('data-type');
      if (type) {
        cols = items[i].getElementsByTagName('td');
        for (k = 0; k < 2; k++) {
          if (cols[k + offset]) {
            cols[k + offset].childNodes[0].textContent = dataSource[k][type];
          }
        }
      }
    }
    document.getElementById('stats-endgame').style.display = 'block';
    */

  }

  data = {
    time: {
      start: new Date(),
      end: null
    },
    player: {
      created: statsStructure(),
      destroyed: statsStructure()
    },
    enemy: {
      created: statsStructure(),
      destroyed: statsStructure()
    }
  };

  exports = {
    data,
    create,
    destroy,
    formatForDisplay,
    markEnd,
    displayEndGameStats
  };

  return exports;

}

export { Stats };