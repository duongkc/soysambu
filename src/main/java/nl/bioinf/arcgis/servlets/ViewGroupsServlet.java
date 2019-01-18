package nl.bioinf.arcgis.servlets;

import com.google.gson.Gson;
import nl.bioinf.arcgis.dao.DaoMysql;
import nl.bioinf.arcgis.dao.DatabaseException;
import nl.bioinf.arcgis.objects.GiraffeGroup;

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
 * Class of a webservlet creating a page to display all available groups in the database
 * @author Ilse van Santen
 */
@WebServlet(name = "ViewGroupsServlet.java", urlPatterns = "/groups")
public class ViewGroupsServlet extends HttpServlet {
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
            System.out.println("[ViewGroupsServlet] connecting to database ");
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
     * Fetches the giraffe groups, sends it as JSON to webpage
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<GiraffeGroup> giraffe_groups = new ArrayList<>();
        String json;

        try {
            giraffe_groups = dao.fetchGiraffeGroups(DaoMysql.GET_GIRAFFE_GROUPS);
            dao.disconnect();
        } catch (SQLException | DatabaseException e) {
            e.printStackTrace();
        }

        System.out.println(giraffe_groups);
        json = new Gson().toJson(giraffe_groups);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}

