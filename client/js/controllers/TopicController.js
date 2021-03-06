//[TopicController is used to view topics]
app.controller('TopicController', [ '$scope', '$location', '$rootScope', 'PageFactory', 'TopicFactory', 'UserFactory', function($scope, $location, $rootScope, PageFactory, TopicFactory, UserFactory) {
  //reroute to root if not logged in
  UserFactory.check_session(function(logged){
    if (logged){
      //obj to hold for all scope variables
      var topic_id = _.last($location.path().split('/'));

      $scope.app = {};
      $scope.app.settings = {
        //default page settings and $rootScope variables
        user_level  : $rootScope.user.user_level
        , user_id   : $rootScope.user.user_id
        , file_name : $rootScope.user.file_name
        , isVideo   : false
        , message   : null
      };

      $scope.app.forms = {
         video : { name : 'Select File' }
        , file : { name : 'Select File' }
      };


      $scope.app.uploads = {
        up_video:{
          name : $scope.app.forms.video.name
        },
        up_file:{
          name : $scope.app.forms.file.name
        }
      };


      $scope.app.functions = {

          mark_complete: function(){
          //change topic status to complete
          TopicFactory.update_status(topic_id, {status: 'completed'}, function(has_err, data){
            $scope.app.settings.message = data;
            $scope.app.topic.stats.status = 'completed';
          });

        }, showVideo: function(page) {
          //toggle switch for video/pdf switch
          $scope.app.settings.isVideo = (page == 'pdf' ? false : true );

        }, add_post: function(index, parent_id, text){

          //add post topic_id (for post url, parent_id, comment)
          TopicFactory.add_post(topic_id, {parent_id: parent_id, text: text}, function(has_err, data){
            if (!has_err){
              //set post object
              var post = {
                file_name : $scope.app.settings.file_name
                , name : $rootScope.user.name
                , parent_id : (index === null ? data.post_id : parent_id)
                , post : text
                , post_id : data.post_id
                , created_at : new Date().toISOString()
                , updated_at : new Date().toISOString()
                , user_id : $scope.app.settings.user_id
              };
              //if index is null creat new post else add comment to correct post/comment
              if ( index === null ){
                // add post at first position of posts and erase post input
                $scope.app.topic.posts.unshift(post)
                $scope.app.forms.post = '';
              } else {
                // add comment to 1 post after comment box
                $scope.app.topic.posts.splice(index+1, 0, post);
                $scope.app.forms.comment[index] = '';
              }
            } else {
              //display error message
              $scope.app.settings.message = data;
            }
          });
        }, update_privacy: function(input){
          //method for admin to update privacy

          //check if form is already at new wanted state
          if ( $scope.app.topic.stats.is_public != input ){
            //check if user is an admin or the creator of the topic
            if ( $scope.app.settings.user_level >= 5 || ($scope.app.settings.user_id === $scope.app.topic.stats.user_id )){
              //update privacy setting
              TopicFactory.privacy(topic_id, function(has_err, data){
                //if no errors occured switch public state or get rid of button
                if (has_err === false ){
                  $scope.app.topic.stats.is_public = input;
                }
                //display message
                $scope.app.settings.message = data;
              });
            }
          }
        }, submitForm: function(valid, form){
           //testing to see if this works
          if (valid){
            if (form === 'video' && $scope.app.forms.video.size !== undefined ){
              //upload video response
//              $scope.app.forms.video.name = '<i class="fa fa-circle-o-notch fa-spin"></i>'
              TopicFactory.add_video(topic_id, $scope.app.forms.video, function(has_err, data){
                //display message
                $scope.app.topic.videos.push({key: data.key})
                $scope.app.topic.show_video = $scope.app.topic.videos.length - 1;
                $scope.app.settings.message = data.msg;
//                $scope.app.forms.video.name = 'Upload Complete';
              });
            } else if (form === 'file' && $scope.app.forms.file.size !== undefined ){
              //upload file revision
              $scope.app.uploads.up_file.name = 'Loading...';
              TopicFactory.add_file(topic_id, $scope.app.forms.file, function(has_err, data){
                //add topic to page and display message
                $scope.app.topic.files.push({key: data.key, type: data.type})
                $scope.app.settings.message = data.msg;
              });
            } else {
              $scope.app.forms.file.name = 'no file chosen';
              $scope.app.forms.file.name = 'no file chosen';
            }
          }

        }, delete_topic: function(topic_id){
          TopicFactory.delete_topic(topic_id, function(has_err, data){
            if (!has_err){  $location.url('/dashboard'); }
          })

        }, switch_video: function(index){
          //Switch video_path based on button pressed
          $scope.app.topic.show_video = index;

        }, switch_file: function(index){
          //Switch file_path based on button pressed
          $scope.app.topic.show_file = index;

        }, log_out: function(){
          //log out function
          UserFactory.log_out();
        }
      }

      //topic information for files, videos, posts, and stats or set error message
      PageFactory.view_topic(topic_id, function(has_err, data){
        if (!has_err){
          $scope.app.topic = {
                 posts : data.comments //array of object data
            ,    stats : data.stats  //object of topic info
            ,    files : data.files  //array of object data
            ,   videos : data.videos //array of object data
            , topic_id : topic_id
          };

          //set video path to last video or null
          $scope.app.topic.show_video = $scope.app.topic.videos.length > 0 ? $scope.app.topic.videos.length - 1  : null;
          $scope.app.topic.show_file = $scope.app.topic.files.length - 1;
        } else {
          $scope.app.settings.message = data;
        }
      });
    }
  });
}]);