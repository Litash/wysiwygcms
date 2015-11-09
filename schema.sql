drop table if exists entries;
create table entries (
  id integer primary key autoincrement,
  title text not null,
  text text not null
);

drop table if exists contents;
create table contents (
  id integer primary key autoincrement,
  content text not null,
  url text not null
);