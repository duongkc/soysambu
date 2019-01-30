# Soysambu Conservancy GIS  
*Created by Niels van der Vegt and Ilse van Santen* 
## Introduction  
Welcome to the repository for the Soysambu Conservancy GIS web application. This web application forms the basis of a tool to map the pathing of animals present in the Soysambu Conservancy in Kenya.
Sightings of giraffe groups can be added to the online database, and detailed information can be viewed per sighting.   

## Table of Contents  
[TOC]

## Prerequisites  
- Local or remote MySQL Database (MySQL version 5.5 or higher)  
- Tomcat Server (version 9.0 or higher)  
- IntelliJ IDEA 2018.2.3 (Ultimate Edition)  
- Java (JDK/JRE) (version 8 or higher)  
- (Optional) XAMPP to host local database (version 4.2.2 or higher)  

## How to run  
This section will provide detailed information on how to run the application through IntelliJ.  

### IntelliJ IDEA Ultimate  
>1) Open IntelliJ IDEA Ultimate  
>2) Click on File --> Open...  
>3) Find and select the project folder  
>4) Select 'Use auto-import' and default gradle settings  
>5) Confirm the selection  

### Database  
The first thing is to set up the database. This database can either be local or remote.  
**In case of a local database using XAMPP, start at 1. In case of a remote database or other local database, start at 2.**  
1) Open XAMPP control panel or other local database hosting software and click on 'Start' for MySQL. Take note of the credentials, these will be used later.  
2) Run the file found in Resources folder (src/main/resources/tablecreation.sql) in **one of the following ways:**  
>a) (XAMPP) When using XAMPP, go to localhost/phpmyadmin in your web browser, click on 'new' in the left-hand side menu  
>>Set database name to 'arcgis' and click create. (Do not change dropdown)  
		Go to the created database and click on 'SQL' at the top  
		Copy and paste the contents of *tablecreation.sql* file into the window  
		Change the file paths found on line 28 and 82 of *tablecreation.sql* to your local system's file paths  
		Click on 'Go' (bottom right)  
		
>b) (IntelliJ) When using IntelliJ, click on 'Database' in the right-hand side menu  
>>Click on '+' --> Datasource --> MySQL  
		Enter the relevant information (Host, Database, User, and Password)  
		*When using a remote database, an SSH tunnel may be necessary*  
		(Optional) Click on the 'SSH/SSL' tab and check the SSH box  
		Enter the proxy host, user, port and password information  
		Click on 'Test connection'. If all data is correct, it will say so  
		Open *tablecreation.sql* file found in resources folder  
		Change the file paths found on line 28 and 82 to your local system's file paths  
		Right click tablecreation.sql --> Run --> Select the added database --> OK  
		
>c) (Terminal) Connect to your database with your credentials in terminal  
>>(mysql -u [USER] -h [HOST])-p ENTER, and type password)  
		Open *tablecreation.sql* in a text editor  
		Change the file paths found on line 28 and 82 to your local system's file paths  
		Run *tablecreation.sql* when connected to your database  
		
3) If all went well, your locally or remotely hosted database should now contain all necessary information.  

### Web Application  
Once the application has been opened in IntelliJ and the database has been prepared, it is time to run the program.  
>1) Open web.xml file found at *src/main/webapp/WEB-INF/web.xml*  
>2) Add the database user, password, name, and host between the *<param-value></param-value>* brackets  

>>Example:  
>><param-name>database.user</param-name>  
>><param-value>**root**</param-value>  

>3) Click on File --> Settings --> Build, Execution, Deployment --> Application Servers  
>4) Click on the '+' and add Tomcat Server  
>5) Find the relevant paths for the Tomcat Server and add it  
>6) Right-click *index.html* file found at *src/main/webapp/index.html* and click on 'Run'  
>7) IntelliJ will now open the web application in your preferred browser  

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
