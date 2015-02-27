CREATE TYPE topic_status  AS ENUM ('enqueue', 'reviewed', 'completed');
CREATE TYPE user_location AS ENUM ('Burbank', 'San Jose', 'Seattle');
CREATE TYPE topic_type AS ENUM('resume', 'image');

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	user_level INT DEFAULT 1 NOT NULL,
	file_name VARCHAR(255) DEFAULT 'anon.png',
	graduation TIMESTAMP NOT NULL,
	location user_location NOT NULL,
	created_at TIMESTAMP DEFAULT NOW() NOT NULL,
	updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE topics (
	topic_id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	title VARCHAR(255) NOT NULL,
	type topic_type NOT NULL,
	status topic_status DEFAULT 'enqueue' NOT NULL,
	description TEXT NOT NULL,
	views INT DEFAULT 0 NOT NULL,
	latest_version INT DEFAULT 1 NOT NULL,
	is_public boolean DEFAULT FALSE NOT NULL,
	created_at TIMESTAMP DEFAULT NOW() NOT NULL,
	updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE files (
	file_id SERIAL PRIMARY KEY,
	topic_id INT NOT NULL,
	version INT DEFAULT 1 NOT NULL,
	key VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW() NOT NULL,
	updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE videos (
	video_id SERIAL PRIMARY KEY,
	topic_id INT NOT NULL,
	user_id INT NOT NULL,
	key VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW() NOT NULL,
	updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE posts (
	post_id SERIAL PRIMARY KEY,
	topic_id INT NOT NULL,
	user_id INT NOT NULL,
	parent_id INT DEFAULT NULL,
	post TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW() NOT NULL,
	updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

ALTER TABLE topics
	ADD FOREIGN KEY (user_id)
	REFERENCES users (user_id);

ALTER TABLE videos
	ADD FOREIGN KEY (topic_id)
	REFERENCES topics (topic_id) ON DELETE CASCADE;

ALTER TABLE videos
	ADD FOREIGN KEY (user_id)
	REFERENCES users (user_id);

ALTER TABLE posts
	ADD FOREIGN KEY (topic_id)
	REFERENCES topics (topic_id) ON DELETE CASCADE;

ALTER TABLE posts
	ADD FOREIGN KEY (user_id)
	REFERENCES users (user_id);

ALTER TABLE files
	ADD FOREIGN KEY (topic_id)
	REFERENCES topics (topic_id) ON DELETE CASCADE;

CREATE FUNCTION my_trigger_function()
RETURNS trigger AS '
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.parent_id := NEW.post_id;
  END IF;
  RETURN NEW;
END' LANGUAGE 'plpgsql';

CREATE TRIGGER my_trigger
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE PROCEDURE my_trigger_function();

INSERT INTO users(name, email, password, user_level, file_name, graduation, location) VALUES ('Michael Choi',    'mike@gmail.com',   '$2a$10$EiFH511e9MLWiT2fvueuVu9x7USM3vsuDixSy/ByMgTBqsuPxH/La', 10, 'user_id.jpg', '2010-01-01 00:00:00', 'Seattle' );
INSERT INTO users(name, email, password, user_level, file_name, graduation, location) VALUES ('Anthony Fenech',  'tony@gmail.com',   '$2a$10$EiFH511e9MLWiT2fvueuVu9x7USM3vsuDixSy/ByMgTBqsuPxH/La', 1,  'user_id.jpg', '2014-09-01 00:00:00', 'San Jose');
INSERT INTO users(name, email, password, user_level, file_name, graduation, location) VALUES ('Alvaro Canencia', 'alvaro@gmail.com', '$2a$10$EiFH511e9MLWiT2fvueuVu9x7USM3vsuDixSy/ByMgTBqsuPxH/La', 1,  'user_id.jpg', '2014-11-01 00:00:00', 'Burbank' );
INSERT INTO users(name, email, password, user_level, file_name, graduation, location) VALUES ('Julian Nguyen',   'julian@gmail.com', '$2a$10$EiFH511e9MLWiT2fvueuVu9x7USM3vsuDixSy/ByMgTBqsuPxH/La', 1,  'user_id.jpg', '2014-09-01 00:00:00', 'San Jose');
INSERT INTO users(name, email, password, user_level, file_name, graduation, location) VALUES ('Jay Patel',       'jay@gmail.com',    '$2a$10$EiFH511e9MLWiT2fvueuVu9x7USM3vsuDixSy/ByMgTBqsuPxH/La', 5,  'user_id.jpg', '2010-01-01 00:00:00', 'Seattle' );

INSERT INTO topics(user_id, type, title, status, description, views, latest_version, is_public) VALUES (2, 'resume', 'DONT DELETE',  'enqueue',   'desc',  3, 1, TRUE);
INSERT INTO topics(user_id, type, title, status, description, views, latest_version, is_public) VALUES (3, 'resume', 'Alvaros resumee',   'enqueue',   'desc', 25, 4, FALSE);
INSERT INTO topics(user_id, type, title, status, description, views, latest_version, is_public) VALUES (3, 'image',  'CICO Wireframe',    'completed', 'desc', 41, 3, TRUE);
INSERT INTO topics(user_id, type, title, status, description, views, latest_version, is_public) VALUES (4, 'resume', 'Juilans Resume',    'completed', 'desc', 48, 5, FALSE);
INSERT INTO topics(user_id, type, title, status, description, views, latest_version, is_public) VALUES (4, 'image',  'Julians portfolio', 'reviewed',  'desc',  9, 3, TRUE);
INSERT INTO topics(user_id, type, title, status, description, views, latest_version, is_public) VALUES (4, 'image',  'Awesome Image',     'reviewed',  'desc', 25, 8, FALSE);

INSERT INTO videos(topic_id, user_id, key) VALUES (1, 1, 'http://v88_fuar.s3.amazonaws.com/1/vid/1425027689928.mp4');
INSERT INTO videos(topic_id, user_id, key) VALUES (2, 1, 'http://v88_fuar.s3.amazonaws.com/1/vid/1425027689928.mp4');
INSERT INTO videos(topic_id, user_id, key) VALUES (3, 1, 'http://v88_fuar.s3.amazonaws.com/1/vid/1425027689928.mp4');
INSERT INTO videos(topic_id, user_id, key) VALUES (1, 1, 'http://v88_fuar.s3.amazonaws.com/1/vid/1425028118211.mp4');

INSERT INTO files (topic_id, version, key) VALUES (1, 1, 'http://v88_fuar.s3.amazonaws.com/1/file/1425027140441.pdf');
INSERT INTO files (topic_id, version, key) VALUES (1, 2, 'http://v88_fuar.s3.amazonaws.com/1/file/1425027483611.pdf');
INSERT INTO files (topic_id, version, key) VALUES (1, 3, 'http://v88_fuar.s3.amazonaws.com/1/file/1425027140441.pdf');
INSERT INTO files (topic_id, version, key) VALUES (2, 1, 'http://v88_fuar.s3.amazonaws.com/1/file/1425027140441.pdf');
INSERT INTO files (topic_id, version, key) VALUES (3, 2, 'http://v88_fuar.s3.amazonaws.com/1/file/1425027140441.pdf');
INSERT INTO files (topic_id, version, key) VALUES (3, 1, 'http://v88_fuar.s3.amazonaws.com/1/file/1425027483611.pdf');
INSERT INTO files (topic_id, version, key) VALUES (4, 2, 'http://v88_fuar.s3.amazonaws.com/1/file/1425027140441.pdf');
INSERT INTO files (topic_id, version, key) VALUES (4, 3, 'http://v88_fuar.s3.amazonaws.com/1/file/1425027483611.pdf');
INSERT INTO files (topic_id, version, key) VALUES (4, 4, 'http://v88_fuar.s3.amazonaws.com/1/file/1425027140441.pdf');

INSERT INTO posts(topic_id, user_id, post, created_at, updated_at) VALUES (1, 2, 'Post 1', '2014-11-01 00:00:00', '2014-11-01 00:00:00');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 3,  1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, post, created_at, updated_at) VALUES (1, 4, 'Post 2.', '2014-11-01 00:00:00', '2014-11-01 00:00:00');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 3,  1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 2,  3, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 2,  3, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 3,  3, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, post, created_at, updated_at) VALUES (1, 4, 'This is Post 3.', '2014-11-01 00:00:00', '2014-11-01 00:00:00');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 3,  1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 4,  8, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 2,  3, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 1,  8, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 2,  8, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, post, created_at, updated_at) VALUES (1, 3, 'This is post 4.', '2014-11-01 00:00:00', '2014-11-01 00:00:00');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 4, 14, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 1, 14, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 4, 14, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 3,  1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
INSERT INTO posts(topic_id, user_id, parent_id, post) VALUES (1, 2,  1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');