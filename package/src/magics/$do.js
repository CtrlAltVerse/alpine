import { empty, cookieStorage, hasValue } from '../utils'

const $do = (_el, { evaluate }) => {
   return (action, target = '', content = '', extra = null) => {
      if ('string' === typeof action) {
         return doAction({ action, target, content, extra })
      }

      return doActions(action)
   }
}

export const doActions = (actions, success = true, force = true) => {
   if (Array.isArray(actions)) {
      if (!force && empty(actions[0]?.action)) {
         return
      }

      actions.forEach((action) => doAction(action, success))
   } else {
      if (!force && empty(actions?.action)) {
         return
      }

      return doAction(actions, success)
   }
}

export const doAction = (todo, success = true) => {
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
      cb: 'callback',
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
         same: true,
         req: ['target'],
         cb: (el) => doInsertAction(el, action, content),
      },
      afterend: {
         same: true,
         req: ['target'],
         cb: (el) => doInsertAction(el, action, content),
      },
      beforebegin: {
         same: true,
         req: ['target'],
         cb: (el) => doInsertAction(el, action, content),
      },
      beforeend: {
         same: true,
         req: ['target'],
         cb: (el) => doInsertAction(el, action, content),
      },
      callback: {
         one: true,
         same: true,
         req: ['target'],
         cb: () => {
            if (target.length <= 22) {
               return Function(target)()
            }
         },
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
         same: true,
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
      pip: {
         one: true,
         cb: (el = 'video') => {
            document.querySelector(el).requestPictureInPicture()
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
      script: {
         one: true,
         same: true,
         cb: () =>
            new Promise((resolve) => {
               if (null !== document.getElementById(`${target}-js`)) {
                  resolve(true)
                  return
               }
               const script = document.createElement('script')
               script.id = `${target}-js`
               script.src = content
               script.onload = () => setTimeout(() => resolve(true), 99)
               script.onerror = () => resolve(false)
               if (empty(extra)) {
                  extra = { async: '' }
               }
               for (const [key, value] of Object.entries(extra)) {
                  script.setAttribute(key, value ?? '')
               }
               document.head.appendChild(script)
            }),
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
            doToastAction(content, {
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
   if (empty(actions?.[action])) {
      throw new Error(`${action} is not a valid action`)
   }

   // CHECKS required proprieties
   if (!empty(actions[action]?.req)) {
      if (actions[action].req.some((check) => empty(todo?.[check]))) {
         throw new Error(
            `"${action}" needs ${actions[action].req.join(' and ')}`
         )
      }
   }

   // CHECKS optional proprieties
   if (!empty(actions[action]?.opt)) {
      if (actions[action].opt.every((check) => empty(todo?.[check]))) {
         throw new Error(
            `"${action}" needs ${actions[action].opt.join(' or ')}`
         )
      }
   }

   // DO direct actions
   if (!empty(actions[action]?.one)) {
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

   return storage.setItem(...[target, content, extra])
}

const doToastAction = (message, options = {}) => {
   const { duration, classes, link } = options
   const durationMS = (duration ?? 5) * 1000

   let list = document.getElementById('toasts')
   if (!list) {
      list = document.createElement('ul')
      list.id = 'toasts'
      list.popover = 'manual'
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

   const bar = document.createElement('div')
   bar.className = 'toast-bar'
   bar.style = `transition-duration: ${durationMS}ms`

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

   toast.appendChild(bar)

   list.appendChild(toast)

   setTimeout(() => {
      list.showPopover()
      toast.classList.remove('toast-hidden')
   }, 1)

   setTimeout(() => {
      toast.classList.add('toast-hidden')
   }, durationMS)

   setTimeout(() => {
      list.removeChild(toast)
      if (!document.querySelectorAll('.toast').length) {
         document.body.removeChild(list)
      }
   }, durationMS + 501)

   return index
}

export default $do
