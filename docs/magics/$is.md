# $is

```ts
$is.METHOD‎(userAgent?: string): boolean | Promise<boolean>
```

Checks the current device for a characteristic:

-  if an AdBlock is active (`adblock`),
-  if it is a mobile device (`mobile`),
-  if it is a bot (`bot`), or
-  if it has touch support (`touch`).

`bot` and `mobile` can test a custom userAgent, instead of the current one.

`adblock` returns a promise, so `await` is required is some contexts.

> Be aware that none of these checks are 100% reliable due to the nature of user agent detection and browser
> limitations.

## Usage

```html
<span x-show="$is.adblock"></span>
```
