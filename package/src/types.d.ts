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

interface cavRestBody {
   [key: string]: string
}

interface $do {
   (
      action: cavAction[] | cavAction | cavActionName,
      target?: string,
      content?: any,
      extra?: number | string
   ): void
}

interface $rest {
   get(path: string, body?: cavRestBody): Promise<any>
   post(path: string, body?: cavRestBody): Promise<any>
   put(path: string, body?: cavRestBody): Promise<any>
   patch(path: string, body?: cavRestBody): Promise<any>
   del(path: string, body?: cavRestBody): Promise<any>
}

interface $get {
   cookie(key: string): any
   local(key: string): any
   session(key: string): any
   val(name: string): string
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
      $rest: $rest
      $get: $get
      $width: number
      $height: number
      $range: number[]
   }
   interface Magics<T> {
      $do: $do
      $rest: $rest
      $get: $get
      $width: number
      $height: number
      $range: number[]
   }
}
