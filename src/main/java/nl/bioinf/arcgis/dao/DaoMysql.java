package nl.bioinf.arcgis.dao;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import nl.bioinf.arcgis.objects.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class DaoMysql implements ArcGISDao {
    public static final String GET_GIRAFFE_GROUPS = "get_giraffe_groups";
    public static final String GET_SIGHTINGS = "get_sightings";
    public static final String INSERT_DATA = "insert_data";

    Connection connection;
    private Map<String, PreparedStatement> preparedStatements = new HashMap<>();
    private List<GiraffeGroup> giraffeGroupList = new ArrayList<>();
    private List<Sighting> sightingList = new ArrayList<>();

    static int lport;
    static String rhost;
    static int rport;

    /*singleton pattern*/
    private static DaoMysql uniqueInstance;

    /**
     * singleton pattern
     */
    private DaoMysql() {}

    /**
     * singleton pattern
     */
    public static DaoMysql getInstance() {
        //lazy
        if (uniqueInstance == null) {
            uniqueInstance = new DaoMysql();
        }
        return uniqueInstance;
    }

    @Override
    public void connect() throws DatabaseException {
//        String user = "idvansanten";
//        String host = "bioinf.nl";
//        String pass = "7hOu2Eq~";
//        String dbUser = "idvansanten";
//        String dbPass = "OzrEhjrL";
//        String dbUrl = "jdbc:mysql://mordor.bin:3306/Idvansanten";
//        int port = 4222;
//        lport = 4222;
//        rport = 3306;
//        Session session = null;
        try {
//            JSch jsch = new JSch();
//            session = jsch.getSession(user, host, port);
//            rhost = "mysql.bin";
//            session.setPassword(pass);
//            session.setConfig("StrictHostKeyChecking", "no");
//            session.connect();
//            session.setPortForwardingL(lport, host, 4222);
//            System.out.println("Establishing connection...");

            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/arcgis", "root", "");

            System.out.println("Connecting...");

            /*System.out.println("1");
            MysqlDataSource dataSource = new MysqlDataSource();
            System.out.println("2");
            dataSource.setServerName("mysql.bin");
            System.out.println("3");
            dataSource.setPortNumber(3306);
            System.out.println("4");
            dataSource.setUser("idvansanten");
            System.out.println("5");
            dataSource.setPassword("OzrEhjrL");
            System.out.println("6");
            dataSource.setAllowMultiQueries(true);
            System.out.println("7");
            dataSource.setDatabaseName("Idvansanten");
            System.out.println("8");
            System.out.println(dataSource.getUrl());
            System.out.println("8.5");
            Connection c = dataSource.getConnection();*/

            //System.out.println(c);

            prepareStatements();
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new DatabaseException("Something is wrong with the database, see cause Exception",
                    e.getCause());
        }
//        } finally {
//            try {
//                if(connection != null && !connection.isClosed()){
//                    System.out.println("Closing Database Connection");
//                    connection.close();
//                }
//            } catch (SQLException e) {
//                e.printStackTrace();
//            }
////            if (session != null && session.isConnected()) {
////                System.out.println("Closing SSH Connection");
////                session.disconnect();
////            }
//        }
    }

    public void prepareStatements() throws SQLException {
        String fetchGiraffeGroups = "SELECT * from Giraffe_Group";
        PreparedStatement ps_giraffe_groups = connection.prepareStatement(fetchGiraffeGroups);
        this.preparedStatements.put(GET_GIRAFFE_GROUPS, ps_giraffe_groups);

        String fetchSightings = "SELECT * from Sighting";
        PreparedStatement ps_sightings = connection.prepareStatement(fetchSightings);
        this.preparedStatements.put(GET_SIGHTINGS, ps_sightings);

    }
    public Activity activityCheck(ResultSet rs) throws SQLException {
        Activity activity = null;
        for (Activity a : Activity.values()) {
            if (a.name().equals(rs.getString("activity"))) {
                System.out.println("Activity found");
                activity = Activity.valueOf(rs.getString("activity"));
            } else {
                System.out.println("Activity not found");
                activity = Activity.UNKNOWN;
            }
        }
        return activity;
    }

    public List<GiraffeGroup> fetchGiraffeGroups() throws SQLException {
        PreparedStatement ps = this.preparedStatements.get(GET_GIRAFFE_GROUPS);
        ResultSet rs = ps.executeQuery();
        Activity activity = null;
        while (rs.next()) {
            int group_id = Integer.parseInt(rs.getString("group_id"));
            int count = Integer.parseInt(rs.getString("count"));
            if(rs.getString("activity") != null && !rs.getString("activity").isEmpty()) {
                activity = Activity.valueOf(rs.getString("activity"));
            } else {
                activity = Activity.UNKNOWN;
            }
            int male_adult = Integer.parseInt(rs.getString("male_a_count"));
            int male_subadult = Integer.parseInt(rs.getString("male_sa_count"));
            int female_adult = Integer.parseInt(rs.getString("female_a_count"));
            int female_subadult = Integer.parseInt(rs.getString("female_sa_count"));
            int juvenile = Integer.parseInt(rs.getString("juvenile_count"));
            int unidentified = Integer.parseInt(rs.getString("unidentified_count"));

            GiraffeGroup giraffeGroup = new GiraffeGroup(group_id, count, activity, male_adult, male_subadult, female_adult, female_subadult, juvenile, unidentified);
            System.out.println(giraffeGroup.toString());
            giraffeGroupList.add(giraffeGroup);
        }
        return giraffeGroupList;
    }

    public List<Sighting> fetchSightings() throws SQLException {
        PreparedStatement ps = this.preparedStatements.get(GET_SIGHTINGS);
        ResultSet rs = ps.executeQuery();
        Weather weather;
        HabitatType habitatType;
        while (rs.next()) {
            int id = Integer.parseInt(rs.getString("sighting_id"));
            Date date = Date.valueOf(rs.getString("date"));
            String time = rs.getString("time");
            float xcoord = Float.valueOf(rs.getString("xcoord"));
            float ycoord = Float.valueOf(rs.getString("ycoord"));

            //TO DO: add check if it's an enum || null || empty, else throw exception
            if(rs.getString("weather") != null && !rs.getString("weather").isEmpty()) {
                weather = Weather.valueOf(rs.getString("weather"));
            } else {
                weather = Weather.UNKNOWN;
            }

            if(rs.getString("habitat_type") != null && !rs.getString("habitat_type").isEmpty()) {
                habitatType = HabitatType.valueOf(rs.getString("habitat_type"));
            } else {
                habitatType = HabitatType.UNKNOWN;
            }

            Sighting sighting = new Sighting(id, date, time, xcoord, ycoord, weather, habitatType);
            System.out.println(sighting.toString());
            sightingList.add(sighting);
        }
        return sightingList;
    }

    @Override
    public void disconnect() throws DatabaseException {
        try{
            for( String key : this.preparedStatements.keySet() ){
                this.preparedStatements.get(key).close();
            }
        }catch( Exception e ){
            e.printStackTrace();
        }
        finally{
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}

