# $range

```ts
$range‎(end: number | string, start = 1|'A'|'a'|'Alfa', step = 1): number[]|string[]
```

Returns an array of numbers, letters or words from the NATO phonetic alphabet.

## Parameters

-  `end` sets the last number, letter or word.
-  `start` sets the first number, letter or word. Required if `end` is a string not between a-z or A-Z.
-  `step` defines the increment between each value. If `end` is a string, is always 1.

## Usage

```html
<template x-for="n in $range('Zulu')">
   <span x-text="n"></span>
</template>
```
