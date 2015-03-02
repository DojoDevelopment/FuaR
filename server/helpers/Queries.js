module.exports = {

  user : {
    insert : 'INSERT INTO users(name, email, location, password, graduation)'
              + ' VALUES ($1, $2, $3, $4, $5)'
              + ' RETURNING user_id, file_name'
    ,

    select : {
      user_id_from_topic : 'SELECT user_id FROM topics WHERE topic_id = $1'
      , email_by_id      : 'SELECT email FROM users WHERE user_id = $1'
      , login            : 'SELECT user_id, password, user_level, file_name'
                         + ' FROM users'
                         + ' WHERE email = $1'

      , stats            : 'SELECT name, file_name, graduation, location'
                         + ' FROM users'
                         + ' WHERE user_id = $1'

      , user_count       : 'SELECT COUNT(user_id) FROM users WHERE email = $1'
      , all_users        : 'SELECT user_id, name, email, user_level, graduation'
                         + ' FROM users'
                         + ' WHERE user_id <> $1'
                         + ' ORDER BY user_id'

    },

    update : {

      user_level : 'UPDATE users SET user_level = $1 WHERE user_id = $2'
      , password : 'UPDATE users SET password = $1 WHERE user_id = $2'
      ,    email : 'UPDATE users SET email = $1 WHERE user_id = $2'
      ,      pic : 'UPDATE users SET file_name = $1 WHERE user_id = $2'
    }
  },

  topic : {

    insert : {
      comment : 'INSERT INTO posts (topic_id, user_id, post, parent_id) VALUES ($1, $2, $3, $4) RETURNING post_id'
       , post : 'INSERT INTO posts (topic_id, user_id, post) VALUES ($1, $2, $3) RETURNING post_id'
      , topic : 'INSERT INTO topics (user_id, type, title, description) VALUES ($1, $2, $3, $4) RETURNING topic_id'
      , video : 'INSERT INTO videos (topic_id, user_id, key) VALUES ($1, $2, $3)'
      , file  : 'INSERT INTO files (topic_id, key, type) VALUES ($1, $2, $3)'
    },

    select : {
        videos: 'SELECT key FROM videos WHERE topic_id = $1 ORDER BY video_id ASC'
      , stats : 'SELECT user_id, is_public, views, status, description FROM topics WHERE topic_id = $1'
      , files : 'SELECT files.key, files.type FROM files WHERE topic_id = $1 ORDER BY files.created_at'
      , posts : 'SELECT posts.post_id, posts.user_id, posts.parent_id, users.user_level, users.name, users.file_name, posts.created_at, posts.updated_at, users.graduation, posts.post'
              + ' FROM posts'
              + ' LEFT JOIN users ON posts.user_id = users.user_id'
              + ' WHERE topic_id = $1'
              + ' ORDER BY parent_id DESC, created_at ASC'
    },

    update : {
        version : "UPDATE topics SET latest_version = latest_version + 1, status='enqueue', updated_at=NOW() WHERE topic_id = $1"
      , privacy : 'UPDATE topics SET is_public = $1 WHERE topic_id = $2'
      , status  : 'UPDATE topics SET status = $1 WHERE topic_id = $2'
      , video   : "UPDATE topics SET status='reviewed', updated_at=NOW() WHERE topic_id = $1"
      , views   : 'UPDATE topics SET views = views + 1 WHERE topic_id = $1'
    },

    delete : { topic : 'DELETE FROM topics WHERE topic_id = $1' }
  },

  page : {

    dashboard : function(filter){
      query = 'SELECT topics.topic_id, topics.title, users.name AS user, users.user_id, topics.description, topics.created_at, topics.updated_at, topics.views, topics.latest_version, topics.type, topics.status'
            + ' FROM topics'
            + ' LEFT JOIN users ON users.user_id = topics.user_id';
      query += (filter === true ? ' WHERE topics.is_public = TRUE' : '');
      return query;
    },

    profile : function(filter){
      query =  'SELECT topics.topic_id, topics.title, topics.description, topics.views, topics.type, topics.latest_version, topics.is_public, topics.created_at, topics.status, topics.updated_at, count(videos) AS videos, count(posts) AS posts'
            +  ' FROM topics'
            +  ' LEFT JOIN videos ON videos.topic_id = topics.topic_id'
            +  ' LEFT JOIN posts ON posts.topic_id = topics.topic_id'
            +  ' WHERE topics.user_id = $1';
      query +=  ( filter === true ? ' AND topics.is_public = TRUE' : '');
      query += ' GROUP BY topics.topic_id, topics.title, topics.description, topics.created_at, topics.updated_at, topics.views, topics.latest_version'
            +  ' ORDER BY topics.topic_id';
      return query;
    }
  }
}