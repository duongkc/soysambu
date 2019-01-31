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
import java.util.*;

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
        String username = getServletContext().getInitParameter("database.user");
        String database = getServletContext().getInitParameter("database");
        String password = getServletContext().getInitParameter("database.password");
        String host = getServletContext().getInitParameter("database.host");
        try {
            dao.connect(username, database, password, host);
        } catch (DatabaseException e) {
            e.printStackTrace();
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        /* Fetches groups, sightings and giraffes from the database and turns them into JSON objects (Strings)
         * */
        String groups = null;
        String sightings = null;
        String giraffes = null;

        try {
            groups = new Gson().toJson(dao.fetchGiraffeGroups(DaoMysql.GET_GIRAFFE_GROUPS));
            sightings = new Gson().toJson(dao.fetchSightings(DaoMysql.GET_SIGHTINGS));
            giraffes = new Gson().toJson(dao.fetchGiraffes(DaoMysql.GET_GIRAFFES));
            //dao.disconnect();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        List<String> records = combineRecords(sightings, groups, giraffes);

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
    private List<String> combineRecords(String sightings, String groups, String giraffes) {
        List<String> sightingsRecords = Arrays.asList(sightings.split("},\\{"));
        List<String> groupsRecords = Arrays.asList(groups.split("},\\{"));
        List<String> sightingGroupRecords = new ArrayList<>();
        int n = 0;
        for(String sighting : sightingsRecords) {
            String group = groupsRecords.get(n).replaceAll("\"id\"", "\"group_id\"");
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
        List<String> randomGiraffes = new ArrayList<>();

        /*Necessary to obtain size of giraffe list*/
        List<String> giraffeRecords = Arrays.asList(giraffes.split("},\\{"));

        /* Create a list of numbers 0 to giraffeRecords.size() */
        Integer[] nums = new Integer[giraffeRecords.size()];
        for (int i = 0; i < nums.length; ++i) {
            nums[i] = i;
        }
        for(String record : sightingGroupRecords) {
            /*Shuffle the numbers to get random unique numbers*/
            Collections.shuffle(Arrays.asList(nums));
            randomGiraffes.clear();
            /*Get count of group (group size). Necessary to generate random giraffes*/
            int count = Integer.parseInt(record.substring(record.indexOf("\"count\":") + 8, record.indexOf("\"count\":")
                    + 10).replace(",", ""));
            randomGiraffes = getRandomGiraffes(giraffes, count, nums);

            /* Build the string of JSON */
            StringBuilder sb = new StringBuilder();
            String start = "{";
            String end = "}";
            sb.append(start);
            sb.append(record);
            sb.append(", \"giraffes\":");
            sb.append(randomGiraffes.toString());
            sb.append(end);
            recordList.add(sb.toString());
        }

        return recordList;
    }

    /**
     * Get random giraffes from the database as dummy data
     * @param giraffes all giraffes
     * @param count amount of giraffes to be retrieved
     * @param numbers shuffled list of numbers
     * @return list of chosen giraffes
     */
    private List<String> getRandomGiraffes(String giraffes, int count, Integer[] numbers) {
        List<String> giraffeRecords = Arrays.asList(giraffes.split("},\\{"));
        List<String> selectedGiraffes = new ArrayList<>();

        /* Get the necessary amount of giraffes */
        for(int i = 0; i < count; i++) {
            selectedGiraffes.add(giraffeRecords.get(numbers[i]));
        }
        /* Add the chosen giraffes to a list, and build a List of strings */
        List<String> parsedGiraffes = new ArrayList<>();
        for(String giraffe : selectedGiraffes) {
            giraffe = giraffe.replaceAll("\\[\\{", "");
            giraffe = giraffe.replaceAll("}]", "");
            StringBuilder sb = new StringBuilder();
            String start = "{";
            String end = "}";

            giraffe = giraffe.replaceAll("\"id\"", "\"giraffe_id\"");
            sb.append(start);
            sb.append(giraffe);
            sb.append(end);
            parsedGiraffes.add(sb.toString());
        }
        return parsedGiraffes;
    }

}