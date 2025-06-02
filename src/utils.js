export const empty = (variable) => {
   if ('object' === typeof variable && variable.constructor === Object) {
      return Object.keys(variable).length === 0
   }

   return 'undefined' === typeof variable
}

export const hasValue = (el) => {
   return [
      'INPUT',
      'OUTPUT',
      'SELECT',
      'BUTTON',
      'OPTION',
      'TEXTAREA',
   ].includes(el.tagName)
}
