import { isNumber, inNatoAlphabet, natoAlphabet } from '../utils'

const $range = () => {
   return (stop, start = 1, step = 1) => {
      if (isNumber(stop)) {
         return Array.from(
            { length: (stop - start) / step + 1 },
            (_, i) => start + i * step
         )
      }

      const stopIndex = inNatoAlphabet(stop)
      if (stopIndex !== -1) {
         const startIndex = inNatoAlphabet(start, 0)

         const words = []
         for (let i = startIndex; i <= stopIndex; i++) {
            words.push(natoAlphabet[i])
         }

         return words
      }

      stop = stop.charCodeAt(0)

      if (isNumber(start)) {
         // UPPERCASEs
         if (65 <= stop && stop <= 90) {
            start = 'A'
         }
         // LOWERCASEs
         if (97 <= stop && stop <= 122) {
            start = 'a'
         }
      }
      start = start.charCodeAt(0)

      const letters = []
      for (let i = start; i <= stop; i++) {
         letters.push(String.fromCharCode(i))
      }

      return letters
   }
}

export default $range
