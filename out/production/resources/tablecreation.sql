drop table if exists Giraffe_List;
drop table if exists Giraffe;
drop table if exists temp;
drop table if exists Sighting;
drop table if exists Giraffe_Group;

create table Sighting (
    sighting_id int auto_increment not null unique,
    date date not null,
    time time,
    xcoord float not null,
    ycoord float not null,
    weather enum ('CLOUDY', 'PARTLY CLOUDY', 'SUNNY', 'RAINY'),
    habitat_type enum ('ACACIA MIX', 'ACACIA WOODLAND', 'GRASSLAND', 'LAKESHORE'),
    primary key (sighting_id)
);

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

create table temp (
    id int auto_increment not null unique,
    date date,
    xcoord float,
    ycoord float,
    time time,
    weather enum ('CLOUDY', 'PARTLY CLOUDY', 'SUNNY', 'RAINY'),
    habitat_type enum ('ACACIA MIX', 'ACACIA WOODLAND', 'GRASSLAND', 'LAKESHORE'),
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

load data local infile 'C:/Users/Ilse/soysambu-conservancy-gis/data/Giraffe Survey Database October 2018.txt'
into table temp
fields terminated by '\t'
enclosed by '"'
lines terminated by '\n'
ignore 2 lines
(date, xcoord, ycoord, time, weather, habitat_type, activity, total_group,
 male_a, male_sa, female_a, female_sa, juvenile, unidentified);

insert into Sighting (date, time, xcoord, ycoord, weather, habitat_type)
SELECT date, time, xcoord, ycoord, weather, habitat_type from temp;
insert into Giraffe_Group (count, activity, male_a_count, male_sa_count,
                           female_a_count, female_sa_count, juvenile_count, unidentified_count)
SELECT total_group, activity, male_a, male_sa, female_a, female_sa, juvenile, unidentified from temp;


