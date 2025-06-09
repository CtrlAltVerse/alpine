import { ping } from '../utils'

const $is = () => {
   return {
      adblock: async () => !(await ping('pagead2.googlesyndication.com')),
      mobile: (userAgent = navigator.userAgent) =>
         /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|redmi|series[46]0|samsungbrowser.*mobile|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
            userAgent
         ),
      bot: (userAgent = navigator.userAgent) =>
         /bot|crawl|http|lighthouse|scan|search|spider|custom|server/i.test(
            userAgent
         ),
      touch: () =>
         'ontouchstart' in document.documentElement ||
         navigator.MaxTouchPoints > 0 ||
         navigator.msMaxTouchPoints > 0,
   }
}

export default $is
