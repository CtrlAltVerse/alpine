const tip = (el, { value, expression, modifiers }, { cleanup }) => {
   let stamp = null
   let isLock = false
   let position = value ?? 'right'
   let style = 'position:absolute;'

   let onlyClick = modifiers.includes('onlyclick')

   el.style = 'cursor:help'

   switch (position) {
      case 'top':
         style += `bottom:8px;left:-50%`
         break

      case 'bottom':
         style += `top:${el.offsetHeight + 8}px;left:-50%`
         break

      case 'left':
         style += `right:${el.offsetWidth + 8}px`
         break

      default:
         style += `left:${el.offsetWidth + 8}px`
         break
   }

   const showTip = () => {
      if (stamp) {
         return
      }

      stamp = document.createElement('div')
      stamp.style = `position:fixed; pointer-events:none; top:${el.offsetTop}px; left:${el.offsetLeft}px; width:${el.offsetWidth}px; heigh:${el.offsetHeight}px`

      const tip = document.createElement('span')
      tip.className = 'tip'
      tip.style = style
      tip.innerText = expression

      stamp.appendChild(tip)

      el.parentNode.insertBefore(stamp, el)
   }

   const hideTip = (e) => {
      if (null === stamp) {
         return
      }

      if (e.type !== 'click' && isLock) {
         return
      }

      stamp.remove()
      stamp = null
   }

   const toggleTip = (e) => {
      if (stamp) {
         isLock = false
         hideTip(e)
      } else {
         isLock = true
         showTip(e)
      }
   }

   if (!onlyClick) {
      el.addEventListener('mouseenter', showTip)
      el.addEventListener('focus', showTip)
      el.addEventListener('mouseleave', hideTip)
      el.addEventListener('blur', hideTip)
   }
   el.addEventListener('click', toggleTip)

   cleanup(() => {
      if (!onlyClick) {
         el.removeEventListener('mouseenter', showTip)
         el.removeEventListener('mouseleave', hideTip)
         el.removeEventListener('focus', showTip)
         el.removeEventListener('blur', hideTip)
      }
      el.removeEventListener('click', toggleTip)
      stamp = null
   })
}

export default tip
