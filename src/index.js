import { empty, hasValue } from './utils'

export default function (Alpine) {
   Alpine.magic('do', (_el) => {
      return (action, target = '', content = '', extra = null) => {
         if ('string' === typeof action) {
            return doAction({ action, target, content, extra })
         }

         doActions(action)
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
         del: (path, body = {}) => {
            return doFetch(el, 'DELETE', path, body)
         },
      }
   })

   Alpine.magic('width', () => {
      return window.outerWidth
   })

   Alpine.magic('height', () => {
      return window.outerHeight
   })

   Alpine.magic('get', () => {
      const methods = {
         cookie: (key) => {
            return JSON.parse(cookieStorage.getItem(key))
         },
         local: (key) => {
            return JSON.parse(localStorage.getItem(key))
         },
         session: (key) => {
            return JSON.parse(sessionStorage.getItem(key))
         },
         value: (key) => {
            let el = document.getElementsByName(key)
            if (el.length) {
               return el[0].value
            }
            el = document.getElementById(key)
            if (null !== el) {
               return el.value
            }
            el = document.querySelector(key)
            if (null !== el) {
               return el.value
            }
            return null
         },
         val: (key) => methods.value(key),
         lcl: (key) => methods.local(key),
         ses: (key) => methods.session(key),
         ck: (key) => methods.cookie(key),
      }

      return methods
   })

   Alpine.magic('range', () => {
      return function (start, stop, step = 1) {
         if (empty(stop)) {
            stop = start
            start = start ? 1 : 0
         }

         const reverse = start > stop
         if (reverse) {
            start = stop
            stop = start
         }

         const range = Array.from(
            { length: (stop - start) / step + 1 },
            (_, i) => start + i * step
         )

         return reverse ? range.reverse() : range
      }
   })

   Alpine.directive('autosize', (el) => {
      if ('TEXTAREA' !== el.tagName) {
         return
      }

      el.addEventListener('input', () => {
         el.style.height = 'auto'
         el.style.height = `${el.scrollHeight}px`
      })
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

   if (empty(body) && el instanceof HTMLFormElement) {
      const formData = new FormData(el)
      formData.forEach(function (value, key) {
         if (typeof value === 'string') {
            body[key] = value
         }
      })
   }

   if (!empty(body)) {
      if ('GET' === method) {
         url += '?' + new URLSearchParams(body)
      } else {
         options.body = JSON.stringify(body)
      }
   }

   const res = await fetch(url, options)
   const data = await res.json()
   const success = res.status < 400

   const headers = {}
   res.headers.forEach((value, key) => {
      headers[key] = value
   })

   doActions(data, success, false)

   document.body.classList.remove('cav-body-loading')
   el.classList.remove('cav-el-loading')

   return { success, status: res.status, data, headers }
}

const doActions = (actions, success = true, force = true) => {
   if (Array.isArray(actions)) {
      if (!force && empty(actions[0].action)) {
         return
      }

      actions.forEach((action) => doAction(action, success))
   } else {
      if (!force && empty(actions.action)) {
         return
      }

      doAction(actions, success)
   }
}

const checkAction = (act, _success) => {
   if ('ignore' === act.action) {
      return act
   }

   const alias = {
      addAttr: 'setAttribute',
      after: 'afterend',
      alert: 'toast',
      append: 'beforeend',
      before: 'beforebegin',
      css: 'style',
      prepend: 'afterbegin',
      remAttr: 'removeAttribute',
      remClass: 'removeClass',
      scrollTo: 'scroll',
      setAttr: 'setAttribute',
   }

   act.action = alias[act.action] ?? act.action

   const required = {
      addClass: ['target', 'content'],
      afterbegin: ['target'],
      afterend: ['target'],
      beforebegin: ['target'],
      beforeend: ['target'],
      clone: ['target', 'content'],
      cookie: ['target'],
      copy: [],
      delay: ['content'],
      go: ['target'],
      hide: ['target'],
      html: ['target'],
      local: ['target'],
      method: ['target'],
      move: ['target', 'content'],
      open: ['target'],
      paste: ['target'],
      reload: [],
      remove: ['target'],
      removeAttribute: ['target'],
      removeClass: ['target', 'content'],
      scroll: ['target'],
      session: ['target'],
      setAttribute: ['target', 'content'],
      show: ['target'],
      style: ['target', 'content'],
      text: ['target'],
      title: ['content'],
      toast: ['content'],
      trigger: ['target', 'content'],
      value: ['target', 'content'],
   }

   const optional = {
      cookie: ['content', 'extra'],
      copy: ['target', 'content'],
      local: ['content', 'extra'],
      session: ['content', 'extra'],
   }

   if (empty(required[act.action])) {
      throw new Error(`${act.action} is not a valid action`)
   }

   required[act.action].forEach((check) => {
      if (empty(act[check])) {
         throw new Error(`${check} is needed for the "${act.action}" action`)
      }
   })

   if (!empty(optional[act.action])) {
      if (!optional[act.action].some((check) => !empty(act[check]))) {
         throw new Error(
            `${optional[act.action].join(' or ')} is needed for the "${
               act.action
            }" action`
         )
      }
   }

   switch (act.action) {
      case 'cookie':
      case 'session':
      case 'local':
         act.target = act.target.replace(/[^a-zA-Z0-9_-]/g, '')
         act.content = JSON.stringify(act.content)
         act.extra = act.extra ?? 60 * 60 * 24 * 7
         break

      case 'go':
      case 'open':
         act.target = new URL(act.target).href
         break

      case 'toast':
         if (!empty(act.target)) {
            act.target = new URL(act.target).href
         }
         break

      case 'copy':
         if (!empty(act.target)) {
            const el = document.querySelector(act.target)
            if (el !== null) {
               if (hasValue(el)) {
                  act.content = el.value
               } else {
                  act.content = el.innerText
               }
            }
         }
         break

      case 'paste':
         const el = document.querySelector(act.target)
         if (el !== null && empty(act.content)) {
            if (hasValue(el)) {
               act.content = 'value'
            } else {
               act.content = 'textContent'
            }
         }
         break

      default:
         break
   }

   return act
}

const doAction = (todo, success = true) => {
   if ('object' !== typeof todo) {
      throw new Error('action is not a object')
   }

   if (!todo.hasOwnProperty('action')) {
      throw new Error('action is missing')
   }

   const { action, target, content, extra } = checkAction(todo, success)

   if ('ignore' === action) {
      return
   }

   if ('delay' === action) {
      setTimeout(() => doActions(content), (extra ?? 5) * 1000)
      return
   }

   /**
    * DIRECT ACTIONS
    */
   switch (action) {
      case 'session':
      case 'local':
      case 'cookie':
         let storage = localStorage
         if (action === 'session') {
            storage = sessionStorage
         }
         if (action === 'cookie') {
            storage = cookieStorage
         }

         if (!empty(extra) && extra <= 0) {
            return storage.removeItem(target)
         } else {
            if (action === 'cookie') {
               return storage.setItem(target, content, extra)
            } else {
               return storage.setItem(target, content)
            }
         }

      case 'go':
         setTimeout(() => location.assign(target), (extra ?? 5) * 1000)
         return

      case 'open':
         setTimeout(() => window.open(target), (extra ?? 5) * 1000)
         return

      case 'reload':
         setTimeout(() => document.location.reload(), (extra ?? 5) * 1000)
         return

      case 'title':
         document.title = content
         return

      case 'copy':
         return navigator.clipboard.writeText(content)

      case 'move':
         const mSource = document.querySelector(content)
         const mDestination = document.querySelector(target)

         if (null === mSource || null === mDestination) {
            return
         }

         return mDestination.appendChild(mSource)

      case 'toast':
         return showToast(content, {
            duration: extra ?? 5,
            link: target ?? '',
            classes: success ? 'toast-success' : 'toast-error',
         })

      case 'scroll':
         const sDestination = document.querySelector(target)
         if (null === sDestination) {
            return
         }
         return sDestination.scrollIntoView({ behavior: 'smooth' })

      default:
         break
   }
   /**
    * MULTIPLE TARGETS ACTIONS
    */
   document.querySelectorAll(target).forEach((el) => {
      switch (action) {
         case 'beforebegin':
         case 'afterbegin':
         case 'afterend':
         case 'beforeend':
            return el.insertAdjacentHTML(action, content)

         case 'style':
            Object.entries(content).forEach(([key, value]) => {
               key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
               el.style.setProperty(key, value)
            })
            return

         case 'text':
            el.textContent = content
            return

         case 'html':
            el.innerHTML = content
            return

         case 'show':
            el.style.removeProperty('display')
            return el.classList.remove('d-none', 'hidden')

         case 'hide':
            el.style.display = 'none'
            return

         case 'removeClass':
            return el.classList.remove(...content.split(' '))

         case 'addClass':
            return el.classList.add(...content.split(' '))

         case 'setAttribute':
            return el.setAttribute(content, extra ?? 'true')

         case 'removeAttribute':
            return el.removeAttribute(content)

         case 'paste':
            return navigator.clipboard.readText().then((subject) => {
               el[content] = subject
            })

         case 'value':
            el.value = content
            return

         case 'remove':
            return el.remove()

         case 'trigger':
            return el.dispatchEvent(
               new Event(String(content), {
                  bubbles: false,
                  cancelable: true,
               })
            )

         case 'clone':
            const source = document.querySelector(content)
            if (null === source) {
               return
            }

            return el.appendChild(source.cloneNode(true))

         case 'method':
            if ('function' === typeof el[content]) {
               return el[content]()
            }

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
   const index = document.querySelectorAll('.toast').length
   const toast = document.createElement('li')
   toast.role = 'alert'

   let allClasses = [
      'toast',
      'toast-hidden',
      classes ?? 'toast-success',
      'toast-id-' + index,
   ]
   toast.className = allClasses.join(' ')

   const text = document.createTextNode(message)

   if (link && link.length) {
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

   return index
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
