-- Active: 1679099674699@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

SELECT *  from users;
INSERT INTO users (id, name, email, password, role)
VALUES
	("u001", "joão", "joão@email.com", "joão", "NORMAL"),
	("u002", "josé", "josé@email.com", "jospe", "NORMAL"),
	("u003", "maria", "maria@email.com", "maria", "ADMIN");

CREATE TABLE posts (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
creator_id TEXT NOT NULL,
content TEXT NOT NULL,
replys INTEGER DEFAULT (0) NOT NULL,
   likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id)
  ON DELETE CASCADE 
  ON UPDATE CASCADE
    );
    DROP TABLE posts;

    INSERT INTO posts (id, creator_id, content )
VALUES 
 ("p001", "u001", "chuvaImg"),
 ("p002", "u002", "cachorroImg"),
  ("p003", "u003", "parqueImg");

select * from posts;
    
CREATE TABLE likes_dislikes (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE CASCADE 
  ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id)
  ON DELETE CASCADE 
  ON UPDATE CASCADE
);
CREATE TABLE counts (
  userId TEXT NOT NULL,
  postId TEXT NOT NULL,
  reply INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id)
  ON DELETE CASCADE 
  ON UPDATE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts (id)
  ON DELETE CASCADE 
  ON UPDATE CASCADE
);
select * from  count;


INSERT INTO likes_dislikes (user_id, post_id, like)
 VALUES("u002", "p001", 1),
    ("u003", "p001", 1),
    ("u002", "p002", 1),
    ("u003", "p002", 1),
    ("u001", "p003", 1),
    ("u003", "p003", 0);

UPDATE posts
SET likes = 2
WHERE id = "p001";

UPDATE posts
SET likes = 2
WHERE id = "p002";

UPDATE posts
SET likes = 1
WHERE id = "p003";

UPDATE posts
SET dislikes = 1
WHERE id = "p003";

CREATE TABLE replys (
id TEXT PRIMARY KEY UNIQUE NOT NULL,
post_id TEXT,
creator_id TEXT NOT NULL,
content TEXT NOT NULL,
  likes INTEGER DEFAULT (0) NOT NULL,
  dislikes INTEGER DEFAULT (0) NOT NULL,
   created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
FOREIGN KEY (creator_id) REFERENCES users (id)
 ON DELETE CASCADE 
  ON UPDATE CASCADE,
FOREIGN KEY (post_id) REFERENCES posts (id) 
ON DELETE CASCADE 
ON UPDATE CASCADE
);
DROP Table replys;

SELECT * FROM replys;

CREATE TABLE replys_likes_dislikes (
  user_id TEXT NOT NULL,
  reply_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE CASCADE 
  ON UPDATE CASCADE,
  FOREIGN KEY (reply_id) REFERENCES replys (id)
  ON DELETE CASCADE 
  ON UPDATE CASCADE
);