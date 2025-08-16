# x-login

Loads the respective SDK and render the sign in button.

```html
<button type="button" x-login:google="[client_id]" data-redirect="[url]"></button>
```

## Attributes

Attributes for personalization and flow can be set according to the respective documentation.

### Sign In With Google

See all in [Google Documentation](https://developers.google.com/identity/gsi/web/reference/html-reference).

Set the `client_id` without `.apps.googleusercontent.com`.

```html
<button x-login:google="[client_id]" data-redirect="[url]" data-theme="filled_black"></button>
```

### Facebook Login Button

See all in [Facebook Documentation](https://developers.facebook.com/docs/facebook-login/web/login-button).

```html
<button
   x-login:facebook="[app_id]"
   data-button-type="continue_with"
   data-size="medium"
   data-layout="rounded"></button>
```

### Sign in with Apple JS

See all in
[Apple Documentation](https://developer.apple.com/documentation/signinwithapple/configuring-your-webpage-for-sign-in-with-apple).

```html
<button
   x-login:apple="[client_id]"
   data-redirect="[url]"
   data-color="black"
   data-border="true"
   data-type="sign in"
   data-state=""
   data-nonce=""></button>
```

## Modifiers

### .init

Executes on render, instead on click.

```html
<template x-if="show">
   <button x-login:google.init="[client_id]" data-redirect="[url]" data-theme="filled_black"></button>
</template>
```
