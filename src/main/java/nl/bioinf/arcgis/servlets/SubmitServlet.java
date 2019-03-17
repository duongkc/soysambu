package nl.bioinf.arcgis.servlets;

import nl.bioinf.arcgis.dao.DaoMysql;
import nl.bioinf.arcgis.dao.DatabaseException;
import nl.bioinf.arcgis.objects.Activity;
import nl.bioinf.arcgis.objects.HabitatType;
import nl.bioinf.arcgis.objects.Weather;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
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

        //Validate the input before adding it to database
        String[] data = validateInput(request, response);

        try {
            if(response.getStatus() != 406) {
                dao.addRecords(data);
            }
            dao.disconnect();
        } catch (SQLException | DatabaseException e) {
            e.printStackTrace();
        }
        view = request.getRequestDispatcher("index.html");

        view.forward(request, response);
    }

    /**
     * Function to validate all input and return error 406 if any of it is incorrect
     * @param request
     * @param response
     * @return data string list
     */
    protected String[] validateInput(HttpServletRequest request, HttpServletResponse response) {

        /*Get all the data from the request and put it in a list named data
         * */
        HttpSession session = request.getSession();
        String[] data = new String[13];
        boolean invalidInputFound = false;
        String invalidInput = "";
        /* Match regex of date, e.g. 2000-10-10 / 2000-1-1
        * */
        if(request.getParameter("date").matches("20[0-9]{2}-[01]?[0-9]-[0-3]?[0-9]")) {
            data[0] = request.getParameter("date");
        } else {
            request.setAttribute("error406", "date");
            invalidInput += "Date, ";
            invalidInputFound = true;
        }

        /* Match time regex (HH:MM:SS); SS is always 00 (unrecorded, though present in database) 24H clock
        * */
        if(request.getParameter("time").matches("(([0-2][0-4])|([0-1][0-9])):[0-5][0-9]")) {
            data[1] = request.getParameter("time");
        } else {
            invalidInput += "Time, ";
            invalidInputFound = true;
        }

        /* Match latitude regex (between -90 and +90 of all allowed latitude values possible)
        * */
        if(Double.parseDouble(request.getParameter("latitude")) >= -90 &&
                Double.parseDouble(request.getParameter("latitude")) <= 90) {
            data[2] = request.getParameter("latitude");
        } else {
            invalidInput += "Latitude, ";
            invalidInputFound = true;
        }

        /* Match longitude regex (between -180 and +180)
        * */
        if(Double.parseDouble(request.getParameter("longitude")) >= -180 &&
                Double.parseDouble(request.getParameter("longitude")) <= 180) {
            data[3] = request.getParameter("longitude");
        } else {
            invalidInput += "Longitude, ";
            invalidInputFound = true;
        }

        /* Check if weather is a valid Weather enum
        * */
        boolean weatherCheck = false;
        for(Weather w : Weather.values()) {
            if(w.name().equals(request.getParameter("weather").replace(" ", "_").toUpperCase())) {
                weatherCheck = true;
            }
        }
        if(weatherCheck) {
            data[4] = request.getParameter("weather").replace(" ", "_").toUpperCase();
        } else {
            invalidInput += "Weather, ";
            invalidInputFound = true;
        }

        /* Check if habitat is a valid HabitatType enum
        * */
        boolean habitatCheck = false;
        for(HabitatType h : HabitatType.values()) {
            if(h.name().equals(request.getParameter("habitat").replace(" ", "_").toUpperCase())) {
                habitatCheck = true;
            }
        }
        if(habitatCheck) {
            data[5] = request.getParameter("habitat").replace(" ", "_").toUpperCase();
        } else {
            invalidInput += "Habitat, ";
            invalidInputFound = true;
        }

        /* Check if activity is a valid Activity enum
        * */
        boolean activityCheck = false;
        for(Activity a : Activity.values()) {
            if(a.name().equals(request.getParameter("activity").replace(" ", "_").toUpperCase())) {
                activityCheck = true;
            }
        }
        if(activityCheck) {
            data[6] = request.getParameter("activity").replace(" ", "_").toUpperCase();
        } else {
            invalidInput += "Activity, ";
            invalidInputFound = true;
        }

        /* Check if the counts are a number between 0 and 50
        * */
        if(Integer.valueOf(request.getParameter("count-ma")) >= 0 && Integer.valueOf(request.getParameter("count-ma")) <= 50) {
            data[7] = request.getParameter("count-ma");
        } else {
            invalidInput += "Male adult count, ";
            invalidInputFound = true;
        }
        if(Integer.valueOf(request.getParameter("count-ms")) >= 0 && Integer.valueOf(request.getParameter("count-ms")) <= 50) {
            data[8] = request.getParameter("count-ms");
        } else {
            invalidInput += "Male subadult count, ";
            invalidInputFound = true;
        }
        if(Integer.valueOf(request.getParameter("count-fa")) >= 0 && Integer.valueOf(request.getParameter("count-fa")) <= 50) {
            data[9] = request.getParameter("count-fa");
        } else {
            invalidInput += "Female adult count, ";
            invalidInputFound = true;
        }
        if(Integer.valueOf(request.getParameter("count-fs")) >= 0 && Integer.valueOf(request.getParameter("count-fs")) <= 50) {
            data[10] = request.getParameter("count-fs");
        } else {
            invalidInput += "Female subadult count, ";
            invalidInputFound = true;
        }
        if(Integer.valueOf(request.getParameter("count-ju")) >= 0 && Integer.valueOf(request.getParameter("count-ju")) <= 50) {
            data[11] = request.getParameter("count-ju");
        } else {
            invalidInput += "Juvenile count, ";
            invalidInputFound = true;
        }
        if(Integer.valueOf(request.getParameter("count-un")) >= 0 && Integer.valueOf(request.getParameter("count-un")) <= 50) {
            data[12] = request.getParameter("count-un");
        } else {
            invalidInput += "Unidentified count";
            invalidInputFound = true;
        }

        /*
        * If ANY invalid input is found, set attribute of request and session, throw new status code (406)
        * */
        if(invalidInputFound) {
            request.setAttribute("error406", invalidInput);
            session.setAttribute("error406", invalidInput);
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
        }
        return data;
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
