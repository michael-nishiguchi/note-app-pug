CREATE TABLE user_account(
    user_account_id SERIAL UNIQUE NOT NULL PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL
);

CREATE TABLE notes(
    note_id SERIAL UNIQUE NOT NULL PRIMARY KEY,
    title varchar(255) NOT NULL,
    content text NOT NULL,
    date_created TIMESTAMP NOT NULL,
    user_account_id INT REFERENCES user_account (user_account_id)
);

INSERT INTO user_account (email, password) VALUES('email@gmail.com', 'myPass');
INSERT INTO user_account (email, password) VALUES('hash@gmail.com', '$2a$10$QyPeOCXmdbsZdNny87dKYu7ncCfGDdJYpeqJdIZ1lbQjUlTDJrpQG'); 



INSERT INTO notes (title, content, date_created, user_account_id) VALUES('note title', 'this is my note', '4-20-1993', 1);
INSERT INTO notes (title, content, date_created, user_account_id) VALUES('new title', 'Here is a new note to look at', '12-25-2020', 1);

