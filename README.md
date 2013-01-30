punch-rss-generator
===================

Generate your RSS file along with Punch blog content handler.

This plugin is intended to work with [punch blog content handler](https://github.com/laktek/punch-blog-content-handler).

## Installation

```
npm install punch-rss-generator
```

### Note about dependencies

This will install following packages as **peer dependencies** (directly in **your** node_modules directory):

* [punch](https://github.com/laktek/punch) as it will use its default content handler
* [punch-blog-content-handler](https://github.com/laktek/punch-blog-content-handler) as it's a side-kick for this plugin

## Usage

In your `config.json`:

```json
{
  "plugins": {
    "generator_hooks": {
      "rss_generator": "punch-rss-generator"
    }
  },

  "blog": {
    "rss": {
      // RSS configuration
    }
  }
}
```

The RSS file will be created at generation time. As generators **are not called** by `punch server` you'll have to call `punch generate` to see it built.

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
  "channel": {
    // Default is empty, here are some examples:
    // "language":  "en",
    // "copyright": "Nicolas Chambrier",
    // "ttl":       1440
  ],

  // Logo of your RSS feed (default is no image)
  "image": "http://…"
}
```
