var AWS   = require('aws-sdk');
AWS.config.loadFromPath('./config/aws_auth.json');
var s3 = new AWS.S3();

module.exports = {
  add_file : function(file, key, callback){
    var params = {
      Body: file,
      Bucket: 'v88_fuar',
      ACL:'public-read',
      Key: key
    }

    s3.putObject(params, function(err) {
      if (err) {throw err;}
      callback(err === null);
    });
  }, delete_topic : function(topic_id){

    params = {
      Bucket: 'v88_fuar',
      Prefix: topic_id + '/'
    }

    s3.listObjects(params, function(err, data) {
      if (err) return console.log('No objects in bucket in s3' + err);
      params = {Bucket: 'v88_fuar'};
      params.Delete = {};
      params.Delete.Objects = [];

      data.Contents.forEach(function(content) {
        params.Delete.Objects.push({Key: content.Key});
      });

      s3.deleteObjects(params, function(err, data) {
        if (err) return console.log('no objects in that location' + err);
      });
    });
  }
}