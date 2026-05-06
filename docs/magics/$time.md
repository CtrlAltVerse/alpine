
# $time

```ts
$time.METHOD‎(): any
```

Utilities about time.

## `.diff(from: number | string, to?: number | string)`

Returns an object with the difference (`amount`) between two timestamps in seconds, minutes, days, weeks, months, or years (`metric`).

`from` and `to` can be timestamp or a string compatible with `Date.parse()`.

If `to` is not provided, the current time is used.

```html
<span x-text="$time.diff('2024-01-01', '2026-01-10')"></span>
```

## `.plus(from: number | string, amount: number, metric?: string)`

Adds the `amount` to the timestamp `from`, according to the specified `metric` (seconds, minutes, days, weeks, months, or years).

`from` can be timestamp or a string compatible with `Date.parse()`.

If `metric` is not provided, `days` is used.

```html
<span x-text="$time.plus('2024-01-01', 26, 'months')"></span>
```
