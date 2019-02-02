package arcgis.dao;

public interface ArcGISDao {
    /**
     * connects to the data layer.
     *
     * @throws DatabaseException
     */
    void connect(String user, String db, String password, String host) throws DatabaseException;

    /**
     * closes the connection to the data layer and frees resources.
     *
     * @throws DatabaseException
     */
    void disconnect() throws DatabaseException;
}
