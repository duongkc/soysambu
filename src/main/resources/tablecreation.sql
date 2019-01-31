drop table if exists temp;
drop table if exists Giraffe_List;
drop table if exists Sighting;
drop table if exists Sighting_AnimalGroup;
drop table if exists Giraffe_Group;
drop table if exists Giraffe;


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

load data local infile 'C:/Users/Ilse/soysambu-conservancy-gis/data/Giraffe Survey Database October 2018 v2.txt'
load data local infile 'data/Giraffe Survey Database October 2018 v2.txt'
into table temp
fields terminated by '\t'
lines terminated by '\n'
ignore 2 lines
(date, latitude, longitude, time, weather, habitat_type, activity, total_group,
 male_a, male_sa, female_a, female_sa, juvenile, unidentified);

create table Giraffe (
    giraffe_id char(4) not null unique,
    name varchar(50) unique,
    gender enum ('MALE', 'FEMALE'),
    age_class enum ('ADULT', 'SUB_ADULT', 'JUVENILE'),
    mother char(4),
    father char(4),
    notes text,
    deceased bit not null,
    primary key (giraffe_id),
    foreign key (mother) references Giraffe(giraffe_id),
    foreign key (father) references Giraffe(giraffe_id)
);

create table Giraffe_List (
  id int auto_increment not null unique,
  giraffe_id char(4) not null,
  giraffe_group_id int not null,
  primary key (id),
  foreign key (giraffe_id) references Giraffe(giraffe_id),
  foreign key (giraffe_group_id) references Giraffe_Group(group_id)
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

create table Sighting_AnimalGroup (
  id int auto_increment not null unique,
  giraffe_group_id int unique,
  primary key (id),
  foreign key (giraffe_group_id) references Giraffe_Group(group_id)
);

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
  giraffe_id char(4) not null unique,
  name varchar(50) unique,
  gender enum ('MALE', 'FEMALE'),
  age enum ('JUVENILE', 'SUBADULT','ADULT'),
  mother char(4),
  father char(4),
  description text,
  deceased boolean not null,
  notes text,
  first_seen date,
  primary key (giraffe_id)
#     foreign key (father) references Giraffe(giraffe_id),
#     foreign key (mother) references Giraffe(giraffe_id)
);

load data local infile 'C:/Users/Ilse/soysambu-conservancy-gis/data/giraffe_data.txt'
into table Giraffe
fields terminated by '\t'
lines terminated by '\n'
ignore 1 lines
(giraffe_id, name, gender, age, mother, father, description, deceased, notes, first_seen);

# Enable NULL to avoid Java SQL errors (0000-00-00 is not a valid date)
update Giraffe set first_seen = NULL where first_seen = '0000-00-00';

create table Giraffe_List (
  id int auto_increment not null unique,
  giraffe_id char(4) not null,
  giraffe_group_id int not null,
  primary key (id),
  foreign key (giraffe_id) references Giraffe(giraffe_id),
  foreign key (giraffe_group_id) references Giraffe_Group(group_id)
);

create table Sighting_AnimalGroup (
  id int auto_increment not null unique,
  giraffe_group_id int unique,
  primary key (id),
  foreign key (giraffe_group_id) references Giraffe_Group(group_id)
);
insert into Giraffe_Group (count, activity, male_a_count, male_sa_count,
                           female_a_count, female_sa_count, juvenile_count, unidentified_count)
SELECT total_group, activity, male_a, male_sa, female_a, female_sa, juvenile, unidentified from temp;

insert into Sighting_AnimalGroup (giraffe_group_id) SELECT group_id from Giraffe_Group;

insert into Sighting (date, group_id, time, latitude, longitude, weather, habitat_type)
SELECT temp.date, Sighting_AnimalGroup.id, temp.time, temp.latitude, temp.longitude, temp.weather,
       temp.habitat_type from temp, Sighting_AnimalGroup
where Sighting_AnimalGroup.id = temp.id;