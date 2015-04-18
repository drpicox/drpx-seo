drpx-seo
========

A simple tool to enable SEO in AngularJS apps.

Nowadays google is able to perform SEO in AngularJS apps, but to do so there are the following requirements:

- each page should inform an specific title, descripcion and keywords
- fragment should be reported
- hashbang should be used in virtual urls (angular routes)
- a special angular redirection for query param _escaped_fragment_ should be enabled
- in google web master tools _escaped_fragment_ should be declared as relevant to be fetched al lines

This library gives few tools to ease angular SEO.



How to setup
------------

Install the bower library.

```bash
    $ bower install --save drpx-seo
```

Include drpx-seo dependence in your project

```html
    <script src="bower_components/drpx-seo/drpx-seo.js"></script>
```

Add drpxSeo module to your project.

```javascript
    angular.module('yourApp',['drpxSeo']);
```

Make sure that your ng-app is defined at `<html>` level so it includes `<head>` tag:

```html
    <html ng-app="yourApp" ng-strict-di>
        <head>
            ...
        </head>
        <body>
            ...
        </body>
    </html>
```

Make sure that you have at least the following tags inside `<head>`:

```html
    <head>
        <title>Your basic title</title>
        <meta name="description" content="Your basic description.">
        <meta name="keywords" content="your,basic,keywords">
        <meta name="fragment" content="!">
        ...
    </head>
```

  Note: that it assumes that you are using the ! fragment.

Enable in google web master tools ( https://www.google.com/webmasters ), in Crawl > Url Parameters, _escaped_fragment_ to crawl **every page**.

![Google Web Master Tools Crawl](./gmt-crawl.png)
![Google Web Master Tools Parameters](./gmt-urlparameters.png)



How to use
----------

For each route, add a pesonalized title, description and keywords:

- Example 1, use route definition:

```javascript
    $routeProvider.when('/posts', {
        controller: PostsController,
        controllerAs: 'vm',
        resolve: {
            posts: 'PostsResolver',
        },
        templateUrl: 'posts.tpl.html',
        title: 'My Web - Posts list',
        description: 'An awesome list of my posts',
        keywords: 'awesome,posts,myweb,mytheme,cool',
    });
```

- Example 2, use route definition with interpolation:

```javascript
    $routeProvider.when('/posts/:postId', {
        controller: PostController,
        controllerAs: 'vm',
        resolve: {
            post: 'PostResolver',
        },
        templateUrl: 'post.tpl.html',
        title: 'My Web - {{post.title}}',
        description: '{{post.description}}',
        keywords: '{{post.tags.join(",")}},awesome,myweb,post',
    });
```

- Example 3, use page controller to modify current route:

```javascript
    /* ngInject */
    function DishesController($route) {
        $route.current.title = 'My Restaurant - Tasty dishes';
        $route.current.description = 'List of all dishes served in the restaurant';
        $route.current.keywords = ['dishes','list','restaurant'];
    }
```

Use in your urls the `!` fragment:

```html
    <a href="#!/posts">Posts</a>
```
