drop table if exists Giraffe_Group;
drop table if exists Sighting;
drop table if exists Giraffe;
drop table if exists Giraffe_Sighting;

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

create table Sighting (
    sighting_id int auto_increment not null unique,
    group_id int,
    date date not null,
    time time,
    xcoord float not null,
    ycoord float not null,
    weather enum ('CLOUDY', 'PARTLY CLOUDY', 'SUNNY', 'RAINY'),
    habitat_type enum ('ACADIA_MIX', 'ACADIA_WOODLAND', 'OPEN_GRASSLAND', 'LAKESHORE'),
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

create table Giraffe_Sighting (
    id int auto_increment not null unique,
    giraffe_id int,
    sighting_id int,
    primary key (id),
    foreign key (giraffe_id) references Giraffe(giraffe_id),
    foreign key (sighting_id) references Sighting(sighting_id)
);
