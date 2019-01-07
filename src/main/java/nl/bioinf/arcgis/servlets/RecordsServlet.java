package nl.bioinf.arcgis.servlets;

import com.google.gson.Gson;
import nl.bioinf.arcgis.dao.DaoMysql;
import nl.bioinf.arcgis.dao.DatabaseException;
import nl.bioinf.arcgis.objects.GiraffeGroup;
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

@WebServlet(name = "RecordsServlet.java", urlPatterns = "/records")
public class RecordsServlet extends HttpServlet {
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
        System.out.println("DO NOTHING...");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<GiraffeGroup> giraffe_groups = new ArrayList<>();
       // List<Sighting> sightings = new ArrayList<>();
        String groups_json = null;
        List<String> groups = new ArrayList<>();
        System.out.println("doGet()");

        try {
            groups.add(new Gson().toJson(dao.fetchGiraffeGroups(DaoMysql.GET_GIRAFFE_GROUPS)));
        } catch (SQLException e) {
            e.printStackTrace();
        }

        try {
            System.out.println(dao.fetchGiraffeGroups(DaoMysql.GET_GIRAFFE_GROUPS).size());
        } catch (SQLException e) {
            e.printStackTrace();
        }

        System.out.println(groups.get(groups.size()-1));


        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(groups.get(groups.size()-1));
    }

}

