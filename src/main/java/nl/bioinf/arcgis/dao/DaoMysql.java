package nl.bioinf.arcgis.dao;

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
 * @author Ilse van Santen
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

    Connection connection;
    //List of obtained data objects from queries
    private List<GiraffeGroup> giraffeGroupList = new ArrayList<>();
    private List<Sighting> sightingList = new ArrayList<>();


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
        try {
            /* Call the driver, create connection, and run prepareStatements()
            * */
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/arcgis", "root", "");
            System.out.println("Connecting to database");
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
        String fetchGiraffeGroups = "SELECT * from Giraffe_Group";
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

        String fetchNewGiraffeGroup = "SELECT * from Giraffe_Group where group_id =(SELECT max(group_id) FROM Giraffe_Group)";
        PreparedStatement ps_new_group = connection.prepareStatement(fetchNewGiraffeGroup);
        this.preparedStatements.put(GET_NEW_GIRAFFE_GROUP, ps_new_group);

        String addSighting = "INSERT INTO Sighting(group_id, date, time, latitude, longitude, weather, habitat_type) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement ps_add_sighting = connection.prepareStatement(addSighting);
        this.preparedStatements.put(ADD_SIGHTING, ps_add_sighting);

        String fetchNewSighting = "SELECT * from Sighting where sighting_id = (SELECT max(sighting_id) FROM Sighting)";
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
        giraffeGroupList.clear();
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
        giraffeGroupList.clear();
        while (rs.next()) {
            int group_id = Integer.parseInt(rs.getString("group_id"));
            int count = Integer.parseInt(rs.getString("count"));
            try {
                /* Converts empty activity cells to 'Unknown' activity
                * */
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
        sightingList.clear();
        PreparedStatement ps = this.preparedStatements.get(preparedStatementName);
        ResultSet rs = ps.executeQuery();
        Weather weather = null;
        HabitatType habitatType = null;
        while (rs.next()) {
            int id = Integer.parseInt(rs.getString("sighting_id"));
            int group_id = Integer.parseInt(rs.getString("group_id"));
            Date date = Date.valueOf(rs.getString("date"));
            String time = rs.getString("time");
            float latitude = Float.valueOf(rs.getString("latitude"));
            float longitude = Float.valueOf(rs.getString("longitude"));

            /* Converts empty weather cells to 'Unknown' weather
            * */
            try {
                if (rs.getString("weather") != null && !rs.getString("weather").isEmpty()) {
                    weather = Weather.valueOf(rs.getString("weather"));
                } else {
                    weather = Weather.UNKNOWN;
                }
            } catch (IllegalArgumentException e) {
                System.out.println("Illegal input");
            }
            /* Converts empty habitat cells to 'Unknown' habitat
             * */
            try {
                if (rs.getString("habitat_type") != null && !rs.getString("habitat_type").isEmpty()) {
                    habitatType = HabitatType.valueOf(rs.getString("habitat_type"));
                } else {
                    habitatType = HabitatType.UNKNOWN;
                }
            } catch (IllegalArgumentException e) {
                System.out.println("Illegal input");
            }

            Sighting sighting = new Sighting(id, group_id, date, time, latitude, longitude, weather, habitatType);
            sightingList.add(sighting);
        }
        rs.close();
        return sightingList;
    }

    /**
     * Adds new records to the database
     * @param data the submitted record data
     * @throws SQLException
     */
    public void addRecords(String[] data) throws SQLException {
        //Find fix for continuously appending this list here below, it's not nice.
        List<GiraffeGroup> newly_added_group = addGiraffeGroup(data);
        addSighting(data, newly_added_group.get(newly_added_group.size()-1).getId());
    }

    /**
     * Adds a giraffe group to the database, based on the submitted input
     * @param data list containing data
     * @return a list of the newly added giraffe group
     * @throws SQLException
     */
    public List<GiraffeGroup> addGiraffeGroup(String[] data) throws SQLException {
        try {
            PreparedStatement ps = this.preparedStatements.get(ADD_GIRAFFE_GROUP);
            int total_count = Integer.parseInt(data[7]) + Integer.parseInt(data[8]) + Integer.parseInt(data[9])
                    + Integer.parseInt(data[10]) + Integer.parseInt(data[11]) + Integer.parseInt(data[12]);
            ps.setInt(1, Integer.parseInt(String.valueOf(total_count)));
            ps.setString(2,data[6]);
            ps.setInt(3, Integer.parseInt(data[7]));
            ps.setInt(4, Integer.parseInt(data[8]));
            ps.setInt(5, Integer.parseInt(data[9]));
            ps.setInt(6, Integer.parseInt(data[10]));
            ps.setInt(7, Integer.parseInt(data[11]));
            ps.setInt(8, Integer.parseInt(data[12]));
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
     * @param data the sighting submission
     * @param giraffeGroupId the id of the group that has been spotted
     * @return a list of the newly added sighting
     */
    public List<Sighting> addSighting(String[] data, Integer giraffeGroupId) {
        try {
            PreparedStatement ps = this.preparedStatements.get(ADD_SIGHTING);
            ps.setInt(1, giraffeGroupId);
            ps.setString(2, data[0]);
            ps.setString(3, data[1]);
            ps.setFloat(4, Float.parseFloat(data[2]));
            ps.setFloat(5, Float.parseFloat(data[3]));
            ps.setString(6, data[4]);
            ps.setString(7, data[5]);
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
            System.out.println("Database connection closing...");
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

