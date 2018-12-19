package nl.bioinf.arcgis.servlets;

import nl.bioinf.arcgis.dao.DaoMysql;
import nl.bioinf.arcgis.dao.DatabaseException;
import nl.bioinf.arcgis.objects.GiraffeGroup;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "ViewRecordsServlet", urlPatterns = "/giraffes")
public class ViewRecordsServlet extends HttpServlet {
    private DaoMysql dao;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (DatabaseException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (DatabaseException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException, DatabaseException, SQLException {
        this.dao = DaoMysql.getInstance();
        dao.connect();
        List<GiraffeGroup> giraffes = dao.fetchGiraffeGroups();
        System.out.println(giraffes);

        request.setAttribute("giraffes", giraffes);
        RequestDispatcher view = request.getRequestDispatcher("giraffes.jsp");
        view.forward(request, response);
    }
}
