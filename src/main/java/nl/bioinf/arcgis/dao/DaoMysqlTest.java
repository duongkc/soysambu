package nl.bioinf.arcgis.dao;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.sql.SQLException;

import static org.junit.Assert.*;

public class DaoMysqlTest {

    private DaoMysql dao;

    @Before
    public void before() {
        this.dao = DaoMysql.getInstance();
        try {
            dao.connect();
            dao.fetchGiraffeGroups(DaoMysql.GET_GIRAFFE_GROUPS);
            dao.fetchSightings(DaoMysql.GET_SIGHTINGS);
        } catch (DatabaseException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void connect() {
        assertFalse(dao.connection == null);
        try {
            assertTrue(! dao.connection.isClosed());
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}