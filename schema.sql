drop table if exists Site;
create table Site (
    id integer primary key autoincrement,
    name text not null,
    title text not null,
    url text not null
);

drop table if exists Menu;
create table Menu (
    id integer primary key autoincrement,
    siteName text not null,
    idx integer not null,
    item text not null,
    url text not null
);

drop table if exists Content;
create table Content(
    id integer primary key autoincrement,
    url text not null,
    content text not null
);

drop table if exists Content;
create table Content (
    id integer primary key autoincrement,
    content text not null,
    url text not null
);

drop table if exists SidePanel;
create table SidePanel (
    id integer primary key autoincrement,
    url text not null,
    item text not null
);

drop table if exists User;
create table User (
    id integer primary key autoincrement,
    username text not null,
    password text not null,
    role text not null
);

drop table if exists LoginLog;
create table LoginLog(
    id integer primary key autoincrement,
    dateTime DATETIME not null,
    username text,
    dept text,
    role text
);