var default_handler = require('punch').ContentHandler;
var blog_handler = require('punch-blog-content-handler');
var utf8_fix = require('punch-fix-utf8');
var _ = require('lodash');
var fs = require('fs');


module.exports = {

  rssConfig: {
    "url": "/rss.xml",
    "html": true
  },

  outputDir: null,

  utf8_fix_hook: false,

  // Store RSS URL from config.json
  "setup": function setup (config) {
    blog_handler.setup(config);
    this.outputDir = config.output_dir;
    this.rssConfig = _.extend(this.rssConfig, config.blog && config.blog.rss);
    // Work with "fix-utf8-hook"
    if (!this.utf8_fix_hook) {
      this.utf8_fix_hook = true;
      var hooks = (config.plugins || {}).generator_hooks || {};
      if (!Object.keys(hooks).some(function (h) { return require(hooks[h]) === utf8_fix })) {
        console.error('WARNING: Plugin "punch-utf8-fix" not found, enable it if you face encoding issues in your RSS file.');
      }
      config.utf8_paths = (config.utf8_paths || []).concat([this.rssConfig.url]);
    }
  },

  // Append RSS URL to content paths
  "getContentPaths": function getContentPaths (basepath, cb) {
    if (basepath === '/') {
      var self = this;
      return blog_handler.getContentPaths(basepath, function (err, paths) {
        paths.push(self.rssConfig.url);
        cb.apply(this, arguments);
      });
    } else {
      return blog_handler.getContentPaths(basepath, cb);
    }
  },

  // RSS is *not* a section
  "isSection": function isSection (basepath) {
    if (basepath === this.rssConfig.url.substring(0, this.rssConfig.url.lastIndexOf('.'))) {
      return false;
    }

    return blog_handler.isSection(basepath);
  },

  // Hook content parsing to force parsing blog posts when generating RSS
  "parseContent": function parseContent (file_path, parse_post, cb) {
    parse_post = this.rssConfig.html || parse_post;
    blog_handler.parseContent(file_path, parse_post, cb);
  },

  // Generate RSS with same data as archives
  "negotiateContent": function negotiateContent (basepath, ext, options, cb) {
    if (basepath + ext === this.rssConfig.url) {
      var self = this;
      return blog_handler.getPosts(basepath, function(err, posts, last_modified) {
        if (err) return cb(err);

        var contents = _.extend({
          "title": "Newsfeed"
        }, self.rssConfig, posts, {
          "is_post": false
        });

        return default_handler.getSharedContent(function(err, shared_content, shared_modified_date) {
          if (err) return cb(err);
          contents = _.extend(contents, shared_content);
          if (shared_modified_date > last_modified) {
            last_modified = shared_modified_date;
          }
          contents.lastModified = last_modified;

          return cb(null, contents, options, last_modified);
        });
      });
    }

    return blog_handler.negotiateContent(basepath, ext, options, cb);
  },

  // Some inherited method to expose
  "getPosts": blog_handler.getPosts.bind(blog_handler),
  "getSections": blog_handler.getSections.bind(blog_handler)
};
