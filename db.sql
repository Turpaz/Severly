create database severly;

create type ServerType as(
	_Title varchar(255),
	_PPM float
);

create table servers(
	_ID serial primary key,
	_IP varchar(255),
	_Name varchar(255),
	_Type ServerType,
	_IsRunning boolean,
	_TimeRunning interval,
	_LastActionTime timestamp with time zone
);