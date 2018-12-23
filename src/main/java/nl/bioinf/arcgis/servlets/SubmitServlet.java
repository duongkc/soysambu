package nl.bioinf.arcgis.servlets;

import nl.bioinf.arcgis.dao.DaoMysql;
import nl.bioinf.arcgis.dao.DatabaseException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name="SubmitServlet.java", urlPatterns = "/submitservlet")
public class SubmitServlet extends HttpServlet {

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
        RequestDispatcher view;

        /*Get all the data from the request and put it in a list named data
        * */
        String[] data = new String[13];
        data[0] = request.getParameter("date");
        data[1] = request.getParameter("time");
        data[2] = request.getParameter("x-coord");
        data[3] = request.getParameter("y-coord");
        data[4] = request.getParameter("weather").replace(" ", "_").toUpperCase();
        data[5] = request.getParameter("habitat").replace(" ", "_").toUpperCase();
        data[6] = request.getParameter("activity").replace(" ", "_").toUpperCase();
        data[7] = request.getParameter("count-ma");
        data[8] = request.getParameter("count-ms");
        data[9] = request.getParameter("count-fa");
        data[10] = request.getParameter("count-fs");
        data[11] = request.getParameter("count-ju");
        data[12] = request.getParameter("count-un");

        try {
            dao.addRecords(data);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        view = request.getRequestDispatcher("index.html");

        view.forward(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }
}
