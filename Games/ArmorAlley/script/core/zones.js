import { game } from './Game.js';
import { TYPES, worldWidth } from './global.js';

// split the world (8192 pixels) into an even number of slices, AKA "zones"
const ZONE_COUNT = 64;
const ZONE_WIDTH = worldWidth / ZONE_COUNT;

const objectsByZone = [];

const zoneDebugging = window.location.toString().match(/zone/i);

const useLookAheadTypes = {
  'tank': true,
  'infantry': true,
  'engineer': true
};

function init() {

  for (let i = 0; i <= ZONE_COUNT; i++) {
    objectsByZone[i] = {
      all: {},
      enemy: {},
      friendly: {}
    };
  }

  if (zoneDebugging) {
    window.objectsByZone = objectsByZone;
    window.gameObjectsById = game.objectsById;
  }

  return objectsByZone;

}

function initDebug() {

  if (!zoneDebugging) return;

  const zoneWidth = worldWidth / ZONE_COUNT;

  let zoneItem;
  for (let i = 0; i < ZONE_COUNT; i++) {
    zoneItem = game.addItem('zone-post', zoneWidth * i);
    refreshZone(zoneItem);
  }
  
}

function calcZone(obj) {

  // guard / this shouldn't happen
  if (obj?.data?.x === undefined) return;

  // front edge of e.g., a tank
  let front, rear;

  /**
   * 
   * Take look-ahead into account for certain types, where some objects
   * interact with a turret that's right near the edge of a zone.
   * 
   * This means the object enters the zone on its front edge a bit earlier,
   * where it will pick up on things right at the edge of the zone that it
   * previously may have missed.
   * 
   * It may be safest to work look-ahead in for all objects, but TBD.
   * 
   */
  let xLookAhead = 0;

  // special-case a few
  if (useLookAheadTypes[obj.data.type] && obj.data.xLookAhead) {
    if (Math.min(16, obj.data.xLookAhead || obj.data.widthOneThird) !== xLookAhead) {
      if (!obj.data.xLookAheadForZones) {
        obj.data.xLookAheadForZones = Math.min(16, obj.data.xLookAhead || obj.data.widthOneThird);
      }
    }
    xLookAhead = obj.data.xLookAheadForZones;
    if (obj.data.isEnemy) xLookAhead *= -1;
  }

  if (obj.data.isEnemy) {
    front = obj.data.x - xLookAhead;
    rear = obj.data.x + (obj.data.width || 0);
  } else {
    front = obj.data.x + (obj.data.width || 0) + xLookAhead;
    rear = obj.data.x;
  }

  // determine zone, preventing "overflow"

  let frontZone = Math.floor(front / ZONE_WIDTH);
  let rearZone = Math.floor(rear / ZONE_WIDTH);

  /**
   * Nit: the following is hopefully more performant vs. Math.max(0, Math.min(...)) twice every time,
   * as objects will only hit "overflow" zones when being ordered or recycled at the enemy base.
   */
  
  if (frontZone < 0) {
    frontZone = 0;
  } else if (frontZone > ZONE_COUNT) {
    frontZone = ZONE_COUNT;
  }

  if (rearZone < 0) {
    rearZone = 0;
  } else if (rearZone > ZONE_COUNT) {
    rearZone = ZONE_COUNT;
  }

  return [frontZone, rearZone];

}

function enterZone(zone, obj, group = 'all') {

  // Guard. #zones (debug signposts) will hit this case.
  if (!obj?.data?.id || obj.data.type == 'zone-post') return;

  if (!game.objectsById[obj.data.id]) {
    /**
     * Timing issue / bug: Some elements move immediately when created, and that causes a zone update.
     * They should have been initialized by now - but if not in `objectsById[]`, do so and complain.
     */
    console.warn(`enterZone(${zone}): objectsById[] entry not yet defined; adding`, obj.data.id);
    game.objectsById[obj.data.id] = obj;
  }

  // *** 3NtEr tH3 z0n3! ***

  // this fires a lot, and could probably be reduced.
  if (objectsByZone[zone][group][obj.data.type]?.[obj.data.id]) return;

  // lazy-create group {} objects, e.g., first friendly tank in zone 5
  if (!objectsByZone[zone][group][obj.data.type]) {
    objectsByZone[zone][group][obj.data.type] = {};
  }

  // add this to its respective object collection, e.g., tanks in zone 5 by ID
  objectsByZone[zone][group][obj.data.type][obj.data.id] = game.objectsById[obj.data.id];

  if (group === 'all') {

    /**
     * Hackish: if adding to all, also add to enemy / friendly groups.
     * "Hostile" always go in both, because they need to be able to hit both human and CPU.
     * Human player looks at the enemy array group for units to collide with, whereas enemy looks at "friendly."
     * This introduces some level of ambiguity, but it's based on legacy naming and could be improved.
     */

    enterZone(zone, obj, obj.data.isEnemy || obj.data.hostile ? 'enemy' : 'friendly');

  }

  // special case: hostile objects are dangerous to all sides.
  // always add hostile objects to the friendly group.
  if (obj.data.hostile) {
    enterZone(zone, obj, 'friendly');
  }

}

function leaveZone(zone, obj, group = 'all') {

  // guard
  if (zone === null || zone === undefined) return;

  // This may happen after an ownership change, i.e., a balloon or a super-bunker becomes hostile.
  if (!objectsByZone[zone][group][obj.data.type]) {
    console.warn('leaveZone: WTF no objects by zone for type?', zone, group, obj.data.type, obj.data.id, Object.keys(objectsByZone[zone][group]), objectsByZone[zone][group]);
    return;
  }

  if (!objectsByZone[zone][group][obj.data.type][obj.data.id]) {
    console.warn('leaveZone(): WTF, already left?', zone, obj.data.id);
    return;
  }

  // drop the entry.
  objectsByZone[zone][group][obj.data.type][obj.data.id] = null;
  delete objectsByZone[zone][group][obj.data.type][obj.data.id];

  // e.g., last friendly tank to leave zone 5: delete this object altogether.
  if (!Object.values(objectsByZone[zone][group][obj.data.type]).length) {
    delete objectsByZone[zone][group][obj.data.type];
  }

  if (group === 'all') {
    // hackish: "and one more time, in French." Remove the enemy/friendly one, too.
    leaveZone(zone, obj, obj.data.isEnemy || obj.data.hostile ? 'enemy' : 'friendly');
    if (obj.data.hostile) leaveZone(zone, obj, 'friendly');
  }
  
}

function leaveAllZones(obj) {

  // given an object, ensure we leave all the places it was.
  if (!obj?.data) {
    console.warn('leaveAllZones(): WTF no obj?', obj);
    return;
  }

  leaveZone(obj.data.frontZone, obj);

  if (obj.data.rearZone !== obj.data.frontZone) {
    leaveZone(obj.data.rearZone, obj);
  }

  obj.data.frontZone = null;
  obj.data.rearZone = null;
  obj.data.multiZone = false;
  
}

function applyZone(obj, zones) {

  if (!obj?.data) return;

  obj.data.zones = zones;

  // something changed.

  if (obj.data.frontZone !== zones[0]) {

    // register the new one.
    enterZone(zones[0], obj);

    /**
     * Example: tank crossing zone boundaries.
     * Leave current assigned front zone if rear is not in the same.
     */
    if (obj.data.rearZone !== obj.data.frontZone && obj.data.frontZone >= 0) {

      // both front and rear zones have updated, old front can be left. 
      leaveZone(obj.data.frontZone, obj);

    }

    // update zone
    obj.data.frontZone = zones[0];

  }

  if (obj.data.rearZone !== zones[1]) {

    /**
     * Leave current rear zone, and assume we're already in the new one -
     * unless a helicopter is flying backwards, and then we keep it.
     * Assuming orientation is a mistake.
     */
    if (obj.data.rearZone !== undefined && obj.data.rearZone !== obj.data.frontZone) {
      leaveZone(obj.data.rearZone, obj);
    }

    /**
     * This object may have been created between two zones.
     * Regardless, ensure we occupy the new rear one.
     */
    if (obj.data.frontZone !== zones[1]) {
      enterZone(zones[1], obj);
    }

    // update zone
    obj.data.rearZone = zones[1];
    
  }

  // are we multi-zone, "straddling" two?
  obj.data.multiZone = (obj.data.frontZone !== obj.data.rearZone);

  if (obj.data.isOnScreen) {
    debugZone(obj);
  }

}

function changeOwnership(obj) {

  /**
   * Handle e.g., a bunker, super-bunker or turret being claimed; move the object
   * between respective objectsByZone arrays (collision) by changing its group.
   * This is for the case of switching between isEnemy, and/or hostile.
   */

  if (!obj.data) return;

  // skip if zones haven't been applied (yet)
  if (obj.data.frontZone === null) return;

  if (obj.data.isEnemy || obj.data.hostile) {
    // friendly -> enemy / hostile
    // if hostile, enter and/or stay in the friendly group because it's dangerous to all sides.
    if (obj.data.hostile) {
      enterFrontAndRear(obj, 'friendly');
    } else {
      leaveFrontAndRear(obj, 'friendly');
    }
    enterFrontAndRear(obj, 'enemy');
  } else {
    // enemy / hostile -> friendly
    leaveFrontAndRear(obj, 'enemy');
    enterFrontAndRear(obj, 'friendly');
  }

  // turrets and super-bunkers can be claimed, and need to update their targets.
  obj.refreshCollisionItems?.();
  obj.refreshNearbyItems?.();

}

function leaveFrontAndRear(obj, group) {

  if (!obj.data) return;

  if (obj.data.rearZone !== null) leaveZone(obj.data.rearZone, obj, group);
  if (obj.data.frontZone !== obj.data.rearZone) leaveZone(obj.data.frontZone, obj, group);

}

function enterFrontAndRear(obj, group) {

  if (!obj.data) return;

  if (obj.data.rearZone !== null) enterZone(obj.data.rearZone, obj, group);
  if (obj.data.frontZone !== obj.data.rearZone) enterZone(obj.data.frontZone, obj, group);

}

function debugZone(obj) {

  if (!zoneDebugging) return;

  // null if "not yet set", undefined if "doesn't apply to this object ever."
  if (obj.data.frontZone === null || obj.data.frontZone === undefined) return;

  // zone debugging
  if (obj?.dom?.o && !obj.dom.oDebug) {
    obj.dom.oDebug = document.createElement('div');
    obj.dom.oDebug.className = 'zone-flag';
    obj.dom.o.appendChild(obj.dom.oDebug);
  }

  if (obj.dom?.oDebug) {
    const { zones } = obj.data;
    const id = obj.data.guid ? obj.data.guid.split('_')[1] + '&nbsp;' : '';
    // L->R ordering for multi-zone. if enemy, show "front" side first, then rear. friendly shows rear first, then front.
    const mzString = obj.data.isEnemy ? `${zones[0]}/${zones[1]}` : `${zones[1]}/${zones[0]}`;
    const zz = id && obj.data.multiZone ? mzString : zones[0];
    obj.dom.oDebug.innerHTML = id ? `${id}<sup>${zz}</sup>` : zones[0];
  }

}

const ignoreZoneTypes = {
  [TYPES.cornholio]: true,
  [TYPES.star]: true
};

function refreshZone(obj) {

  if (!obj?.data) return;

  // inert gunfire particles can be ignored.
  if (obj.data.isInert) return;

  // we may be able to ignore this altogether, e.g., cornholio objects aren't tracked.
  // if (obj.data.frontZone === null && !objectsByZone[0][obj.data.type]) return;

  if (ignoreZoneTypes[obj.data.type]) return;

  const zones = calcZone(obj); // [front, rear]

  // something has changed.
  if (obj.data.frontZone !== zones[0] || obj.data.rearZone !== zones[1]) {
    applyZone(obj, zones);
  }

}

const zones = {
  changeOwnership,
  debugZone,
  init,
  initDebug,
  leaveAllZones,
  refreshZone,
  objectsByZone,
  ZONE_WIDTH
};

export { zones };