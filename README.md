# CAV Alpine Plugin

Includes many features to speed up development of reactive websites, such as `$rest` and `$do`, slightly inspired by
HTMX and jQuery.

## Installation

### Via CDN

```html
<!-- CAV Alpine Plugin -->
<script defer src="https://cdn.jsdelivr.net/npm/@ctrtaltvers/alpine@1.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Via NPM

```shell
npm install @ctrtaltvers/alpine
```

```js
import Alpine from 'alpinejs'
import cav from '@ctrtaltvers/alpine'

Alpine.plugin(cav)
```

## Directives

### x-autosize

```html
<textarea x-autosize></textarea>
```

Auto resize the height of a `textarea` according to its content.

## Magics

### $width and $height

```js
$width + 'x' + $height
```

Returns the current width or height of the window.

### $get

```ts
$get.METHOD(key: string): any
```

Gets the value of a localStorage item, a sessionStorage item, a cookie, or an
element<sup><a href="#notes">5</a></sup>, according to the specified method. Accepts `local`, `session`, `cookie` or
`value`. Returns null if the item is not found.  
`$get.value` searches for the first element by name, ID, or CSS selector.

### $range

```ts
$range(end: number, start = 1, step = 1): number[]
```

Returns an array of numbers. `end` sets the last number; `start` sets the first number; `step` defines the incremente
between each value.

#### Exemple

```html
<template x-for="n in $range(7)">
   <span x-text="n"></span>
</template>
```

### $rest

```ts
$rest.METHOD(url, body?: object): Promise<success: boolean; status: number; data: any; headers: object>
```

Makes an HTTP request. The response must be in JSON format. The available methods are `get`, `post`, `put`, `patch`
and `del`.  
If the response is an array of actions (<a href="#do">see $do</a>), executes them.  
If the source element is a form, the `body` will be populated with the input names and values of the form. If the
method is `get`, the `body` is transferred to the URL as parameters.  
During the request, `.cav-body-loading` will be added to the body, and `.cav-el-loading` to the source element.  
Only one request will be made at a time.

#### Examples:

```html
<form x-submit.prevent="$rest.post(wp.ajaxUrl)">
   <input type="hidden" name="action" value="handleSubmitForm" />
</form>
```

```js
$rest.put('/update', { avatar: 23 }).then((response) => {
   response.success // true if statusCode is 2XX or 3XX.
   response.status // statusCode
   response.data // body, usually action[].
   response.headers // headers
})
```

### $do

```ts
$do(action: enum|action[], target?: string, content?: any, extra?: number|string)
```

Do a single or an array of actions, as described below.

#### Examples:

```html
<button x-on:click="$do('cookie', 'terms-accept', 'yes')">Accept</button>
```

```js
$do([
   { action: 'after', target: 'body', content: '<p id="newP">Lorem ipsum</p>' },
   { action: 'setAttr', target: '#newP', content: 'class', extra: 'truncate' },
])
```

| `action`                                         | `target`                                                                                                                             | `content`                                                                                   | `extra`                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `cookie`<br>Manages a cookie                     | Key<sup><a href="#notes">1</a></sup>.<br>_Required._                                                                                 | Value<sup><a href="#notes">2</a></sup>.<br>_Required._                                      | Expiration in seconds. If negative, deletes.<br>_Default: 7d._ |
| `session`<br>Manages a sessionStorage item       | Key<sup><a href="#notes">1</a></sup>.<br>_Required._                                                                                 | Value<sup><a href="#notes">2</a></sup>.<br>_Required w/o `extra`._                          | If negative, deletes.<br>_Required w/o `content`._             |
| `local`<br>Manages a localStorage item           | Key<sup><a href="#notes">1</a></sup>.<br>_Required._                                                                                 | Value<sup><a href="#notes">2</a></sup>.<br>_Required w/o `extra`._                          | If negative, deletes.<br>_Required w/o `content`._             |
| `go`<br>Goes to an URL                           | URL<sup><a href="#notes">3</a></sup>.<br>_Required._                                                                                 |                                                                                             | Delay in seconds.<br>_Default: 5s._                            |
| `open`<br>Opens an URL in another tab            | URL<sup><a href="#notes">3</a></sup>.<br>_Required._                                                                                 |                                                                                             | Delay in seconds.<br>_Default: 5s._                            |
| `reload`<br>Reloads the current page             |                                                                                                                                      |                                                                                             | Delay in seconds.<br>_Default: 5s._                            |
| `scroll`<br>Scrolls to an element                | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             |                                                                                             |                                                                |
| `title`<br>Changes the document title            |                                                                                                                                      | New title.<br>_Required._                                                                   |                                                                |
| `text`<br>Replaces a text content                | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | Text content.<br>_Required._                                                                |                                                                |
| `html`<br>Replaces a HTML content                | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | HTML content.<br>_Required._                                                                |                                                                |
| `value`<br>Updates a value                       | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | New value.<br>_Required._                                                                   |                                                                |
| `before`<br>Adds HTML before (outside) a element | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | HTML content.<br>_Required._                                                                |                                                                |
| `after`<br>Adds HTML after (outside) a element   | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | HTML content.<br>_Required._                                                                |                                                                |
| `prepend`<br>Adds HTML inside (first) a element  | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | HTML content.<br>_Required._                                                                |                                                                |
| `append`<br>Adds HTML inside (last) a element    | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | HTML content.<br>_Required._                                                                |                                                                |
| `show`<br>Shows a element                        | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             |                                                                                             |                                                                |
| `hide`<br>Hides a element                        | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             |                                                                                             |                                                                |
| `remove`<br>Removes a element                    | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             |                                                                                             |                                                                |
| `move`<br>Moves a element                        | Destination<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                         | Source<sup><a href="#notes">4</a></sup>.<br>_Required._                                     |                                                                |
| `clone`<br>Clones a element                      | Destination<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                         | Source<sup><a href="#notes">4</a></sup>.<br>_Required._                                     |                                                                |
| `addClass`<br>Adds CSS classes                   | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | Classes separated by space.<br>_Required._                                                  |                                                                |
| `remClass`<br>Removes CSS classes                | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | Classes separated by space.<br>_Required._                                                  |                                                                |
| `style`<br>Sets style to a element               | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | Object with camelCase or kebab-case properties, and values.<br>_Required._                  |                                                                |
| `setAttr`<br>Sets a attribute                    | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | Attribute name.<br>_Required._                                                              | Attribute value.<br>_Default: true._                           |
| `remAttr`<br>Removes a attribute                 | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | Attribute name.<br>_Required._                                                              |                                                                |
| `trigger`<br>Triggers an event                   | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | Event name.<br>_Required._                                                                  |                                                                |
| `method`<br>Calls a method                       | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | Method.<br>_Required._                                                                      |                                                                |
| `copy`<br>Copies to the clipboard                | Element<sup><a href="#notes">4</a></sup>. Copy its value or innerText<sup><a href="#notes">5</a></sup>.<br>_Required w/o `content`._ | Fallback when `target` is not found or given.<br>_Required w/o `target`._                   |                                                                |
| `paste`<br>Pastes from the clipboard             | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                             | Destination propriety.<br>_Default: value or textContent<sup><a href="#notes">5</a></sup>._ |                                                                |
| `toast`<br>Shows a alert and returns its ID      | URL<sup><a href="#notes">3</a></sup>.<br>_Default: none._                                                                            | Toast text.<br>_Required._                                                                  | Duration in seconds.<br>_Default: 5s._                         |
| `delay`<br>Delays one or a list of actions       |                                                                                                                                      | One or an array of actions.<br>_Required._                                                  | Delay in seconds.<br>_Default: 5s._                            |
| `ignore`<br>Skips.                               |                                                                                                                                      |                                                                                             |                                                                |

#### Toast list format

```html
<ul id="toast-list">
   <li role="alert" class="toast toast-success toast-id-0">
      <a href="[toast.target]" target="_blank">[toast.content]</a>
   </li>
   <li role="alert" class="toast toast-error toast-id-1">[toast.content]</li>
</ul>
```

### Notes

1. **Storage key**  
   A plain-text string that will be sanitized.
1. **Storage value**  
   The content will be `JSON.stringify`.
1. **URL**  
   Expects a valid URL.
1. **Element selector**  
   A CSS selector, such as `#id`, `.class`, `element`, `element[attr=value]`. Affects all matched elements, except for
   `move`, `scroll` and `copy` actions, which affects only the first found. If no element is found, fails silently.
1. **Value or else**  
   Uses the value if the element is an `input`, `output`, `select`, `button`, `option`, or `textarea`.
