/*
 * > 아이폰의 emojis 캐릭터 오류 문제 해결을 위해 utf8mb4를 적용
 * https://mathiasbynens.be/notes/mysql-utf8mb4
 */

create user 'kiyong'@'localhost' identified by '12345';

create database smchat character set=utf8mb4;

grant all privileges on smchat.* to 'kiyong'@'localhost';

drop table if exists smchat.chatuser;
create table smchat.chatuser (
	`id` varchar(20) NOT NULL primary key, /* 사용자 id */
	`password` varchar(100),
	`name` varchar(80),
	`nickname` varchar(100),
	`fcm_token` varchar(200),
	`badge_cnt` int default 0,
	`img_profile` varchar(200),
	`img_thumbnail` varchar(200),
	`photo` varchar(200),
	`rooms` varchar(512),
	`event_time` datetime
) character set = utf8mb4;

drop table if exists smchat.chatfriend;
create table smchat.chatfriend (
	`id` varchar(20) NOT NULL, /* 사용자 id */
	`friend_id` varchar(20) NOT NULL,	/* 친구 id */
	PRIMARY KEY (id, friend_id)
) character set = utf8mb4;

drop table if exists smchat.chatroom;
create table smchat.chatroom (
	`rid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT primary key, /* 시퀀스 */
	`creation` Datetime,	/*생성일자 */
	`name` varchar(40),	/*방이름*/
	`creater` varchar(20)	/*생성자*/
) character set = utf8mb4;

drop table if exists smchat.chatmember;
create table smchat.chatmember (
	`roomid` bigint(20),
	`user` varchar(20),	/*사용자*/
	PRIMARY KEY (roomid, user)
) character set = utf8mb4;

# messages table is dynamically created when a room is open
drop table if exists smchat.messages_1234;
create table smchat.messages_1234 (
	`code` int unsigned not null AUTO_INCREMENT primary key,
	`sender` varchar(20),
	`time` datetime,
	`type` tinyint not null,
	`message` JSON
) character set = utf8mb4;

drop table if exists smchat.unreadmessagelist;
create table smchat.unreadmessagelist (
	`roomid` bigint(20) UNSIGNED NOT NULL,
	`userid` varchar(20),
	`new_count` boolean default false,
	PRIMARY KEY (roomid, userid)
) character set = utf8mb4;

