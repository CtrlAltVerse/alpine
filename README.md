# CAV Alpine.js Plugin

Includes many features to speed up development of reactive websites, such as `$rest` and `$do`, slightly inspired by HTMX and jQuery.

## Installation

### Via CDN

```html
<!-- CAV Alpine Plugin -->
<script
   defer
   src="https://cdn.jsdelivr.net/npm/@ctrtaltvers/alpine@1.x.x/dist/cdn.min.js"></script>

<!-- Alpine Core -->
<script
   defer
   src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
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

Gets the value of a localStorage item, a sessionStorage item, a cookie, or an element<sup><a href="#notes">5</a></sup>, according to the specified method. Accepts `local`, `session`, `cookie` or `value`. Returns null if the item is not found.  
`$get.value` searches for the first element by name, ID, or CSS selector.

### $range

```ts
$range(end: number, start = 1, step = 1): number[]
```

Returns an array of numbers. `end` sets the last number; `start` sets the first number and `step` defines the incremente between each value.

### $rest

```ts
$rest.METHOD(url, body?: object): Promise<success: boolean; status: number; data: any; headers: object>
```

Makes an HTTP request. The response must be a JSON. The available methods are `get`, `post`, `put`, `patch` and `del`.  
If the response is an array of actions, executes them.  
If the source element is a form, the `body` will be populated with the input names and values of the form. If the method is `get`, the `body` is transferred to the URL as parameters.  
During the request, `.cav-body-loading` will be added to the body, and `.cav-el-loading` to the source element.  
Only one request will be made at a time.

Examples:

```html
<form x-submit.prevent="$rest.post('/send')"></form>
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

Examples:

```html
<button x-on:click="$do('cookie', 'terms-accept', 'yes')">Accept</button>
```

```js
$do([
   {
      action: 'after',
      target: 'body',
      content: '<p id="newP">Lorem ipsum dolor.</p>',
   },
   { action: 'setAttr', target: '#newP', content: 'class', extra: 'truncate' },
])
```

| **Description**                                      | `action`          | `target`                                                                                                                                                                                                                                                               | `content`                                                                                       | `extra`                                                        |
| ---------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Manages a `cookie`                                   | `cookie`          | Key<sup><a href="#notes">1</a></sup>.<br>_Required._                                                                                                                                                                                                                   | Value content<sup><a href="#notes">2</a></sup>.<br>_Required._                                  | Expiration in seconds. If negative, deletes.<br>_Default: 7d._ |
| Manages a `sessionStorage` item                      | `session`         | Key<sup><a href="#notes">1</a></sup>.<br>_Required._                                                                                                                                                                                                                   | Value content<sup><a href="#notes">2</a></sup>.<br>_Required without `extra`._                  | If negative, deletes.<br>_Required without `content`._         |
| Manages a `localStorage` item                        | `local`           | Key<sup><a href="#notes">1</a></sup>.<br>_Required._                                                                                                                                                                                                                   | Value content<sup><a href="#notes">2</a></sup>.<br>_Required without `extra`._                  | If negative, deletes.<br>_Required without `content`._         |
| Goes to an URL                                       | `go`              | URL<sup><a href="#notes">3</a></sup>.<br>_Required._                                                                                                                                                                                                                   |                                                                                                 | Delay in seconds.<br>_Default: 5s._                            |
| Opens an URL in another tab                          | `open`            | URL<sup><a href="#notes">3</a></sup>.<br>_Required._                                                                                                                                                                                                                   |                                                                                                 | Delay in seconds.<br>_Default: 5s._                            |
| Reloads the current page                             | `reload`          |                                                                                                                                                                                                                                                                        |                                                                                                 | Delay in seconds.<br>_Default: 5s._                            |
| Scrolls to an element                                | `scroll`          | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               |                                                                                                 |                                                                |
| Changes the document title                           | `title`           |                                                                                                                                                                                                                                                                        | New title.<br>_Required._                                                                       |                                                                |
| Replaces the text content of all `target`s           | `text`            | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | Text content.<br>_Required._                                                                    |                                                                |
| Replaces the HTML content of all `target`s           | `html`            | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | HTML content.<br>_Required._                                                                    |                                                                |
| Updates the value of all `target`s                   | `value`           | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | New value.<br>_Required._                                                                       |                                                                |
| Adds HTML before (outside) at all `target`s          | `before`          | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | HTML content.<br>_Required._                                                                    |                                                                |
| Adds HTML after (outside) at all `target`s           | `after`           | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | HTML content.<br>_Required._                                                                    |                                                                |
| Adds HTML inside (first) at all `target`s            | `prepend`         | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | HTML content.<br>_Required._                                                                    |                                                                |
| Adds HTML inside (last) at all `target`s             | `append`          | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | HTML content.<br>_Required._                                                                    |                                                                |
| Show all `target`s                                   | `show`            | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               |                                                                                                 |                                                                |
| Hide all `target`s                                   | `hide`            | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               |                                                                                                 |                                                                |
| Removes all `target`s from the DOM                   | `remove`          | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               |                                                                                                 |                                                                |
| Moves a element into a `target`                      | `move`            | Element<sup><a href="#notes">4</a></sup> destination.<br>_Required._                                                                                                                                                                                                   | Element<sup><a href="#notes">4</a></sup> source.<br>_Required._                                 |                                                                |
| Clones a element into all `target`s                  | `clone`           | Element<sup><a href="#notes">4</a></sup> destination.<br>_Required._                                                                                                                                                                                                   | Element<sup><a href="#notes">4</a></sup> source.<br>_Required._                                 |                                                                |
| Add CSS classes to all `target`s                     | `addClass`        | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | CSS classes to add, separated by space.<br>_Required._                                          |                                                                |
| Remove CSS classes from all `target`s                | `removeClass`     | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | CSS classes to remove, separated by space.<br>_Required._                                       |                                                                |
| Styles all `target`s                                 | `style`           | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | Object of CSS properties and values. Accepts camelCase or kebab-case properties.<br>_Required._ |                                                                |
| Creates or updates a attribute in all `target`s      | `setAttribute`    | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | Attribute name.<br>_Required._                                                                  | Attribute value.<br>_Default: true._                           |
| Removes a attribute in all `target`s                 | `removeAttribute` | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | Attribute name.<br>_Required._                                                                  |                                                                |
| Triggers an event in all `target`s                   | `trigger`         | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | Event name.<br>_Required._                                                                      |                                                                |
| Calls a method in all `target`s                      | `method`          | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | Method.<br>_Required._                                                                          |                                                                |
| Copies a content into clipboard                      | `copy`            | Element<sup><a href="#notes">4</a></sup>. Copy its value or innerText<sup><a href                                                                                                                              ="#notes">5</a></sup>.<br>_Required without `content`._ | Text to be copy. Used when `target` is not found.<br>_Required without `target`._               |                                                                |
| Pastes the content from clipboard into all `target`s | `paste`           | Element<sup><a href="#notes">4</a></sup>.<br>_Required._                                                                                                                                                                                                               | Destination propriety.<br>_Default: value or textContent<sup><a href="#notes">5</a></sup>._     |                                                                |
| Shows a toast alert and returns its ID               | `toast`           | URL<sup><a href="#notes">3</a></sup>.<br>_Default: none._                                                                                                                                                                                                              | Toast text.<br>_Required._                                                                      | Duration in seconds.<br>_Default: 5s._                         |
| Delays one or a list of actions                      | `delay`           |                                                                                                                                                                                                                                                                        | One or an array of actions.<br>_Required._                                                      | Delay in seconds.<br>_Default: 5s._                            |
| Skips.                                               | `ignore`          |                                                                                                                                                                                                                                                                        |                                                                                                 |                                                                |

#### Toast list format

```html
<ul id="toast-list">
   <li role="alert" class="toast toast-success toast-index-0">
      <a href="[toast.target]" target="_blank">[toast.content]</a>
   </li>
   <li role="alert" class="toast toast-error toast-index-1">[toast.content]</li>
</ul>
```

### Notes

1. **Storage key**  
   A plain-text string will be sanitized.
1. **Storage content**  
   The content will be `JSON.stringify`.
1. **URL**  
   Expects a valid URL.
1. **Element selector**  
   A CSS selector, such as `#id`, `.class`, `element`, `element[attr=value]`. Affects all matched elements, except for `move`, `scroll` and `copy` actions, which affects only the first found. If no element is found, fails silently.
1. **Value or else**  
   Uses the value if the element is an `input`, `output`, `select`, `button`, `option`, or `textarea`.
