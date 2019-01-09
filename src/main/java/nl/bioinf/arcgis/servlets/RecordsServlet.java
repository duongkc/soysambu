package nl.bioinf.arcgis.servlets;

import com.google.gson.Gson;
import nl.bioinf.arcgis.dao.DaoMysql;
import nl.bioinf.arcgis.dao.DatabaseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Class of a webservlet returning a list of all available sightings and groups in the database
 * @author Ilse van Santen
 */
@WebServlet(name = "RecordsServlet.java", urlPatterns = "/records")
public class RecordsServlet extends HttpServlet {
    private DaoMysql dao;

    @Override
    public void init() throws ServletException {
        super.init();
        dao = DaoMysql.getInstance();
        try {
            dao.connect();
        } catch (DatabaseException e) {
            e.printStackTrace();
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        /* Fetches groups and sightings from the database and turns them into JSON objects (Strings)
        * */
        String groups = null;
        String sightings = null;

        try {
            groups = new Gson().toJson(dao.fetchGiraffeGroups(DaoMysql.GET_GIRAFFE_GROUPS));
            sightings = new Gson().toJson(dao.fetchSightings(DaoMysql.GET_SIGHTINGS));
            //dao.disconnect();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        List<String> records = combineRecords(sightings, groups);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.valueOf(records));
    }

    /**
     * Combines sighting and group records into one list by parsing the obtained data from the database.
     * @param sightings
     * @param groups
     * @return recordList the list of records
     */
    private List<String> combineRecords(String sightings, String groups) {
        List<String> sightingsRecords = Arrays.asList(sightings.split("},\\{"));
        List<String> groupsRecords = Arrays.asList(groups.split("},\\{"));
        List<String> sightingGroupRecords = new ArrayList<>();
        int n = 0;
        for(String sighting : sightingsRecords) {
            String group = groupsRecords.get(n).replaceAll("id", "group_id");
            if(n == 0) {
                sighting = sighting.replaceAll("\\[\\{", "");
                group = group.replaceAll("\\[\\{", "");
            }
            else if(n == sightingsRecords.size()-1) {
                sighting = sighting.replaceAll("}]","");
                group = group.replaceAll("}]","");
            }
            sightingGroupRecords.add(sighting.replaceAll("\"group_id\":[0-9]+", group));
            n++;
        }

        List<String> recordList = new ArrayList<>();
        for(String record : sightingGroupRecords) {
            StringBuilder sb = new StringBuilder();
            String start = "{";
            String end = "}";
            sb.append(start);
            sb.append(record);
            sb.append(end);
            recordList.add(sb.toString());
        }

        return recordList;
    }

}

