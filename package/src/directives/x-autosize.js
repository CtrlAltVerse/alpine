const autosize = (el, {}, { cleanup }) => {
   if ('TEXTAREA' !== el.tagName) {
      return
   }

   const onInput = () => {
      if (!el.hasAttribute('rows')) {
         el.rows = 1
      }
      el.style.height = `${el.scrollHeight}px`
      el.style.resize = 'none'
      el.style.overflow = 'hidden'
   }

   el.addEventListener('input', onInput)
   window.addEventListener('resize', onInput)
   onInput()

   cleanup(() => {
      window.removeEventListener('resize', onInput)
   })
}

export default autosize
