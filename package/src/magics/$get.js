const $get = () => {
   return {
      cookie: (key) => {
         return JSON.parse(cookieStorage.getItem(key))
      },
      local: (key) => {
         return JSON.parse(localStorage.getItem(key))
      },
      session: (key) => {
         return JSON.parse(sessionStorage.getItem(key))
      },
      cords: () => {
         return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
               reject(new Error('Geolocation not supported'))
               return
            }

            navigator.geolocation.getCurrentPosition(
               (position) => resolve(position.coords),
               (err) => reject(err)
            )
         })
      },
      cb: () => navigator.clipboard.readText(),
      val: (key) => {
         let el = document.getElementsByName(key)
         if (el.length) {
            return el[0].value
         }
         el = document.getElementById(key)
         if (null === el) {
            el = document.querySelector(key)
         }
         if (null !== el) {
            return el.value
         }
         return null
      },
   }
}

export const cookieStorage = {
   getItem(key) {
      let cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
         let cookie = cookies[i].split('=')
         if (key == cookie[0].trim()) {
            return decodeURIComponent(cookie[1])
         }
      }
      return null
   },
   setItem(key, value, expiration = 60 * 60 * 24 * 7) {
      document.cookie = `${key}=${encodeURIComponent(
         value
      )};max-age=${expiration};path=/`
   },
   removeItem(key) {
      this.setItem(key, null, -999)
   },
}

export default $get
