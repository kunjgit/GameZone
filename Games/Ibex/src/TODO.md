Game Goal
===
- Protect & escort some wild animals into a safe place.
- end of the world from left to right. rush to the right. infinite exploration.
- Sleeping ibex in the map! go to wake & rescue them! (population increase, reason to go down)


TODO release
===

- screenshot of the game + help in the image?
- miniature image of the game (with the logo)

DONE - score += 500 on rescue
- play again at gameover screen
DONE - display number of saved animals at gameover screen
DONE - dead animal display differently on the map
DONE - faster in forest
DONE - Water more powerful against volcano & fire. water does not enough remove fire.
DONE - water create too much forest
DONE - water should propagate more with rain
DONE - more lighting? more lighter than darker.
DONE - more precise keyboard "pixel per pixel".

not doing
---
- Start Bottom Left & Air destructible? + Sleeping ibex at the beginning
- polish the move to right behavior (too much move to left)
- too much volcano at 10'000
- ??? have a game ending (at x=10000), safe place?
  - try to reach the best score. Fact is you can be unbeatable if you play on top and just progress to the right...

- try{}catch{} on localstorage access (some block the cookies extension break the game)
- the audio seems to leak a lot of string allocation?
  - because of the data64 wav
  - player.src = src can be unefficient??
  - should I have a pull of audio?
  - audio.cloneNode(true) ???

TODO
===
- Fix hell trigger position
- Polish game progressive difficulty: volcano propagation increase? hell zone speed increase?

- Polish: More variety in the design & events
  - season / weather? (rain, thunder)
  - day & night (different styles, illumination?)
  - general after effect (subtle lighting gradient from the middle)
  - More variety in generated terrains? (lot of air / lot of earth / a bit more forest)
    - To create more diversity: add a difference between "Forest" and "Mushroom": forest grows with water, mushroom grows by itself. if mushroom+water or mushrrom+forest -> become forest (forest spread in mushroom)

- Polish: Make sure animals are safe at spawn
- MOBILE support???
- when left disappear make it blurred?

Done
---

DONE - mouse wheel to change elements
DONE - Audio !
DONE - Bugfix: implement proper collision detection.
DONE - Polish: improve animals decisions: avoid suicidal decisions.
DONE - Map gen variety:
DONE  - if so, better move to glsl generating?
DONE  - forest areas!!!
DONE  - rarely have water source in caves?
DONE  - rarely have volcanos?
DONE - Polish: animal graphics?
DONE - keep score in local storage
DONE - polish gameplay: a central cursor & you switch between mode which make the elements UI slide
DONE - miniature map (top-left) to visualize where the ibex are & the goal in the map
DONE - bigger ibex count
DONE - Bugfix: resync before re-generating world

Improve performance of map generation
---
Should run in glsl ?

How to make the game more challenging
---
- cooldown?
- limited actions?

General Performance & bugfix
---

v0
- Load: (program) 6500ms
- GPU: 257 Mo, 9.0 - 9.5 %

