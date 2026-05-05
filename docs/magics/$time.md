
# $time

```ts
$time.METHOD‎(): any
```

Utilities about time.

## `.diff(from: number | string, to?: number | string)`

Returns an object with the difference (`amount`) between two timestamps in seconds, minutes, days, weeks, months, or years (`metric`).

`from` and `to` can be timestamp or a strings compatible with `Date.parse()`.

If `to` is not provided, the current time is used.

```html
<span x-text="$time.diff('2024-01-01', '2026-01-10')"></span>
```
