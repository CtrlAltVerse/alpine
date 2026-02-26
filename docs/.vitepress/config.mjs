import { defineConfig } from 'vitepress'

const initial = [
   {
      text: 'Introduction',
      link: '/introduction',
   },
   {
      text: 'Getting Started',
      link: '/getting-started',
   },
]

const directives = {
   text: 'Directives',
   items: [
      { text: 'x-autosize', link: '/directives/x-autosize' },
      { text: 'x-countdown', link: '/directives/x-countdown' },
      { text: 'x-login', link: '/directives/x-login' },
      { text: 'x-tip', link: '/directives/x-tip' },
   ],
}

const magics = {
   text: 'Magics',
   items: [
      { text: '$do', link: '/magics/$do' },
      { text: '$get', link: '/magics/$get' },
      { text: '$is', link: '/magics/$is' },
      { text: '$range', link: '/magics/$range' },
      { text: '$rest', link: '/magics/$rest' },
      { text: 'Others', link: '/magics/others' },
   ],
}

const elements = {
   text: 'Elements',
   items: [{ text: 'Toast', link: '/elements/toast' }],
   items: [{ text: 'Tooltip', link: '/elements/tip' }],
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
   title: 'CAV Alpine Plugin',
   description: 'The easiest way to build AJAX sites and others features',
   themeConfig: {
      head: [['link', { rel: 'icon', href: '/alpine/favicon.ico' }]],

      nav: [...initial, directives, magics, elements],

      socialLinks: [
         { icon: 'github', link: 'https://github.com/CtrlAltVerse/alpine' },
         {
            icon: 'npm',
            link: 'https://www.npmjs.com/package/@ctrlaltvers/alpine',
         },
      ],

      sidebar: [...initial, directives, magics, elements],

      outline: {
         level: 'deep',
      },

      footer: {
         message: 'Released under the GPLv3 License.',
         copyright:
            '<a href="https://ctrl.altvers.net" title="A project by CtrlAltVersœ">🌌</a>',
      },
   },
   base: '/alpine/',
})
