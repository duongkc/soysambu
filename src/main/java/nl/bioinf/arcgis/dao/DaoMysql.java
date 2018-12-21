package nl.bioinf.arcgis.dao;

//import com.jcraft.jsch.JSch;
//import com.jcraft.jsch.JSchException;
//import com.jcraft.jsch.Session;
import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import nl.bioinf.arcgis.objects.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Class implementing data acess object for Arc GIS.
 * It handles starting and querying the database, as
 * well as passing on the obtained data.
 */
public class DaoMysql implements ArcGISDao {
    /* PreparedStatement definitions. Every query has its own.
        Is collected in hashmap of prepared statements.
    * */
    public static final String GET_GIRAFFE_GROUPS = "get_giraffe_groups";
    public static final String GET_SIGHTINGS = "get_sightings";
    public static final String GET_ACTIVITY = "get_activity";
    public static final String INSERT_DATA = "insert_data";
    private Map<String, PreparedStatement> preparedStatements = new HashMap<>();

    //Creation of dao object
    private static DaoMysql dao;

    Connection connection;

    //List of obtained data objects from queries
    private List<GiraffeGroup> giraffeGroupList = new ArrayList<>();
    private List<Sighting> sightingList = new ArrayList<>();

    /**
     * Main running the connection and fetching of data
     * @param args
     * @throws DatabaseException
     * @throws SQLException
     */
    public static void main(String[] args) throws DatabaseException, SQLException {
        dao = DaoMysql.getInstance();
        dao.connect();
        //dao.fetchGiraffeGroups();
        dao.fetchSightings();
        dao.disconnect();
    }

    private static DaoMysql uniqueInstance;

    private DaoMysql() {}

    public static DaoMysql getInstance() {
        if (uniqueInstance == null) {
            uniqueInstance = new DaoMysql();
        }
        return uniqueInstance;
    }

    /**
     * Connects to the database. SSH connection included in comments.
     * Also starts the preparation of statements through
     * prepareStatements() function.
     * @throws DatabaseException
     */
    @Override
    public void connect() throws DatabaseException {
//        String user = "idvansanten";
//        String host = "bioinf.nl";
//        String pass = "7hOu2Eq~";
//        int port = 4222;
//        Session session = null;
        try {
            /*SSH CONNECTION CODE
//            JSch jsch = new JSch();
//            session = jsch.getSession(user, host, port);
//            rhost = "mysql.bin";
//            session.setPassword(pass);
//            session.setConfig("StrictHostKeyChecking", "no");
//            session.connect();
//            session.setPortForwardingL(port, host, 4222);
//            System.out.println("Establishing connection...");*/

            /* Call the driver, create connection, and run prepareStatements()
            * */
            System.out.println("Connecting to db");
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/arcgis", "root", "");
            System.out.println("Connecting...");
            prepareStatements();
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            throw new DatabaseException("Something is wrong with the database, see cause Exception",
                    e.getCause());
        }
    }

    /**
     * Handles the creation of queries (SELECTS/INSERTS)
     * @throws SQLException
     */
    public void prepareStatements() throws SQLException {
        /* Create a query; link query to connection as prepared statement;
        add prepared statement to the hashmap of preparedstatements
        * */
        String fetchGiraffeGroups = "SELECT * from Giraffe_Group ";
        PreparedStatement ps_giraffe_groups = connection.prepareStatement(fetchGiraffeGroups);
        this.preparedStatements.put(GET_GIRAFFE_GROUPS, ps_giraffe_groups);

        String fetchSightings = "SELECT * from Sighting";
        PreparedStatement ps_sightings = connection.prepareStatement(fetchSightings);
        this.preparedStatements.put(GET_SIGHTINGS, ps_sightings);

        String fetchActivity = "SELECT group_id, activity from Giraffe_Group";
        PreparedStatement ps_activity = connection.prepareStatement(fetchActivity);
        this.preparedStatements.put(GET_ACTIVITY, ps_activity);

    }

    /**
     * Fetches the ID and activity of Giraffe_Groups.
     * @return list of giraffegroups in objects
     * @throws SQLException
     */
    public List<GiraffeGroup> fetchActivity() throws SQLException {
        /* Get prepared statement from hashmap, execute the statement (query),
        iterate through the results of the query while putting the obtained data into
        GiraffeGroup objects, which are then put in a list.
        * */
        PreparedStatement ps = this.preparedStatements.get(GET_ACTIVITY);
        ResultSet rs = ps.executeQuery();
        Activity activity = null;
        while (rs.next()) {
            int group_id = Integer.parseInt(rs.getString("group_id"));
            /* Checks if activity enum is empty or null to replace it with UNKNOWN enum
            to avoid throwing of exceptions
            * */
            try {
                if (rs.getString("activity") != null && !rs.getString("activity").isEmpty()) {
                    activity = Activity.valueOf(rs.getString("activity"));
                } else {
                    activity = Activity.UNKNOWN;
                }
            } catch (IllegalArgumentException e) {
                System.out.println("Illegal input");
            }

            GiraffeGroup giraffeGroup = new GiraffeGroup(group_id, activity);
            System.out.println(giraffeGroup.toStringActivity());
            giraffeGroupList.add(giraffeGroup);
        }

        return giraffeGroupList;
    }

    /**
     * Fetches ALL data from Giraffe_Group table.
     * @return List of Giraffe Groups
     * @throws SQLException
     */
    public List<GiraffeGroup> fetchGiraffeGroups() throws SQLException {
        /* Get prepared statement from hashmap, execute the statement (query),
        iterate through the results of the query while putting the obtained data into
        GiraffeGroup objects, which are then put in a list.
        * */
        PreparedStatement ps = this.preparedStatements.get(GET_GIRAFFE_GROUPS);
        ResultSet rs = ps.executeQuery();
        Activity activity = null;
        while (rs.next()) {
            int group_id = Integer.parseInt(rs.getString("group_id"));
            int count = Integer.parseInt(rs.getString("count"));
            try {
                if (rs.getString("activity") != null && !rs.getString("activity").isEmpty()) {
                    activity = Activity.valueOf(rs.getString("activity"));
                } else {
                    activity = Activity.UNKNOWN;
                }
            } catch (IllegalArgumentException e) {
                System.out.println("Illegal input");
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


    /**
     * Fetches ALL data in Sighting table from database, puts it into objects
     * @return List of Sighting objects
     * @throws SQLException
     */
    public List<Sighting> fetchSightings() throws SQLException {
        PreparedStatement ps = this.preparedStatements.get(GET_SIGHTINGS);
        ResultSet rs = ps.executeQuery();
        Weather weather = null;
        HabitatType habitatType = null;
        while (rs.next()) {
            int id = Integer.parseInt(rs.getString("sighting_id"));
            int group_id = Integer.parseInt(rs.getString("group_id"));
            Date date = Date.valueOf(rs.getString("date"));
            String time = rs.getString("time");
            float xcoord = Float.valueOf(rs.getString("xcoord"));
            float ycoord = Float.valueOf(rs.getString("ycoord"));

            try {
                if (rs.getString("weather") != null && !rs.getString("weather").isEmpty()) {
                    weather = Weather.valueOf(rs.getString("weather"));
                } else {
                    weather = Weather.UNKNOWN;
                }
            } catch (IllegalArgumentException e) {
                System.out.println("Illegal input");
            }

            try {
                if (rs.getString("habitat_type") != null && !rs.getString("habitat_type").isEmpty()) {
                    habitatType = HabitatType.valueOf(rs.getString("habitat_type"));
                } else {
                    habitatType = HabitatType.UNKNOWN;
                }
            } catch (IllegalArgumentException e) {
                System.out.println("Illegal input");
            }

            Sighting sighting = new Sighting(id, group_id, date, time, xcoord, ycoord, weather, habitatType);
//            System.out.println(sighting.toString());
            sightingList.add(sighting);
        }
        return sightingList;
    }

    @Override
    public void disconnect() throws DatabaseException {
        try {
            for(String key : this.preparedStatements.keySet()) {
                this.preparedStatements.get(key).close();
            }
            connection.close();
            System.out.println("Connection closing...");
        } catch(Exception e) {
            e.printStackTrace();
        }
        finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}

