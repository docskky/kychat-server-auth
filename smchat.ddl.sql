/*
 * > 아이폰의 emojis 캐릭터 오류 문제 해결을 위해 utf8mb4를 적용
 * https://mathiasbynens.be/notes/mysql-utf8mb4
 */
create database smuser character set=utf8mb4;

grant all privileges on smuser.* to 'babshim'@'localhost';

drop table if exists smuser.chatuser;
create table smuser.chatuser (
	`id` varchar(20) NOT NULL primary key, /* 사용자 id */
	`password` varchar(100),
	`name` varchar(80),
	`fcm_token` varchar(200),
	`badge` int,
	`session_token` varchar(200),
	`thumbnail` varchar(200),
	`photo` varchar(200),
	`longitude` double,
	`latitude` double
) character set = utf8mb4;

drop table if exists smuser.chatfriend;
create table smuser.chatfriend (
	`id` varchar(20) NOT NULL, /* 사용자 id */
	`friend_id` varchar(20) NOT NULL,	/* 친구 id */
	PRIMARY KEY (id, friend_id)
) character set = utf8mb4;

drop table if exists smuser.newhostevent;
create table smuser.newhostevent (
	`user_id` varchar(20) NOT NULL, /* 사용자 id */
	`host_num` integer NOT NULL, /* 호스트 번호 */
	`event_time` timestamp,
	`has_event_yn` boolean,
	PRIMARY KEY (user_id, host_num)
) character set = utf8mb4;

create database smchat character set=utf8mb4;

drop table if exists smchat.chatroomuserlist;
create table smchat.chatroomuserlist (
	`room_id` bigint(20) unsigned NOT NULL, /* room id */
	`user_id` varchar(20) NOT NULL, /* 사용자 id */
	PRIMARY KEY (room_id, user_id)
) character set = utf8mb4;

drop table if exists smchat.chatroom;
create table smchat.chatroom (
	`rid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT primary key, /* 시퀀스 */
	`creation` Datetime,	/*생성일자 */
	`name` varchar(40)	/*방이름*/
) character set = utf8mb4;

drop table if exists smchat.chatmessage;
create table smchat.chatmessage (
	`room_id` bigint(20) UNSIGNED NOT NULL,
	`code` int unsigned not null,
	`sender` varchar(20),
	`time` datetime,
	`type` tinyint not null,
	`message` JSON,
	PRIMARY KEY (room_id, code)
) character set = utf8mb4;

drop table if exists smchat.unreadmessagelist;
create table smchat.unreadmessagelist (
	`room_id` bigint(20) UNSIGNED NOT NULL,
	`code` int unsigned not null,
	`user_id` varchar(20),
	`delivered` boolean default false,
	PRIMARY KEY (room_id, code, user_id)
) character set = utf8mb4;
