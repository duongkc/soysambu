package nl.bioinf.arcgis.servlets;

import com.google.gson.Gson;
import nl.bioinf.arcgis.dao.DaoMysql;
import nl.bioinf.arcgis.dao.DatabaseException;
import nl.bioinf.arcgis.objects.Sighting;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "ViewSightingsServlet.java", urlPatterns = "/sightings")
public class ViewSightingsServlet extends HttpServlet {
    private DaoMysql dao;

    @Override
    public void init() throws ServletException {
        super.init();
        dao = DaoMysql.getInstance();
        try {
            System.out.println("Database is being initialized...");
            dao.connect();
        } catch (DatabaseException e) {
            e.printStackTrace();
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Sighting> sightings = new ArrayList<>();
        String json;

        try {
            sightings = dao.fetchSightings(DaoMysql.GET_SIGHTINGS);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        json = new Gson().toJson(sightings);
        System.out.println(json);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}
