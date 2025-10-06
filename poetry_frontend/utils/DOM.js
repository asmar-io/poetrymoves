/**
 *
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} elem
 * @returns {boolean}
 */
export function clickOutside(x, y, elem) {
  let domRect = elem.getBoundingClientRect()
  let x1 = domRect.left
  let x2 = x1 + domRect.width
  let y1 = domRect.top
  let y2 = y1 + domRect.height

  return (x - x1) * (x - x2) >= 0 || (y - y1) * (y - y2) >= 0
}
