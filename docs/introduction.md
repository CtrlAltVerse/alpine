# Introduction

[HTMX](https://htmx.org) is a great tool for creating AJAX-driven sites, but it has some limitations.

With the **CAV Alpine Plugin**, in a single [$rest](magics/$rest) call an unlimited number of elements can be update.
You can also [$do](magics/$do) many other types of actions besides updating elements contents.

The actions are received from the server, so you can perform different actions for success and errors cases.

## Implementation Examples

### WordPress

::: code-group

```php [Ajax]
wp_localize_script('main', 'wp', [
   'ajaxUrl' => admin_url( 'admin-ajax.php' )
]);

add_action('wp_ajax_ActionName', 'ajax_action_cb');
add_action('wp_ajax_nopriv_ActionName', 'ajax_action_cb');
function ajax_action_cb(){
   $actions[] = [
      'action'  => 'toast',
      'content' => 'Login with success!',
   ];
   $actions[] = [
      'action'  => 'go',
      'content' => home_url('/dashboard'),
   ];

   wp_send_json_success($actions);
}
```

```php [API]
wp_localize_script('main', 'wp', [
   'apiBase' => get_rest_url(),
]);

function rest_route_callback($request)
{
   $page = $request->get_param('page');

   $actions[] = [
      'action'  => 'append',
      'target'  => '#content',
      'content' => $content,
   ];
   $actions[] = [
      'action' => 'scroll',
      'target' => '#top',
   ];

   return new WP_REST_Response($actions);
}
```

:::

::: code-group

```html [Ajax]
<form x-on:submit.prevent="$rest.post(wp.ajaxUrl)">
   <input type="hidden" name="action" value="ActionName" />
</form>
```

```html [API]
<button x-on:click="$rest.get(wp.apiBase + '/page', {page: 5})">Load page 5</button>
```

:::
