/**
 * @see https://esdiscuss.org/topic/promises-async-functions-and-requestanimationframe-together
 */
export function animationFrame(): Promise<Function> {
  let resolve: Function | null = null
  const promise: Promise<Function> = new Promise(
    (r: Function): Function => (resolve = r)
  )

  if (resolve) window.requestAnimationFrame(resolve)

  return promise
}
