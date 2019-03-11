# Soysambu Conservancy GIS  
*Copyright 2018-2019 Niels van der Vegt and Ilse van Santen*  

Welcome to the repository for the Soysambu Conservancy GIS web application.  
This web application maps the pathing of animals present in the Soysambu Conservancy in Kenya based on a database of organism sightings.
Sightings of organisms can be added to the online database, and for each sighting detailed information can be viewed.

## Table of Contents  
[TOC]


## Features  
The following section contains information on the features of the web application.  
### Map  
The homepage of the web application contains a map with points denoting giraffe sightings. Clicking on them will show information based on the group. Group composition and individual giraffes will also be shown.  
### Add Sighting  
The second feature is the adding of new sightings. Entering all relevant information will result in the sighting being added to the database, and can be seen on the map. The added sighting may also be viewed in the table of the View Sightings page.  
### View Sightings  
The view sightings feature is one that shows a table containing all sightings available in the database. Clicking on a row will result in a second table showing relevant information of that sighting.
The table may also be filtered based on date, weather, habitat, activity, and group size. Clicking on the 'advanced' button will provide more filters for group composition.
Lastly, the filters can be reset by clicking on the 'reset' button.  


## Locally Hosting 
It's possible to run a version of this web app locally using demo data provided in the `data` folder of this repository.  
This section will instruct you in how to get a local instance of the web app running.

### Prerequisites
- Local or remote MySQL Database (MySQL version 5.5 or higher).
- Tomcat Server (version 9.0 or higher).
- IntelliJ IDEA 2018.2.3 (Ultimate Edition)with Gradle installed (Ultimate Edition).
- Java (JDK/JRE) (version 8 or higher).

### Setup
To start, choose between cloning a production stable build or the latest experimental development build by  
cloning the repository's master or develop branches respectively. Next, open the cloned repository as a new project in IntelliJ IDEA.

### Database  
Before the GIS portion of the web application can be functional a database needs to be initialized. 
This database can either be local or remote (*Note: When using a remote database, an SSH tunnel may be necessary.*).

When you have an empty database prepared using a program like XAMPP it can be initialized by running the table creation file 
found in the Resources folder (src/main/resources/tablecreation.sql). (*Note: Change the file paths found on line 28 and 76 
of *tablecreation.sql* to your local system's file paths if your database is located outside of the repository.*)

### Build Web Application
To link the Intellij IDEA project to your local database open the web.xml file found at *src/main/webapp/WEB-INF/web.xml*.
Add the database user, password, name, and host between the *<param-value></param-value>* brackets. 
(*e.g..<param-name>database.user</param-name><param-value>**root**</param-value>*)

To build the web application perform the following steps:
Click on File ➜ Settings ➜ Build, Execution, Deployment ➜ Application Servers  
Click on the '+' and add Tomcat Server  
Find the relevant paths for the Tomcat Server and add it  
Right-click *index.html* file found at *src/main/webapp/index.html* and click on 'Run'  
IntelliJ will now open the web application in your preferred browser.