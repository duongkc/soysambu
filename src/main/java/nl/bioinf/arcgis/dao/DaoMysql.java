package nl.bioinf.arcgis.dao;

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

    @Override
    public void connect() throws DatabaseException {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String dbUrl = "jdbc:mysql://mysql.bin/Idvansanten";
            connection = DriverManager.getConnection(dbUrl,"idvansanten","OzrEhjrL");
            System.out.println("Connecting...");
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            throw new DatabaseException("Something is wrong with the database, see cause Exception",
                    e.getCause());
        }
    }

    public void PrepareStatements() throws SQLException {
        String fetchGiraffeGroups = "SELECT * from Giraffe_Group";
        PreparedStatement ps_giraffe_groups = connection.prepareStatement(fetchGiraffeGroups);
        this.preparedStatements.put(GET_GIRAFFE_GROUPS, ps_giraffe_groups);

        String fetchSightings = "SELECT * from Sighting";
        PreparedStatement ps_sightings = connection.prepareStatement(fetchSightings);
        this.preparedStatements.put(GET_SIGHTINGS, ps_sightings);

    }

    public List<GiraffeGroup> fetchGiraffeGroups() throws SQLException {
        PreparedStatement ps = this.preparedStatements.get(GET_GIRAFFE_GROUPS);
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            int group_id = Integer.parseInt(rs.getString("group_id"));
            int count = Integer.parseInt(rs.getString("count"));
            Activity activity = Activity.valueOf(rs.getString("activity"));
            int male_adult = Integer.parseInt(rs.getString("male_a_count"));
            int male_subadult = Integer.parseInt(rs.getString("male_sa_count"));
            int female_adult = Integer.parseInt(rs.getString("female_a_count"));
            int female_subadult = Integer.parseInt(rs.getString("female_sa_count"));
            int juvenile = Integer.parseInt(rs.getString("juvenile_count"));
            int unidentified = Integer.parseInt(rs.getString("unidentified"));

            GiraffeGroup giraffeGroup = new GiraffeGroup(group_id, count, activity, male_adult, male_subadult, female_adult, female_subadult, juvenile, unidentified);
            giraffeGroupList.add(giraffeGroup);
        }
        return giraffeGroupList;
    }

    public List<Sighting> fetchSightings() throws SQLException {
        PreparedStatement ps = this.preparedStatements.get(GET_SIGHTINGS);
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            int id = Integer.parseInt(rs.getString("sighting_id"));
            Date date = Date.valueOf(rs.getString("date"));
            String time = rs.getString("time");
            float xcoord = Float.valueOf(rs.getString("xcoord"));
            float ycoord = Float.valueOf(rs.getString("ycoord"));
            Weather weather = Weather.valueOf(rs.getString("weather"));
            HabitatType habitatType = HabitatType.valueOf(rs.getString("habitat_type"));

            Sighting sighting = new Sighting(id, date, time, xcoord, ycoord, weather, habitatType);
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

