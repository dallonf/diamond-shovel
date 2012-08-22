# dpd assets

compile assets on the server for every request... no need to run watch scripts.

## install

In your projects root directory run

  mkdir node_modules
  npm install dpd-assets
  
## less

After creating the instance from your dashboard, go into `/my-project/resources/assets` and create a `less` directory. Now any file in that directory will be compiled to CSS when requested from a browser.

For example

    <link href="/assets/less/bootstrap.less" rel="stylesheet">
    
## other files

As of 0.0.1 all other files will just pass through including JS, and images. In future versions, these assets will be compiled. You'll be able to configure how in the dashboard.