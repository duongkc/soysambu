package nl.bioinf.arcgis.objects;

import java.util.Date;

/**
 * Class implementing sightings. Contains all necessary information for a sighting.
 * Has multiple constructors for various situations.
 * @author Ilse van Santen
 */
public class Sighting {
    private int id;
    private int group_id;
    private Date date;
    private String time;
    private float longitude;
    private float latitude;
    private Weather weather;
    private HabitatType habitatType;

    public int getId() { return id; }
    public int getGroup_id() { return group_id; }
    public Date getDate() { return date; }
    public String getTime() { return time; }
    public float getLongitude() { return longitude; }
    public float getLatitude() { return latitude; }
    public Weather getWeather() { return weather; }
    public HabitatType getHabitatType() { return habitatType; }

    public Sighting() {}

    public Sighting(int id, float latitude, float longitude) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;

    }

    public Sighting(int id, int group_id, Date date, String time, float latitude, float longitude, Weather weather, HabitatType habitatType) {
        this.id = id;
        this.group_id = group_id;
        this.date = date;
        this.time = time;
        this.latitude = latitude;//y
        this.longitude = longitude; //x
        this.weather = weather;
        this.habitatType = habitatType;
    }

    @Override
    public String toString() {
        return "Sighting {" +
                "id= " + id + ", " +
                "group_id= " + group_id + ", " +
                "date= " + date + ", " +
                "time= " + time + ", " +
                "longitude= " + longitude + ", " +
                "latitude= " + latitude + ", " +
                "weather= " + weather + ", " +
                "habitat type= " + habitatType + "}";
    }

}