# $rest

```ts
$rest.METHOD‎(url: string, body?: object = {}): Promise<$RestResponse>

interface $RestResponse {
   success: boolean // true if statusCode is 2XX or 3XX.
   status: number // statusCode
   data: any // body, usually action[].
   headers: object // headers
}
```

Makes an HTTP request and started a View Transition. Both the payload and response must be in JSON format. The
available methods are `get`, `post`, `put`, `patch` and `del`.

If the response is an array of actions ([see $do](/magics/$do)), executes them.

If the source element is a form, the `body` will be populated with the input names and values of the form. If the
method is `get`, the `body` is transferred to the URL as parameters.

During the request, `.cav-body-loading` will be added to the body, and `.cav-el-loading` to the source element.

Only one request will be made at a time.

## Usage

```html
<form x-submit.prevent="$rest.post(wp.ajaxUrl)">
   <input type="hidden" name="action" value="handleSubmitForm" />
</form>
```

```js
$rest.put('/update', { avatar: 23 }).then((response) => {})
```
