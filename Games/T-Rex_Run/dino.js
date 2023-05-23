/**
 * This module contains functions for setting up and updating the dinosaur character in the game.
 * @module Dino
 */
import {
    incrementCustomProperty,
    setCustomProperty,
    getCustomProperty,
  } from "./updateCustomProperty.js"
  
  const dinoElem = document.querySelector("[data-dino]")
  const JUMP_SPEED = 0.4
  const GRAVITY = 0.0015
  const DINO_FRAME_COUNT = 2
  const FRAME_TIME = 100
  
  let isJumping
  let dinoFrame
  let currentFrameTime
  let yVelocity
  export function setupDino() {
    isJumping = false
    dinoFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(dinoElem, "--bottom", 0)
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
  }
  
  export function updateDino(delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)
  }
  
  export function getDinoRect() {
    return dinoElem.getBoundingClientRect()
  }
  
  export function setDinoLose() {
    dinoElem.src = "dino-lose.png"
  }
  
  function handleRun(delta, speedScale) {
    if (isJumping) {
      dinoElem.src = `dino-stationary.png`
      return
    }
  
    if (currentFrameTime >= FRAME_TIME) {
      dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
      dinoElem.src = `dino-run-${dinoFrame}.png`
      currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += delta * speedScale
  }
  
  function handleJump(delta) {
    if (!isJumping) return
  
    incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)
  
    if (getCustomProperty(dinoElem, "--bottom") <= 0) {
      setCustomProperty(dinoElem, "--bottom", 0)
      isJumping = false
    }
  
    yVelocity -= GRAVITY * delta
  }
  
  function onJump(e) {
    if (e.code !== "Space" || isJumping) return;
  
    // Play jump sound effect
    const jumpSound = document.getElementById("jump-sound");
    jumpSound.volume = 0.5; // Set the volume to 0.5 (50%)
    jumpSound.play();
  
    yVelocity = JUMP_SPEED;
    isJumping = true;
  }
  