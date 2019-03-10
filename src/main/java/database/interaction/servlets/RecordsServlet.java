package database.interaction.servlets;

import com.google.gson.Gson;
import database.interaction.dao.DaoMysql;
import database.interaction.dao.DatabaseException;
import database.interaction.objects.Age;
import database.interaction.objects.Giraffe;

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

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        /* Fetches groups, sightings and giraffes from the database and turns them into JSON objects (Strings)
         * */
        connect();
        String groups = null;
        String sightings = null;
        List<Giraffe> giraffeObjects = null;

        try {
            groups = new Gson().toJson(dao.fetchGiraffeGroups(DaoMysql.GET_GIRAFFE_GROUPS));
            sightings = new Gson().toJson(dao.fetchSightings(DaoMysql.GET_SIGHTINGS));
            giraffeObjects = dao.fetchGiraffes(DaoMysql.GET_GIRAFFES);
            dao.disconnect();
        } catch (SQLException | DatabaseException e) {
            e.printStackTrace();
        }

        List<String> records = combineRecords(sightings, groups, giraffeObjects);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.valueOf(records));
    }

    /**
     * Combines sighting and group records into one list by parsing the obtained data from the database.
     *
     * @param sightings
     * @param groups
     * @return recordList the list of records
     */
    private List<String> combineRecords(String sightings, String groups, List<Giraffe> giraffes) {

        /* Parse out all unnecessary syntax to prevent errors from wrongly syntaxed JSON
        * */
        List<String> sightingsRecords = Arrays.asList(sightings.split("},\\{"));
        List<String> groupsRecords = Arrays.asList(groups.split("},\\{"));
        List<String> sightingGroupRecords = new ArrayList<>();
        int n = 0;
        for (String sighting : sightingsRecords) {
            String group = groupsRecords.get(n).replaceAll("\"id\"", "\"group_id\"");
            if (n == 0) {
                sighting = sighting.replaceAll("\\[\\{", "");
                group = group.replaceAll("\\[\\{", "");
            } else if (n == sightingsRecords.size() - 1) {
                sighting = sighting.replaceAll("}]", "");
                group = group.replaceAll("}]", "");
            }
            sightingGroupRecords.add(sighting.replaceAll("\"group_id\":[0-9]+", group));
            n++;
        }

        List<String> recordList = new ArrayList<>();
        List<String> randomGiraffes = new ArrayList<>();

        /* Create a list of numbers 0 to giraffes.size() */
        Integer[] nums = new Integer[giraffes.size()];
        for (int i = 0; i < nums.length; ++i) {
            nums[i] = i;
        }
        for (String record : sightingGroupRecords) {
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
     *
     * @param giraffes all giraffes
     * @param count    amount of giraffes to be retrieved
     * @param numbers  shuffled list of numbers
     * @return list of chosen giraffes
     */
    private List<String> getRandomGiraffes(List<Giraffe> giraffes, int count, Integer[] numbers) {
        List<Giraffe> selectedGiraffeObjects = new ArrayList<>();
        /* Get the necessary amount of giraffes */
        for (int i = 0; i < count; i++) {
            selectedGiraffeObjects.add(giraffes.get(numbers[i]));
        }

        /* Comparator implementing the sort for MALE ADULT - MALE SUBADULT - FEMALE ADULT - FEMALE SUBADULT - UNKNOWN
        * */
        Collections.sort(selectedGiraffeObjects, new Comparator<Giraffe>() {
            @Override
            public int compare(Giraffe o1, Giraffe o2) {
                int i = o1.getGender().compareTo(o2.getGender());
                if (i != 0) return i;
                i = o1.getAge().compareTo(o2.getAge());
                if (i!= 0) return i;
                return i;
            }
        });

        /* Comparator implementing the sort for juvenile giraffes (to end of list)
        * */
        Collections.sort(selectedGiraffeObjects, new Comparator<Giraffe>() {
            @Override
            public int compare(Giraffe o1, Giraffe o2) {
                if(o1.getAge() == Age.JUVENILE && o2.getAge() != Age.JUVENILE) {
                    return 1;
                } else if (o1.getAge() != Age.JUVENILE && o2.getAge() == Age.JUVENILE) {
                    return -1;
                }
                return 0;
            }
        });

        /* Create JSON from the selected giraffes */
        String giraffeString = new Gson().toJson(selectedGiraffeObjects);
        List<String> giraffeList = Arrays.asList(giraffeString.split("},\\{"));

        /* Add the chosen giraffes to a list, and build a List of strings */
        List<String> parsedGiraffes = new ArrayList<>();
        for (String giraffe : giraffeList) {
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

        /* A check to empty up empty lists in case of 0 giraffes sighted */
        if(parsedGiraffes.get(0).equals("{[]}")) {
            parsedGiraffes.clear();
        }

        return parsedGiraffes;
    }

    /**
     * Connect method to be called each time records servlet is accessed to ensure up-to-date data
     */
    protected void connect() {
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
}