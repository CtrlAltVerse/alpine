# $get

```ts
$get.METHOD‎(key?: string): any | Promise<any>
```

Gets the value of a storage item or element according to the specified method:

-  a localStorage item (`local`),
-  a sessionStorage item (`session`),
-  a cookie (`cookie`),
-  an element (`val`),
-  the coordinates (`cords`), or
-  from the clipboard (`cb`).

`val` searches for the first element by name, ID, or CSS selector. Works with `input`, `output`, `select`,
`button`,`option`, or `textarea`.

`cb` and `cords` don't needs a key. Both returns promises, so `await` is required is some contexts.

Returns `null` if the item is not found.

## Usage

```html
<span x-text="$get.local('local-key')"></span>
```

```js
const value = $get.session('session-key')

$get.cookie('cookie-name')

$get.val('id')

$get.cb

await $get.cords()
```
