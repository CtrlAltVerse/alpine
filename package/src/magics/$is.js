const $is = () => {
   return {
      adblock: () => {
         return new Promise((resolve) => {
            fetch(
               '//cdn.jsdelivr.net/npm/@ctrlaltvers/alpine/dist/m.doubleclick.net.ads.js'
            )
               .then((res) => {
                  res.text().then((text) => {
                     resolve(res.status !== 200 || text !== 'banner')
                  })
               })
               .catch(() => {
                  resolve(true)
               })
         })
      },
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
