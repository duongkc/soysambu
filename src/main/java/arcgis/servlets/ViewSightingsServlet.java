package arcgis.servlets;

import com.google.gson.Gson;
import arcgis.dao.DaoMysql;
import arcgis.dao.DatabaseException;
import arcgis.objects.Sighting;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Class of a webservlet creating a page to display all available sightings in the database
 * @author Ilse van Santen
 */
@WebServlet(name = "ViewSightingsServlet.java", urlPatterns = "/sightings")
public class ViewSightingsServlet extends HttpServlet {
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
            System.out.println("[ViewSightingsServlet] connecting to database ");
            dao.connect(username, database, password, host);
        } catch (DatabaseException e) {
            e.printStackTrace();
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Fetches the giraffe sightings, sends it to webpage as JSON
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Sighting> sightings = new ArrayList<>();
        String json;

        try {
            sightings = dao.fetchSightings(DaoMysql.GET_SIGHTINGS);
            dao.disconnect();
        } catch (SQLException | DatabaseException e) {
            e.printStackTrace();
        }

        json = new Gson().toJson(sightings);
        System.out.println(json);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}
