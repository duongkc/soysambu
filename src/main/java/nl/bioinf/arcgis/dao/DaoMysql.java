package nl.bioinf.arcgis.dao;

//import com.jcraft.jsch.JSch;
//import com.jcraft.jsch.JSchException;
//import com.jcraft.jsch.Session;
import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import nl.bioinf.arcgis.objects.*;

import java.sql.*;
import java.sql.Date;
import java.util.*;

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
    public static final String ADD_GIRAFFE_GROUP = "add_giraffe_group";
    public static final String ADD_SIGHTING = "add_sighting";
    public static final String GET_NEW_GIRAFFE_GROUP = "get_new_giraffe_group";
    public static final String GET_NEW_SIGHTING = "get_new_sighting";

    private Map<String, PreparedStatement> preparedStatements = new HashMap<>();

    //Creation of dao object
    private static DaoMysql dao;

    private static String testSubmit = "\"count\":31,\"activity\":\"RESTING\",\"male_adult\":1,\"male_subadult\":0," +
            "\"female_adult\":15,\"female_subadult\":0,\"juvenile\":15,\"unidentified\":0," +
            "\"date\":\"2018/10/02\",\"time\":\"14:30:00\",\"xcoord\":-0.47558,\"ycoord\":36.1693," +
            "\"weather\":\"CLOUDY\",\"habitatType\":\"GRASSLAND\"";

    private static String testSubmit2 = "\"count\":43,\"activity\":\"WALKING\",\"male_adult\":1,\"male_subadult\":0," +
            "\"female_adult\":20,\"female_subadult\":2,\"juvenile\":20,\"unidentified\":0," +
            "\"date\":\"2018/12/04\",\"time\":\"14:31:00\",\"xcoord\":-0.48558,\"ycoord\":35.1693," +
            "\"weather\":\"SUNNY\",\"habitatType\":\"ACACIA_MIX\"";

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
        runAddRecords(testSubmit);
        runAddRecords(testSubmit2);
        runFunctions();
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
     * Function to run the basic application (get instance of DAO, connect, preferred functions, disconnect)
     * @param data input data
     * @throws DatabaseException
     * @throws SQLException
     */
    public static void runAddRecords(String data) throws DatabaseException, SQLException {
        dao = DaoMysql.getInstance();
        dao.connect();
        dao.addRecords(data);
        dao.disconnect();
    }

    public static void runFunctions() throws DatabaseException, SQLException {
        dao = DaoMysql.getInstance();
        dao.connect();
        dao.fetchGiraffeGroups(GET_GIRAFFE_GROUPS);
        dao.fetchSightings(GET_SIGHTINGS);
        dao.disconnect();
    }

    /**
     * Handles the creation of queries (SELECTS/INSERTS)
     * @throws SQLException
     */
    public void prepareStatements() throws SQLException {
        /* Create a query; link query to connection as prepared statement;
        add prepared statement to the hashmap of preparedstatements
        * */
        String fetchGiraffeGroups = "SELECT * from giraffe_group";
        PreparedStatement ps_giraffe_groups = connection.prepareStatement(fetchGiraffeGroups);
        this.preparedStatements.put(GET_GIRAFFE_GROUPS, ps_giraffe_groups);

        String fetchSightings = "SELECT * from Sighting";
        PreparedStatement ps_sightings = connection.prepareStatement(fetchSightings);
        this.preparedStatements.put(GET_SIGHTINGS, ps_sightings);

        String fetchActivity = "SELECT group_id, activity from Giraffe_Group";
        PreparedStatement ps_activity = connection.prepareStatement(fetchActivity);
        this.preparedStatements.put(GET_ACTIVITY, ps_activity);

        String addGiraffeGroup ="INSERT INTO Giraffe_Group(count, activity, male_a_count, male_sa_count," +
                "                           female_a_count, female_sa_count, juvenile_count, unidentified_count) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement ps_add_giraffe_group = connection.prepareStatement(addGiraffeGroup);
        this.preparedStatements.put(ADD_GIRAFFE_GROUP, ps_add_giraffe_group);

        String fetchNewGiraffeGroup = "SELECT * from giraffe_group where group_id =(SELECT max(group_id) FROM giraffe_group)";
        PreparedStatement ps_new_group = connection.prepareStatement(fetchNewGiraffeGroup);
        this.preparedStatements.put(GET_NEW_GIRAFFE_GROUP, ps_new_group);

        String addSighting = "INSERT INTO Sighting(group_id, date, time, xcoord, ycoord, weather, habitat_type) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement ps_add_sighting = connection.prepareStatement(addSighting);
        this.preparedStatements.put(ADD_SIGHTING, ps_add_sighting);

        String fetchNewSighting = "SELECT * from sighting where sighting_id = (SELECT max(sighting_id) FROM sighting)";
        PreparedStatement ps_new_sighting = connection.prepareStatement(fetchNewSighting);
        this.preparedStatements.put(GET_NEW_SIGHTING, ps_new_sighting);
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
        rs.close();

        return giraffeGroupList;
    }

    /**
     * Fetches ALL data from Giraffe_Group table.
     * @return List of Giraffe Groups
     * @throws SQLException
     */
    public List<GiraffeGroup> fetchGiraffeGroups(String preparedStatementName) throws SQLException {
        /* Get prepared statement from hashmap, execute the statement (query),
        iterate through the results of the query while putting the obtained data into
        GiraffeGroup objects, which are then put in a list.
        * */
        PreparedStatement ps = this.preparedStatements.get(preparedStatementName);
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

            GiraffeGroup giraffeGroup = new GiraffeGroup(group_id, count, activity, male_adult, male_subadult,
                    female_adult, female_subadult, juvenile, unidentified);
            System.out.println(giraffeGroup.toString());
            giraffeGroupList.add(giraffeGroup);
        }
        rs.close();

        return giraffeGroupList;
    }

    /**
     * Fetches ALL data in Sighting table from database, puts it into objects
     * @return List of Sighting objects
     * @throws SQLException
     */
    public List<Sighting> fetchSightings(String preparedStatementName) throws SQLException {
        PreparedStatement ps = this.preparedStatements.get(preparedStatementName);
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
            System.out.println(sighting.toString());
            sightingList.add(sighting);
        }
        rs.close();
        return sightingList;
    }

    /**
     * Adds new records to the database
     * @param submit the submitted record
     * @throws SQLException
     */
    public void addRecords(String submit) throws SQLException {
        List<String[]> values;
        values = parseSubmit(submit);
        //Find fix for continuously appending this list here below, it's not nice.
        List<GiraffeGroup> newly_added_group = addGiraffeGroup(values.get(1));
        addSighting(values.get(0), newly_added_group.get(newly_added_group.size()-1).getId());
    }

    /**
     * Parses the inserted submit string to usable string lists
     * @param submitString
     * @return
     */
    public List<String[]> parseSubmit(String submitString) {
        String[] parsed = submitString.split(",");
        //System.out.println(Arrays.toString(parsed));
        String[] giraffeGroupValues = new String[8];
        String[] sightingValues = new String[6];
        //count
        giraffeGroupValues[0] = parsed[0].substring(parsed[0].indexOf(":") + 1);
        //activity
        giraffeGroupValues[1] = parsed[1].substring(parsed[1].indexOf(":") + 1).replace("\"", "");
        //male_a count
        giraffeGroupValues[2] = parsed[2].substring(parsed[2].indexOf(":") + 1);
        //male_sa count
        giraffeGroupValues[3] = parsed[3].substring(parsed[3].indexOf(":") + 1);
        //female_a count
        giraffeGroupValues[4] = parsed[4].substring(parsed[4].indexOf(":") + 1);
        //female_sa count
        giraffeGroupValues[5] = parsed[5].substring(parsed[5].indexOf(":") + 1);
        //juvenile count
        giraffeGroupValues[6] = parsed[6].substring(parsed[6].indexOf(":") + 1);
        //unidentified count
        giraffeGroupValues[7] = parsed[7].substring(parsed[7].indexOf(":") + 1);
        //date
        sightingValues[0] = parsed[8].substring(parsed[8].indexOf(":") + 1).replace("\"", "");
        //time
        sightingValues[1] = parsed[9].substring(parsed[9].indexOf(":") + 1).replace("\"", "");
        //xcoord
        sightingValues[2] = parsed[10].substring(parsed[10].indexOf(":") + 1);
        //ycoord
        sightingValues[3] = parsed[11].substring(parsed[11].indexOf(":") + 1);
        //weather
        sightingValues[4] = parsed[12].substring(parsed[12].indexOf(":") + 1).replace("\"", "");
        //habitat type
        sightingValues[5] = parsed[13].substring(parsed[13].indexOf(":") + 1).replace("\"", "");

        List<String[]> values = new ArrayList<>();
        values.add(sightingValues);
        values.add(giraffeGroupValues);

        return values;
    }

    /**
     * Adds a giraffe group to the database, based on the submitted input
     * @param giraffeGroup
     * @return a list of the newly added giraffe group
     * @throws SQLException
     */
    public List<GiraffeGroup> addGiraffeGroup(String[] giraffeGroup) throws SQLException {
        try {
            PreparedStatement ps = this.preparedStatements.get(ADD_GIRAFFE_GROUP);
            ps.setInt(1, Integer.parseInt(giraffeGroup[0]));
            ps.setString(2,giraffeGroup[1]);
            ps.setInt(3, Integer.parseInt(giraffeGroup[2]));
            ps.setInt(4, Integer.parseInt(giraffeGroup[3]));
            ps.setInt(5, Integer.parseInt(giraffeGroup[4]));
            ps.setInt(6, Integer.parseInt(giraffeGroup[5]));
            ps.setInt(7, Integer.parseInt(giraffeGroup[6]));
            ps.setInt(8, Integer.parseInt(giraffeGroup[7]));
            ps.executeUpdate();
            return fetchGiraffeGroups(GET_NEW_GIRAFFE_GROUP);
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Adds a sighting to the database, linked to the giraffe group that has been seen,
     * based on submitted input
     * @param sighting the sighting
     * @param giraffeGroupId the id of the group that has been spotted
     * @return a list of the newly added sighting
     */
    public List<Sighting> addSighting(String[] sighting, Integer giraffeGroupId) {
        try {
            PreparedStatement ps = this.preparedStatements.get(ADD_SIGHTING);
            ps.setInt(1, giraffeGroupId);
            ps.setString(2, sighting[0]);
            ps.setString(3, sighting[1]);
            ps.setFloat(4, Float.parseFloat(sighting[2]));
            ps.setFloat(5, Float.parseFloat(sighting[3]));
            ps.setString(6, sighting[4]);
            ps.setString(7, sighting[5]);
            ps.executeUpdate();
            return fetchSightings(GET_NEW_SIGHTING);
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Disconnects from the database. Closes all prepared statements and then the connection.
     * @throws DatabaseException
     */
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

