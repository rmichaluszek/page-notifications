# Page-Notifications

Simply library for your page to easly show notifications of any sort.
[www.page-notifications.rafalm.com](www.page-notifications.rafalm.com)


## Usage

Include **page-notifications.js** and **page-notifications.css** in your project:

```
<link rel="stylesheet" href="page-notifications.css">
<script src="page-notifications.js"></script>
```

and initialize notifications:

```
var notifications = new PageNotifications();
//or with arguments
var notifications = new PageNotifications({'theme':'dark','parentDiv':'divId'});
```
*Full list of arguments and methods is avaible at documentation:* - [www.page-notifications.rafalm.com#docs](www.page-notifications.rafalm.com#docs)

Now you can push notifications as you wish:

```
notifications.push("Title","Content","info",false);
```

## Credits

Project build on **MIT** Licence by **Rafał Michałuszek (rafalm99)**
*Website:* [www.rafalm.com](www.rafalm.com)


