# Getting Started

## Via CDN

```html
<!-- CAV Alpine Plugin -->
<script defer src="https://cdn.jsdelivr.net/npm/@ctrlaltvers/alpine@1/dist/cdn.min.js"></script>
<!-- OR -->
<script defer src="https://unpkg.com/@ctrlaltvers/alpine"></script>

<!-- Alpine Core -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
<!-- OR -->
<script defer src="https://unpkg.com/alpinejs"></script>
```

## Via NPM

```shell
npm install @ctrtaltvers/alpine
```

```js
import Alpine from 'alpinejs'
import cav from '@ctrtaltvers/alpine'

Alpine.plugin(cav)
```