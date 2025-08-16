import { doAction } from '../magics/$do'

const networks = {
   google: {
      script: { src: 'https://accounts.google.com/gsi/client?hl=%lang%' },
      pre: (el, client) => {
         divMaker(el, 'g_id_onload', {
            client_id: `${client}.apps.googleusercontent.com`,
            ux_mode: 'popup',
            login_uri: el.dataset.redirect ?? '',
            context: 'use',
            callback: 'handleGoogleToken',
            auto_prompt: 'false',
         })
         divMaker(el, null, el.dataset, 'g_id_signin')
      },
   },
   facebook: {
      script: {
         src: 'https://connect.facebook.net/%lang%/sdk.js#xfbml=1&version=v23.0&appId=%app%',
         attr: {
            crossorigin: 'anonymous',
         },
      },
      pre: (el) => {
         divMaker(document.body, 'root')
         divMaker(el, null, el.dataset, 'fb-login-button')
      },
   },
   apple: {
      script: {
         src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/%lang%/appleid.auth.js',
      },
      pre: (el) => {
         divMaker(el, 'appleid-signin', el.dataset)
      },
      post: ({ client, redirect, nonce, state }) =>
         AppleID.auth.init({
            clientId: client,
            scope: 'name email',
            redirectURI: redirect,
            state,
            nonce,
            usePopup: true,
         }),
   },
}

const divMaker = (el, id = null, dataset = null, className = null) => {
   const div = document.createElement('div')
   if (id) {
      div.id = id
   }
   if (dataset) {
      for (const [key, value] of Object.entries(dataset)) {
         div.dataset[key] = value
      }
   }
   if (className) {
      div.classList.add(className)
   }
   el.parentNode.insertBefore(div, el)
}

const login = (el, { value, modifiers, expression }, { cleanup }) => {
   const network = networks[value] ?? false

   if (!network) {
      return
   }

   const convert = () => {
      network.pre(el, expression)

      doAction({
         action: 'script',
         target: `${value}-login-sdk`,
         content: network.script.src
            .replace('%lang%', navigator.language.replace('-', '_'))
            .replace('%app%', expression),
         extra: network.script.attr ?? {},
      }).then(() => {
         if ('function' === typeof network?.post) {
            network.post({
               client: expression,
               redirect: el.dataset.redirect,
               state: el.dataset.state ?? '',
               nonce: el.dataset.nonce ?? '',
            })
         }
         el.remove()
      })
   }

   if (modifiers.includes('init')) {
      convert()
      return
   }

   el.addEventListener('click', convert)

   cleanup(() => {
      el.removeEventListener('click', convert)
   })
}

export default login
