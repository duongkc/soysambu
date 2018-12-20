package nl.bioinf.arcgis.servlets;

import com.google.gson.Gson;
import nl.bioinf.arcgis.dao.DaoMysql;
import nl.bioinf.arcgis.dao.DatabaseException;
import nl.bioinf.arcgis.objects.Sighting;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name= "ViewSightingsServlet.java", urlPatterns="/sightings")
public class ViewSightingsServlet extends HttpServlet {
    private DaoMysql dao;
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        List<Sighting> sightings = new ArrayList<>();
        String json;

        try {
            dao.connect();
            sightings = dao.fetchSightings();
            //dao.disconnect();

        } catch (DatabaseException | SQLException e) {
            e.printStackTrace();
        }

        json = new Gson().toJson(sightings);
        session.setAttribute("sightings", sightings);


        //response.setContentType("application/json");
        //response.setCharacterEncoding("UTF-8");
        //response.getWriter().write(json);


    }
}
