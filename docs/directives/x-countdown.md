# x-countdown

Creates a countdown timer.

Automatically replaces `%sec` with the remaining seconds. If the element is empty, only the counting number will be
shown.

Use `:number` to set the starting time in seconds (default is 5).

If a value is provided to the attribute, it will be executed when the countdown reaches zero.

```html
<div x-countdown:13="console.log('Countdown ended')"></div>
```

## Modifiers

### .repeat

When the countdown reaches zero, it restarts.

```html
<div x-countdown:30.repeat="console.log('Ping')">New ping in %sec.</div>
```

### .invisible

Does not update or show the counting number.

```html
<div x-countdown.invisible="console.log('Stills ping')">Never change %sec</div>
```

### .destroy

Removes the element from the DOM when the countdown reaches zero. Can't be used with `.repeat`.

```html
<div x-countdown.destroy>This element will desapear in %sec seconds.</div>
```
