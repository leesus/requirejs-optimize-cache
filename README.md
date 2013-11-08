# Require.js Optimizer Caching

This is a tool to run after the r.js optimizer that will analyze the packaged files contents, rename the files with an MD5 hash and transform the require config file to remap to the new files. This ensures that you can build the files in a sensible manner and provides a way to invalidate browser cache for changed assets.

## Working currently

At the moment, the script is an npm package that can be run with `node index.js` and a hardcoded directory and config file.  This is currently written as a post build event after the r.js script has done it's thing in ASP.NET.  It will analyse all files in the directory, do the hash renaming and then transform the config, either merging an existing paths object with the new hashed paths, or inserting a path object into the config.

This currently works with a separate config file (not using data-main), ie:
```
<script src="path/to/require.js"></script>
<script>
var config = environment === 'development' ? 'path/to/dev/config' : 'path/to/release/config';

// Requiring a module that needs initialising
require([config], function () {
  require(['jquery', 'controllers/index'], function ($, index) {
    var options = { colour: 'red' };

    $(document).ready(function () {
        index.init(options);
    });
  });
});

// OR

// Requiring a self initialising module
require([config], function(){
  require(['my/module']);
});
</script>
```

## Future plans

- Add tests!
- Documentation
- Make a grunt plugin to first call r.js and then run the transform