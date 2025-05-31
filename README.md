# CAV Alpine.js Plugin

## Magics

### **$copy(text)**

Copy `text` to the clipboard. Only works in SSL ambients.

### **$rest.METHOD(url, ?body)**

Make a request. If the response is an array of actions, execute them. Only one request will be made at a time.  
The available methods are: `get`, `post`, `put`, `patch` and `delete`.  
`body` must be an object. If the element is a form, the `body` will be populated with the inputs names and values. If the method is `get`, the `body` will be transferred to the URL as parameters.  
During the request, `.cav-body-loading` will be added to the body, and `.cav-el-loading` to the source element.

Example:

```html
<form x-submit.prevent="$rest.post('/send-form')"></form>
```

```js
$rest.post('/send-form').then((response) => {
   response.success // true if statusCode is 2XX or 3XX.
   response.data // response of the request, usually action[].
})
```

### **$action(action: enum|action[], target?: string, content?: any, duration?: number)**

Do a single or an array of actions, as explain below.

Example:

```html
<button x-on:click="$action('cookie','terms-accept', 'yes')">Accept</button>
```

```js
$action([
   {
      action: '',
      target: '',
      content: '',
      duration: '',
   },
])
```

| **Description**                                      | `action`\*        | `target`                             | `content`                                                            | `duration`                                                                        |
| ---------------------------------------------------- | ----------------- | ------------------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Creates, updates, or deletes a `cookie`              | `cookie`          | The cookie key. Required.            | The cookie value (will be `JSON.stringify`). Required.               | Sets the expiration in seconds. Use a negative value for delete. Default: 7 days. |
| Creates, updates, or deletes a `sessionStorage` item | `session`         | The session storage key. Required.   | The session storage value (will be `JSON.stringify`). Required.      | Use a negative value to delete. Default: none.                                    |
| Creates, updates, or deletes a `localStorage` item   | `local`           | The local storage key. Required.     | The local storage value (will be `JSON.stringify`). Required.        | Use a negative value to delete. Default: none.                                    |
| Reloads the current page                             | `reload`          |                                      |                                                                      | Sets a delay in seconds. Default: 5 seconds.                                      |
| Goes to a URL                                        | `go`              |                                      | URL. Required.                                                       | Sets a delay in seconds. Default: 5 seconds.                                      |
| Opens a URL in another window/tab                    | `open`            |                                      | URL. Required.                                                       | Sets a delay in seconds. Default: 5 seconds.                                      |
| Delays one or a list of actions                      | `delay`           |                                      | One or an array of actions. Required.                                | Sets the delay in seconds. Default: 5 seconds.                                    |
| Changes the document title.                          | `title`           |                                      | The new title. Required.                                             |                                                                                   |
| Show a toast alert, without styling.                 | `toast`           | Toast link. Default: none.           | Toast text. Required.                                                | Duration of the toast in seconds. Default: 5 seconds.                             |
| Scrolls to the first element found                   | `scroll`          | Selector for the element. Required.  |                                                                      |                                                                                   |
| Triggers a event in the all elements                 | `trigger`         | Selector for the elements. Required. | Event name. Required.                                                |                                                                                   |
| Adds HTML after (outside) all elements               | `after`           | Selector for the elements. Required. | HTML content. Required.                                              |                                                                                   |
| Adds HTML before (outside) all elements              | `before`          | Selector for the elements. Required. | HTML content. Required.                                              |                                                                                   |
| Adds HTML inside (last) all elements                 | `append`          | Selector for the elements. Required. | HTML content. Required.                                              |                                                                                   |
| Adds HTML inside (first) all elements                | `prepend`         | Selector for the elements. Required. | HTML content. Required.                                              |                                                                                   |
| Replaces the content of all elements with text       | `text`            | Selector for the elements. Required. | Text content. Required.                                              |                                                                                   |
| Replaces the content of all elements with HTML       | `html`            | Selector for the elements. Required. | HTML content. Required.                                              |                                                                                   |
| Show all elements, removing `.d-none` and `.hidden`  | `show`            | Selector for the elements. Required. |                                                                      |                                                                                   |
| Hide all elements, adding `.d-none` and `.hidden`    | `hide`            | Selector for the elements. Required. |                                                                      |                                                                                   |
| Remove CSS classes to all elements                   | `removeClass`     | Selector for the elements. Required. | List of CSS classes to remove, separated with ` ` (space). Required. |                                                                                   |
| Add CSS classes to all elements                      | `addClass`        | Selector for the elements. Required. | List of CSS classes to add, separated with ` ` (space). Required.    |                                                                                   |
| Creates or updates a attribute in all elements       | `setAttribute`    | Selector for the elements. Required. | Attribute key/name and value, in `key=value` format. Required.       |                                                                                   |
| Removes a attribute in all elements                  | `removeAttribute` | Selector for the elements. Required. | Attribute key/name. Required.                                        |                                                                                   |
| Removes all elements from the DOM                    | `remove`          | Selector for the elements. Required. |                                                                      |                                                                                   |
| Skip.                                                | `ignore`          |                                      |                                                                      |                                                                                   |
