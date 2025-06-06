const countdown = (
   el,
   { value, modifiers, expression },
   { evaluate, effect, cleanup }
) => {
   const originalValue = value ? Number(value) : 5

   if (isNaN(originalValue)) {
      throw new Error(`${value} is not a number`)
   }

   let countdown = originalValue
   const elText = el.textContent.length ? el.textContent : '%sec'

   const updateText = () => {
      if (!modifiers.includes('invisible')) {
         el.textContent = elText.replace('%sec', countdown)
      }
   }

   effect(() => {
      updateText()
   })

   const timer = setInterval(() => {
      countdown--

      effect(() => {
         updateText()

         if (countdown === 0 && expression) {
            evaluate(expression)
         }

         if (countdown === 0 && modifiers.includes('destroy')) {
            el.remove()
         }

         if (countdown <= 0) {
            if (modifiers.includes('repeat')) {
               countdown = originalValue + 1
               return
            }

            clearInterval(timer)
         }
      })
   }, 1000)

   cleanup(() => {
      clearInterval(timer)
   })
}

export default countdown
