var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../corinagum-ac1-2testv3.zip');
var kuduApi = 'https://corinagum-ac1-2testv3.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$corinagum-ac1-2testv3';
var password = 'FGtsBa9hDsgqABqsxbdgXtH7dlXnTfwujWBbmjDBuQ8d0is8FQNSYbPSl9vw';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('corinagum-ac1-2testv3 publish');
  } else {
    console.error('failed to publish corinagum-ac1-2testv3', err);
  }
});