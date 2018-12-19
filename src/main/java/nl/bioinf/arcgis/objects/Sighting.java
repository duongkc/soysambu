package nl.bioinf.arcgis.objects;

import java.util.Date;

public class Sighting {
    private int id;
    private Date date;
    private String time;
    private float xcoord;
    private float ycoord;
    private Weather weather;
    private HabitatType habitatType;

    public int getId() { return id; }
    public Date getDate() { return date; }
    public String getTime() { return time; }
    public float getXcoord() { return xcoord; }
    public float getYcoord() { return ycoord; }
    public Weather getWeather() { return weather; }
    public HabitatType getHabitatType() { return habitatType; }

    public Sighting() {}

    public Sighting(int id, float xcoord, float ycoord) {
        this.id = id;
        this.xcoord = xcoord;
        this.ycoord = ycoord;
    }

    public Sighting(int id, Date date, String time, float xcoord, float ycoord, Weather weather, HabitatType habitatType) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.xcoord = xcoord;
        this.ycoord = ycoord;
        this. weather = weather;
        this.habitatType = habitatType;
    }

    @Override
    public String toString() {
        return "Sighting {" +
                "id= " + id + ", " +
                "date= " + date + ", " +
                "time= " + time + ", " +
                "xcoord= " + xcoord + ", " +
                "ycoord= " + ycoord + ", " +
                "weather= " + weather + ", " +
                "habitat type= " + habitatType + "}";
    }

}