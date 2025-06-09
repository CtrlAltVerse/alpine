export const empty = (variable) => {
   if ('object' === typeof variable && variable.constructor === Object) {
      return Object.keys(variable).length === 0
   }

   return 'undefined' === typeof variable
}

export const hasValue = (el) =>
   ['INPUT', 'OUTPUT', 'SELECT', 'BUTTON', 'OPTION', 'TEXTAREA'].includes(
      el.tagName
   )

export const isNumber = (val) => typeof val === 'number' && !isNaN(val)

export const toCapitalize = (val) =>
   val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()

export const natoAlphabet = [
   'Alfa',
   'Bravo',
   'Charlie',
   'Delta',
   'Echo',
   'Foxtrot',
   'Golf',
   'Hotel',
   'India',
   'Juliett',
   'Kilo',
   'Lima',
   'Mike',
   'November',
   'Oscar',
   'Papa',
   'Quebec',
   'Romeo',
   'Sierra',
   'Tango',
   'Uniform',
   'Victor',
   'Whiskey',
   'Xray',
   'Yankee',
   'Zulu',
]

export const inNatoAlphabet = (word, notFound = -1) => {
   if (4 <= word.length && word.length <= 8) {
      const found = natoAlphabet.indexOf(toCapitalize(word))

      return found > -1 ? found : notFound
   }

   return notFound
}

export const ping = (url) => {
   return new Promise((resolve) => {
      const img = new Image()
      const start = new Date().getTime()
      img.onload = () => resolve(new Date().getTime() - start)
      img.onerror = () => resolve(false)
      img.src = '//' + url + '/favicon.ico'

      setTimeout(() => resolve(false), 999)
   })
}
