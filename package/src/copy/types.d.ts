import type { PluginCallback } from 'alpinejs'

declare const cavPlugin: PluginCallback

export default cavPlugin

type cavActionName =
   | 'scrollTo'
   | 'after'
   | 'before'
   | 'append'
   | 'prepend'
   | 'remClass'
   | 'addAttr'
   | 'setAttr'
   | 'remAttr'
   | 'css'
   | 'alert'
   | 'addClass'
   | 'afterbegin'
   | 'afterend'
   | 'beforebegin'
   | 'beforeend'
   | 'move'
   | 'clone'
   | 'cookie'
   | 'copy'
   | 'delay'
   | 'go'
   | 'hide'
   | 'html'
   | 'local'
   | 'method'
   | 'open'
   | 'paste'
   | 'reload'
   | 'remove'
   | 'removeAttribute'
   | 'removeClass'
   | 'scroll'
   | 'script'
   | 'session'
   | 'setAttribute'
   | 'show'
   | 'style'
   | 'text'
   | 'title'
   | 'toast'
   | 'trigger'
   | 'value'
   | 'ignore'

/**
 * Object for the action handler.
 * @field `action` Action to execute. Required.
 * @field `target` Element, key, or URL. Required in some actions.
 * @field `content` Required in some actions.
 * @field `extra` Duration, delay or value. Optional in some actions.
 */
interface cavAction {
   action: cavActionName
   target?: string
   content?: any
   extra?: number | string
}

interface cavBasicObj {
   [key: string | number]: string | number
}

interface cavRestResponse {
   success: boolean
   status: number
   data: any
   headers: cavBasicObj
}

interface $do {
   (
      action: cavAction[] | cavAction | cavActionName,
      target?: string,
      content?: any,
      extra?: number | string
   ): any | Promise<boolean>
}

type $range = (
   stop: number | string,
   start?: number | string,
   step?: number
) => number[] | string[]

interface $rest {
   get(path: string, body?: cavBasicObj): Promise<cavRestResponse>
   post(path: string, body?: cavBasicObj): Promise<cavRestResponse>
   put(path: string, body?: cavBasicObj): Promise<cavRestResponse>
   patch(path: string, body?: cavBasicObj): Promise<cavRestResponse>
   del(path: string, body?: cavBasicObj): Promise<cavRestResponse>
}

interface $get {
   cookie(key: string): any
   local(key: string): any
   session(key: string): any
   val(name: string): string
}

interface $is {
   adblock(): Promise<boolean>
   mobile(userAgent?: string): boolean
   bot(userAgent?: string): boolean
   touch(): boolean
}

/*
interface cavToastOptions {
   duration?: number
   classes?: string
   link?: string
}

type showToast = (message: string, options: cavToastOptions) => number

interface cookieStorage {
   getItem(key: string): string
   setItem(key: string, value: string, expiration?: number): void
   removeItem(key: string): void
}
*/

declare module 'alpinejs' {
   interface Alpine {
      $do: $do
      $get: $get
      $height: number
      $is: $is
      $range: $range
      $rest: $rest
      $width: number
   }
   interface Magics<T> {
      $do: $do
      $get: $get
      $height: number
      $is: $is
      $range: $range
      $rest: $rest
      $width: number
   }
}
