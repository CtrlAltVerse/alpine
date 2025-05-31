export default function (Alpine) {
   Alpine.magic('copy', () => {
      if (location.protocol !== 'https:') {
         return console.warn('Needs a https site.')
      }

      return (subject) => navigator.clipboard.writeText(subject)
   })

   Alpine.magic('action', (_el) => {
      return (action, target = '', content = '', duration = 5) => {
         if ('string' === typeof action) {
            return doAction({ action, target, content, duration })
         }

         if (Array.isArray(action)) {
            action.forEach((act) => {
               doAction(act)
            })
         } else {
            doAction(action)
         }
      }
   })

   Alpine.magic('rest', (el) => {
      return {
         get: (path, body = {}) => {
            return doFetch(el, 'GET', path, body)
         },
         post: (path, body = {}) => {
            return doFetch(el, 'POST', path, body)
         },
         put: (path, body = {}) => {
            return doFetch(el, 'PUT', path, body)
         },
         patch: (path, body = {}) => {
            return doFetch(el, 'PATCH', path, body)
         },
         delete: (path, body = {}) => {
            return doFetch(el, 'DELETE', path, body)
         },
      }
   })
}

async function doFetch(el, method, url, body = {}) {
   if (document.body.classList.contains('cav-body-loading')) {
      return
   }

   document.body.classList.add('cav-body-loading')
   el.classList.add('cav-el-loading')

   const options = {
      method,
      headers: {
         'Content-Type': 'application/json',
      },
   }

   if (objectIsEmpty(body) && el instanceof HTMLFormElement) {
      const formData = new FormData(el)
      formData.forEach(function (value, key) {
         if (typeof value === 'string') {
            body[key] = value
         }
      })
   }

   if (!objectIsEmpty(body)) {
      if ('GET' === method) {
         url += '?' + new URLSearchParams(body)
      } else {
         options.body = JSON.stringify(body)
      }
   }

   const res = await fetch(url, options)
   const actions = await res.json()

   const success = res.status < 400

   if (Array.isArray(actions)) {
      actions.forEach((action) => doAction(action, success))
   } else {
      doAction(actions, success)
   }
   document.body.classList.remove('cav-body-loading')
   el.classList.remove('cav-el-loading')

   return { success, data: actions }
}

const objectIsEmpty = (obj) => {
   return Object.keys(obj).length === 0 && obj.constructor === Object
}

const checkAction = (act, _success) => {
   const alias = {
      scrollTo: 'scroll',
      after: 'afterend',
      before: 'beforebegin',
      append: 'beforeend',
      prepend: 'afterbegin',
      remClass: 'removeClass',
      setAttr: 'setAttribute',
      remAttr: 'removeAttribute',
   }

   act.action = alias[act.action] ?? act.action

   const required = {
      addClass: ['target', 'content'],
      afterend: ['target'],
      beforeend: ['target'],
      beforebegin: ['target'],
      cookie: ['target', 'content'],
      delay: ['content'],
      go: ['content'],
      hide: ['target'],
      html: ['target'],
      local: ['target', 'content'],
      open: ['content'],
      afterbegin: ['target'],
      reload: [],
      remove: ['target'],
      removeAttribute: ['target'],
      removeClass: ['target', 'content'],
      scroll: ['target'],
      session: ['target', 'content'],
      setAttribute: ['target', 'content'],
      show: ['target'],
      text: ['target'],
      title: ['content'],
      toast: ['content'],
      trigger: ['target', 'content'],
   }

   if ('undefined' === required[act.action]) {
      throw new Error('action invalid')
   }

   required[act.action].forEach((check) => {
      if ('undefined' === act[check]) {
         throw new Error(`${check} needed`)
      }
   })

   switch (act.action) {
      case 'cookie':
      case 'session':
      case 'local':
         act.target = act.target.replace(/[^a-zA-Z0-9_-]/g, '')
         act.content = JSON.stringify(act.content)
         break

      case 'go':
      case 'open':
         act.content = new URL(act.content).href

      default:
         break
   }

   return act
}

const doAction = (act, success = false) => {
   if (!act.hasOwnProperty('action')) {
      throw new Error('action needed')
   }

   if ('ignore' === act.action) {
      return
   }

   act = checkAction(act, success)

   const content = act.content ?? ''

   if ('string' !== typeof content) {
      if ('delay' === act.action) {
         setTimeout(() => {
            if (Array.isArray(content)) {
               content.forEach((action) => doAction(action))
            } else {
               doAction(content)
            }
         }, (act.duration ?? 5) * 1000)
      }
      return
   }

   /**
    * DIRECT ACTIONS
    */
   switch (act.action) {
      case 'session':
         if (typeof act?.duration !== 'undefined' && act?.duration < 0) {
            return sessionStorage.removeItem(act.target)
         } else {
            return sessionStorage.setItem(act.target, act.content)
         }

      case 'local':
         if (typeof act?.duration !== 'undefined' && act?.duration < 0) {
            return localStorage.removeItem(act.target)
         } else {
            return localStorage.setItem(act.target, act.content)
         }

      case 'cookie':
         document.cookie = `${act.target}=${act.content};Max-Age=${
            act.duration ?? 60 * 60 * 24 * 7
         };Path=/;SameSite=Lax;Secure`
         return

      case 'go':
         setTimeout(
            () => location.assign(act.content),
            (act.duration ?? 5) * 1000
         )
         return

      case 'open':
         setTimeout(() => window.open(act.content), (act.duration ?? 5) * 1000)
         return

      case 'reload':
         setTimeout(
            () => document.location.reload(),
            (act.duration ?? 5) * 1000
         )
         return

      case 'title':
         document.title = content
         return

      case 'toast':
         return showToast(content, { duration: act.duration ?? 5 })

      case 'scroll':
         return document
            .querySelector(act.target)
            .scrollIntoView({ behavior: 'smooth' })

      default:
         break
   }

   /**
    * MULTIPLE TARGETS ACTIONS
    */
   document.querySelectorAll(act.target).forEach((el) => {
      switch (act.action) {
         case 'beforebegin':
         case 'afterbegin':
         case 'afterend':
         case 'beforeend':
            return el.insertAdjacentHTML(act.action, content)

         case 'text':
            el.textContent = content
            return

         case 'html':
            el.innerHTML = content
            return

         case 'show':
            return el.classList.remove('d-none', 'hidden')

         case 'hide':
            return el.classList.add('d-none', 'hidden')

         case 'removeClass':
            return el.classList.remove(...content.split(' '))

         case 'addClass':
            return el.classList.add(...content.split(' '))

         case 'setAttribute':
            const [key, value] = content.split('=')
            return el.setAttribute(key, value ?? 'true')

         case 'removeAttribute':
            return el.removeAttribute(content)

         case 'remove':
            return el.remove()

         case 'trigger':
            return el.dispatchEvent(
               new Event(String(content), {
                  bubbles: false,
                  cancelable: true,
               })
            )

         default:
            return
      }
   })
}

export const showToast = (message, options = {}) => {
   const { duration, classes, link } = options

   let list = document.getElementById('toast-list')
   if (!list) {
      list = document.createElement('ul')
      list.id = 'toast-list'
      document.body.appendChild(list)
   }

   const toast = document.createElement('li')
   toast.role = 'alert'

   let allClasses = [
      'toast',
      'toast-hidden',
      classes ?? 'toast-success',
      'toast-index-' + document.querySelectorAll('.toast').length,
   ]
   toast.className = allClasses.join(' ')

   const text = document.createTextNode(message)

   if (link) {
      const hyperlink = document.createElement('a')
      hyperlink.href = link
      hyperlink.target = '_blank'

      hyperlink.appendChild(text)
      toast.appendChild(hyperlink)
   } else {
      toast.appendChild(text)
   }

   list.appendChild(toast)

   setTimeout(() => {
      toast.classList.remove('toast-hidden')
   }, 1)

   setTimeout(() => {
      toast.classList.add('toast-hidden')
   }, (duration ?? 5) * 1000)

   setTimeout(() => {
      list.removeChild(toast)
      if (!document.querySelectorAll('.toast').length) {
         document.body.removeChild(list)
      }
   }, (duration ?? 5) * 1000 + 501)
}
