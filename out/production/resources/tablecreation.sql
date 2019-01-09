drop table if exists temp;
drop table if exists Giraffe_List;
drop table if exists Giraffe;
drop table if exists Sighting;
drop table if exists Giraffe_Group;

create table temp (
  id int auto_increment not null unique,
  date date,
  latitude float,
  longitude float,
  time time,
  weather enum ('CLOUDY', 'PARTLY CLOUDY', 'SUNNY', 'RAINY'),
  habitat_type enum ('ACACIA_MIX', 'ACACIA_WOODLAND', 'GRASSLAND', 'LAKESHORE'),
  activity enum ('FEEDING', 'WALKING', 'STANDING', 'RESTING', 'FIGHTING', 'SCRATCHING', 'SOCIALIZING'),
  total_group int,
  male_a int,
  male_sa int,
  female_a int,
  female_sa int,
  juvenile int,
  unidentified int,
  primary key(id)
);

load data local infile '/homes/idvansanten/soysambu-conservancy-gis/data/Giraffe Survey Database October 2018 v2.txt'
into table temp
fields terminated by '\t'
lines terminated by '\n'
ignore 2 lines
(date, latitude, longitude, time, weather, habitat_type, activity, total_group,
 male_a, male_sa, female_a, female_sa, juvenile, unidentified);

create table Giraffe_Group (
  group_id int auto_increment not null unique,
  count int not null,
  activity enum ('FEEDING', 'WALKING', 'STANDING', 'RESTING', 'FIGHTING', 'SCRATCHING', 'SOCIALIZING'),
  male_a_count int,
  male_sa_count int,
  female_a_count int,
  female_sa_count int,
  juvenile_count int,
  unidentified_count int,
  primary key (group_id)
);

insert into Giraffe_Group (count, activity, male_a_count, male_sa_count,
                           female_a_count, female_sa_count, juvenile_count, unidentified_count)
SELECT total_group, activity, male_a, male_sa, female_a, female_sa, juvenile, unidentified from temp;

create table Sighting (
  sighting_id int auto_increment not null unique,
  group_id int,
  date date not null,
  time time,
  latitude float not null,
  longitude float not null,
  weather enum ('CLOUDY', 'PARTLY_CLOUDY', 'SUNNY', 'RAINY'),
  habitat_type enum ('ACACIA_MIX', 'ACACIA_WOODLAND', 'GRASSLAND', 'LAKESHORE'),
  primary key (sighting_id),
  foreign key (group_id) references Giraffe_Group(group_id)
);

create table Giraffe (
    giraffe_id int auto_increment not null unique,
    name char(100) not null unique,
    gender enum ('MALE', 'FEMALE'),
    deceased bit not null,
    primary key (giraffe_id)
);

create table Giraffe_List (
  id int auto_increment not null unique,
  giraffe_id int not null,
  giraffe_group_id int not null,
  primary key (id),
  foreign key (giraffe_id) references Giraffe(giraffe_id),
  foreign key (giraffe_group_id) references Giraffe_Group(group_id)
);

insert into Sighting (date, group_id, time, latitude, longitude, weather, habitat_type)
SELECT date, id, time, latitude, longitude, weather, habitat_type from temp;

