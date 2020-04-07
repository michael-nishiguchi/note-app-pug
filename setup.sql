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

ALTER TABLE notes ADD COLUMN date_modified NOW();


INSERT INTO notes (title, content, date_created, user_account_id) VALUES('note title', 'this is my note', '4-20-1993', 1);
INSERT INTO notes (title, content, date_created, user_account_id) VALUES('new title', 'Here is a new note to look at', '12-25-2020', 1);

INSERT INTO notes (title, content, user_account_id) VALUES('new title', 'Here is a new note to look at', 1);


INSERT INTO notes (title, content, date_created, user_account_id) VALUES('Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum massa nulla, lobortis ut consectetur id, rutrum sed odio. Aliquam nec velit nec ipsum viverra semper. Phasellus mollis facilisis odio gravida euismod. Aenean rhoncus tempus tincidunt. Donec elit velit, semper ut tellus a, tristique dignissim sem. Fusce est ante, facilisis ac cursus eu, placerat vestibulum dui. Vivamus pharetra non dolor sit amet dictum. Ut sagittis purus malesuada lacus semper, eu mattis ex laoreet. Sed ut eleifend mauris. Quisque bibendum ullamcorper felis, ut sagittis leo rutrum at. Donec vulputate libero purus, vel molestie nisi vulputate et. Nullam nec odio massa. ', '12-25-2020', 1);



select * from notes where user_account_id = 1 order by date_created;
