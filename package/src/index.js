import autosize from './directives/x-autosize'
import countdown from './directives/x-countdown'
import login from './directives/x-login'

import $do from './magics/$do'
import $get from './magics/$get'
import $is from './magics/$is'
import $range from './magics/$range'
import $rest from './magics/$rest'

export default function (Alpine) {
   Alpine.directive('autosize', autosize)

   Alpine.directive('countdown', countdown)

   Alpine.directive('login', login)

   Alpine.magic('do', $do)

   Alpine.magic('get', $get)

   Alpine.magic('is', $is)

   Alpine.magic('range', $range)

   Alpine.magic('rest', $rest)

   Alpine.magic('width', () => window.outerWidth)

   Alpine.magic('height', () => window.outerHeight)
}
