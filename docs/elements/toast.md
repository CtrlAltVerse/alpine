# Toast

The action `toast` creates an alert inside a list that requires styling.

```js
const toastID = $do('toast', 'Link', 'Text', 10)
```

## DOM Structure

```html
<ul id="toasts">
   <li role="alert" class="toast toast-success toast-id-0">
      <a href="[toast.target]" target="_blank">[toast.content]</a>
   </li>
   <li role="alert" class="toast toast-error toast-id-1">[toast.content]</li>
</ul>
```

## Tailwind Styling

```css
@import 'tailwindcss';
@import '@ctrlaltvers/alpine/dist/toast.css';
```
