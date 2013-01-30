var blog_handler = require('punch-blog-content-handler');
var utf8_fix = require('punch-fix-utf8');
var _ = require('lodash');
var fs = require('fs');
var RSS = require('juan-rss');


module.exports = {

  rssConfig: {
    "url": "/rss.xml",
    "html": true
  },

  outputDir: null,

  // Store RSS URL from config.json
  "setup": function setup (config) {
    blog_handler.setup(config);
    this.outputDir = config.output_dir;
    this.rssConfig = _.extend(this.rssConfig, config.blog && config.blog.rss);
  },

  // Create RSS feed
  "run": function run (path, options, cb) {
    if (options.finished) {
      var self = this;
      // Generate rss.xml at the end

      // Monkey-patch "parseContent" to always or never parse
      _blog_parseContent = blog_handler.parseContent;
      var do_parse = !!self.rssConfig.html;
      blog_handler.parseContent = function (path, parse, callback) {
        return _blog_parseContent.call(blog_handler, path, do_parse, callback);
      };

      // Fetch posts
      blog_handler.fetchAllPosts(function (err, posts) {
        // Restore "parseContent"
        blog_handler.parseContent = _blog_parseContent;

        if (err) {
          console.error(err);
          return cb(err);
        }

        // Build RSS
        var rss = initRSS(self.rssConfig);
        Object.keys(posts)
          .map(function (k) {
            return posts[k];
          })
          .sort(function (p1, p2) {
            return p2.published_date - p1.published_date;
          })
          .map(postToItem)
          .forEach(rss.item.bind(rss));

        // Write RSS
        fs.writeFileSync(self.outputDir + self.rssConfig.url, rss.xml());
        console.log('Created', self.rssConfig.url);

        cb();
      });
    }

    else {
      cb();
    }
  }

};


function initRSS (config) {
  return new RSS(_.extend({
    title: config.title,
    description: config.description,
    feed_url: config['site-url'] + config.url,
    site_url: config['site-url'],
    image_url: config.image && config.image.url
  }, config.channel));
}

function postToItem (post) {
  return {
    title:        post.title,
    url:          post.permalink,
    description:  post.content,
    date:         post.published_date
  };
}
