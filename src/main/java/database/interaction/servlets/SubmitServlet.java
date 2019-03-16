package database.interaction.servlets;

import database.interaction.dao.DaoMysql;
import database.interaction.dao.DatabaseException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

/**
 * Servlet which handles the submitted data. Puts it in a list of strings.
 * @author Ilse van Santen
 */
@WebServlet(name="SubmitServlet.java", urlPatterns = "/submitservlet")
public class SubmitServlet extends HttpServlet {

    private DaoMysql dao;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        RequestDispatcher view;
        connect();
        /*Get all the data from the request and put it in a list named data
        * */
        String[] data = new String[13];
        data[0] = request.getParameter("date");
        data[1] = request.getParameter("time");
        data[2] = request.getParameter("latitude");
        data[3] = request.getParameter("longitude");
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
            dao.disconnect();
        } catch (SQLException | DatabaseException e) {
            e.printStackTrace();
        }
        view = request.getRequestDispatcher("index.html");

        view.forward(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    /**
     * Connect method to be called to create connection for each submit
     */
    protected void connect() {
        dao = DaoMysql.getInstance();
        String username = getServletContext().getInitParameter("database.user");
        String database = getServletContext().getInitParameter("database");
        String password = getServletContext().getInitParameter("database.password");
        String host = getServletContext().getInitParameter("database.host");
        try {
            System.out.println("Submit connect");
            dao.connect(username, database, password, host);
        } catch (DatabaseException e) {
            e.printStackTrace();
        }
    }
}
