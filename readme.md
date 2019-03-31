# Page-Notifications

Simply library for your page to easily show notifications.

[www.page-notifications.rafalm.com](http://www.page-notifications.rafalm.com)


## Usage

Include **page-notifications.js** and **page-notifications.css** in your project:

```javascript
<link rel="stylesheet" href="page-notifications.css">
<script src="page-notifications.js"></script>
```

and initialize notifications:

```javascript
var notifications = new PageNotifications();
//or with arguments
var notifications = new PageNotifications({'theme':'dark','parentDiv':'divId'});
```
Full list of arguments and methods is avaible at documentation: [www.page-notifications.rafalm.com#docs](http://www.page-notifications.rafalm.com#docs)

Now you can push notifications as you wish:

```javascript
notifications.push("Title","Content","info",false);
```

## Credits

Project build on **MIT** Licence by **Rafał Michałuszek (rafalm99)**

*Website:* [www.rafalm.com](http://www.rafalm.com)


