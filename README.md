punch-blog-rss-content-handler
==============================

Generate your RSS file along with Punch blog content handler.

This plugin is intended to work with [punch blog content handler](https://github.com/laktek/punch-blog-content-handler).

## Installation

```
npm install punch-blog-rss-content-handler
```

### Note about dependencies

This will install following packages as **peer dependencies** (directly in **your** node_modules directory):

* [punch](https://github.com/laktek/punch) as it will use its default content handler
* [punch-blog-content-handler](https://github.com/laktek/punch-blog-content-handler) as it's a side-kick for this plugin
* [punch-utf8-fix](https://github.com/naholyr/punch-utf8-fix) as you may face encoding issues generating a `.xml` file using content handler

## Usage

In your `config.json`:

```json
{
  "plugins": {
    "content_handler": "punch-blog-rss-content-handler",
    "generator_hooks": {
      "fix_utf8": "punch-utf8-fix"
    }
  },

  "blog": {
    "rss": {
      // RSS configuration
    }
  }
}
```

## Configuration

Here are the different options you can set in `config.blog.rss`:

```javascript
{
  // If set to true, this will embed a parsed version of your blog contents
  // If false, it will simply take the brut markdown
  "html": false,

  // Final URL for your RSS file
  "url": "/rss.xml",

  // URL of your website
  "site-url": "http://…",

  // Title and description of your RSS feed
  "title": "",
  "description": "",

  // Additional tag you would want to add in <channel> section
  "channel": [
    // Default is empty, here are some examples:
    // {"tag": "language",  "content": "en"},
    // {"tag": "copyright", "content": "Nicolas Chambrier"},
    // {"tag": "ttl",       "content": 1440}
  ],

  // Logo of your RSS feed (default is no image)
  "image": {
    // URL to the image (should be publicly accessible)
    "url": "http://…",
    // Link the image points to (should be the same value as site-url)
    "link": "http://…"
  }
}
```

## Template

Create your template file accordingly to your `config.blog.rss.url` option. Default will be `templates/rss.mustache`, but if you defined "url" as "/blog/my-rss.xml" it will be `templates/blog/my-rss.mustache`. That simple.

You should copy and customize the provided `rss.mustache` (at root of this module), which is quite generic.
