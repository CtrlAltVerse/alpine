import { empty } from '../utils'
import { doActions } from './$do'

const $rest = (el) => {
   return Object.fromEntries(
      ['get', 'post', 'put', 'patch', 'del', 'delete'].map((method) => [
         method,
         async (path, body = {}) => {
            if (!document.body.classList.contains('cav-body-loading')) {
               return doFetch(el, method, path, body)
            }
         },
      ])
   )
}

async function doFetch(el, method, url, body = {}) {
   document.body.classList.add('cav-body-loading')
   el.classList.add('cav-el-loading')

   method = method === 'del' ? 'DELETE' : method.toUpperCase()

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

   let response
   let transition
   const _doFetch = async () => {
      const res = await fetch(url, options)
      const data = await res.json()

      const success = data?.success ?? res.status < 400

      const headers = {}
      res.headers.forEach((value, key) => {
         headers[key] = value
      })

      doActions(data?.data ?? data, success, false)

      document.body.classList.remove('cav-body-loading')
      el.classList.remove('cav-el-loading')

      response = { success, status: res.status, data, headers }
   }

   if (document.startViewTransition) {
      transition = document.startViewTransition(() => _doFetch())
      await transition.updateCallbackDone
   } else {
      await _doFetch()
   }

   return { ...response, transition }
}

export default $rest
