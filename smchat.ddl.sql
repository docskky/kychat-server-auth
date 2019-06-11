/*
 * > 아이폰의 emojis 캐릭터 오류 문제 해결을 위해 utf8mb4를 적용
 * https://mathiasbynens.be/notes/mysql-utf8mb4
 */
create database kyuser character set=utf8mb4;

CREATE USER 'kiyong'@'localhost' IDENTIFIED BY '12345';
grant all privileges on kyuser.* to 'kiyong'@'localhost';

drop table if exists kyuser.chatuser;
create table kyuser.chatuser (
	`id` varchar(20) NOT NULL primary key, /* 사용자 id */
	`password` varchar(100),
	`name` varchar(80),
	`os` tinyint,
	`fcm_token` varchar(200),
	`badge` int,
	`session_token` varchar(200),
	`thumbnail` varchar(200),
	`image` varchar(200),
	`longitude` double,
	`latitude` double
) character set = utf8mb4;

drop table if exists kyuser.chatfriend;
create table kyuser.chatfriend (
	`id` varchar(20) NOT NULL, /* 사용자 id */
	`friend_id` varchar(20) NOT NULL,	/* 친구 id */
	PRIMARY KEY (id, friend_id)
) character set = utf8mb4;

drop table if exists kyuser.newhostevent;
create table kyuser.newhostevent (
	`user_id` varchar(20) NOT NULL, /* 사용자 id */
	`host_num` integer NOT NULL, /* 호스트 번호 */
	`event_time` timestamp,
	`has_event_yn` boolean,
	PRIMARY KEY (user_id, host_num)
) character set = utf8mb4;
