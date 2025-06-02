import {
   empty,
   hasValue,
   isNumber,
   inNatoAlphabet,
   natoAlphabet,
} from './utils'

export default function (Alpine) {
   Alpine.magic('do', (_el) => {
      return (action, target = '', content = '', extra = null) => {
         if ('string' === typeof action) {
            return doAction({ action, target, content, extra })
         }

         return doActions(action)
      }
   })

   Alpine.magic('rest', (el) => {
      return Object.fromEntries(
         ['get', 'post', 'put', 'patch', 'del', 'delete'].map((method) => [
            method,
            (path, body = {}) => doFetch(el, method, path, body),
         ])
      )
   })

   Alpine.magic('width', () => {
      return window.outerWidth
   })

   Alpine.magic('height', () => {
      return window.outerHeight
   })

   Alpine.magic('get', () => {
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
         val: (key) => {
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
      }
   })

   Alpine.magic('range', () => {
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
      method: method === 'del' ? 'DELETE' : method.toUpperCase(),
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

      return doAction(actions, success)
   }
}

const doAction = (todo, success) => {
   if ('object' !== typeof todo) {
      throw new Error('action is not a object')
   }

   if (!todo.hasOwnProperty('action')) {
      throw new Error('action is missing')
   }

   let { action, target, content, extra } = todo

   if ('ignore' === action) {
      return
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

   action = alias[action] ?? action

   const actions = {
      addClass: {
         req: ['target', 'content'],
         cb: (el) => el.classList.add(...content.split(' ')),
      },
      afterbegin: {
         req: ['target'],
         cb: (el) => doInsertAction(el, action, content),
      },
      afterend: {
         req: ['target'],
         cb: (el) => doInsertAction(el, action, content),
      },
      beforebegin: {
         req: ['target'],
         cb: (el) => doInsertAction(el, action, content),
      },
      beforeend: {
         req: ['target'],
         cb: (el) => doInsertAction(el, action, content),
      },
      clone: {
         req: ['target', 'content'],
         cb: (el) => {
            const source = document.querySelector(content)
            if (null !== source) {
               return el.appendChild(source.cloneNode(true))
            }
         },
      },
      cookie: {
         one: true,
         req: ['target'],
         opt: ['content', 'extra'],
         cb: () => doStorageAction(cookieStorage, target, content, extra),
      },
      copy: {
         one: true,
         opt: ['target', 'content'],
         cb: () => {
            if (!empty(target)) {
               const el = document.querySelector(target)
               if (el !== null) {
                  if (hasValue(el)) {
                     content = el.value
                  } else {
                     content = el.innerText
                  }
               }
            }

            navigator.clipboard.writeText(content)
         },
      },
      delay: {
         one: true,
         req: ['content'],
         cb: () => setTimeout(() => doActions(content), (extra ?? 5) * 1000),
      },
      go: {
         one: true,
         req: ['target'],
         cb: () =>
            setTimeout(() => location.assign(target), (extra ?? 5) * 1000),
      },
      hide: {
         req: ['target'],
         cb: (el) => (el.style.display = 'none'),
      },
      html: {
         req: ['target'],
         opt: ['content', 'extra'],
         cb: (el) => (el.innerHTML = content),
      },
      local: {
         one: true,
         req: ['target'],
         cb: () => doStorageAction(localStorage, target, content, extra),
      },
      method: {
         req: ['target'],
         cb: (el) => {
            if ('function' === typeof el[content]) {
               return el[content]()
            }
         },
      },
      move: {
         one: true,
         req: ['target', 'content'],
         cb: () => {
            const source = document.querySelector(content)
            const destination = document.querySelector(target)

            if (null !== source && null === destination) {
               return destination.appendChild(source)
            }
         },
      },
      open: {
         one: true,
         req: ['target'],
         cb: () => setTimeout(() => window.open(target), (extra ?? 5) * 1000),
      },
      paste: {
         req: ['target'],
         cb: (el) => {
            const el_target = document.querySelector(target)
            if (el_target !== null && empty(content)) {
               if (hasValue(el_target)) {
                  content = 'value'
               } else {
                  content = 'textContent'
               }
            }

            navigator.clipboard.readText().then((subject) => {
               el[content] = subject
            })
         },
      },
      reload: {
         one: true,
         cb: () =>
            setTimeout(() => document.location.reload(), (extra ?? 5) * 1000),
      },
      remove: {
         req: ['target'],
         cb: (el) => el.remove(),
      },
      removeAttribute: {
         req: ['target'],
         cb: (el) => el.removeAttribute(content),
      },
      removeClass: {
         req: ['target', 'content'],
         cb: (el) => el.classList.remove(...content.split(' ')),
      },
      scroll: {
         one: true,
         req: ['target'],
         cb: () => {
            const destination = document.querySelector(target)
            if (null !== destination) {
               return destination.scrollIntoView({ behavior: 'smooth' })
            }
         },
      },
      session: {
         one: true,
         req: ['target'],
         opt: ['content', 'extra'],
         cb: () => doStorageAction(sessionStorage, target, content, extra),
      },
      setAttribute: {
         req: ['target', 'content'],
         cb: (el) => el.setAttribute(content, extra ?? 'true'),
      },
      show: {
         req: ['target'],
         cb: (el) => {
            el.style.removeProperty('display')
            el.classList.remove('d-none', 'hidden')
         },
      },
      style: {
         req: ['target', 'content'],
         cb: (el) =>
            Object.entries(content).forEach(([key, value]) => {
               key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
               el.style.setProperty(key, value)
            }),
      },
      text: {
         req: ['target'],
         cb: (el) => (el.textContent = content),
      },
      title: {
         one: true,
         req: ['content'],
         cb: () => (document.title = content),
      },
      toast: {
         one: true,
         req: ['content'],
         cb: () =>
            showToast(content, {
               duration: extra ?? 5,
               link: target ?? '',
               classes: success ? 'toast-success' : 'toast-error',
            }),
      },
      trigger: {
         req: ['target', 'content'],
         cb: (el) =>
            el.dispatchEvent(
               new Event(String(content), {
                  bubbles: false,
                  cancelable: true,
               })
            ),
      },
      value: {
         req: ['target', 'content'],
         cb: (el) => (el.value = content),
      },
   }

   // CHECKS action
   if (empty(actions[action])) {
      throw new Error(`${action} is not a valid action`)
   }

   // CHECKS required proprieties
   if (!empty(actions[action].req)) {
      if (actions[action].req.some((check) => empty(todo[check]))) {
         throw new Error(
            `"${action}" needs ${actions[action].req.join(' and ')}`
         )
      }
   }

   // CHECKS optional proprieties
   if (!empty(actions[action].opt)) {
      if (actions[action].opt.every((check) => empty(todo[check]))) {
         throw new Error(
            `"${action}" needs ${actions[action].opt.join(' or ')}`
         )
      }
   }

   // DO direct actions
   if (!empty(actions[action].one)) {
      return actions[action].cb()
   }

   // DO multiple target actions
   return document.querySelectorAll(target).forEach((el) => {
      return actions[action].cb(el)
   })
}

const doInsertAction = (el, action, content) =>
   el.insertAdjacentHTML(action, content)

const doStorageAction = (storage, target, content, extra) => {
   target = target.replace(/[^a-zA-Z0-9_-]/g, '')
   content = JSON.stringify(content)
   extra = extra ?? 60 * 60 * 24 * 7

   if (!empty(extra) && extra <= 0) {
      return storage.removeItem(target)
   }

   if (storage === cookieStorage) {
      return storage.setItem(target, content, extra)
   } else {
      return storage.setItem(target, content)
   }
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
