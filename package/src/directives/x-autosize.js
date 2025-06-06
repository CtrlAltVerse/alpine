const autosize = (el) => {
   if ('TEXTAREA' !== el.tagName) {
      return
   }

   el.addEventListener('input', () => {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
   })
}

export default autosize
