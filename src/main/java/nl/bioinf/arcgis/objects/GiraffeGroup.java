package nl.bioinf.arcgis.objects;

public class GiraffeGroup {

    private int id;
    private int count;
    private Activity activity;
    private int male_adult;
    private int male_subadult;
    private int female_adult;
    private int female_subadult;
    private int juvenile;
    private int unidentified;

    public int getId() { return id; }
    public int getCount() { return count; }
    public Activity getActivity() { return activity; }
    public int getMale_adult() { return male_adult; }
    public int getMale_subadult() { return male_subadult; }
    public int getFemale_adult() { return female_adult; }
    public int getFemale_subadult() { return female_subadult; }
    public int getJuvenile() { return juvenile; }
    public int getUnidentified() { return unidentified; }

    public GiraffeGroup() {}

    public GiraffeGroup(int id, int count) {
        this.id = id;
        this.count = count;
    }

    public GiraffeGroup(int id, int count, Activity activity, int male_adult, int male_subadult, int female_adult, int female_subadult, int juvenile, int unidentified) {
        this.id = id;
        this.count = count;
        this.activity = activity;
        this.male_adult = male_adult;
        this.male_subadult = male_subadult;
        this.female_adult = female_adult;
        this.female_subadult = female_subadult;
        this.juvenile = juvenile;
        this.unidentified = unidentified;
    }

    @Override
    public String toString() {
        return "Giraffe Group {" +
                "id= " + id + ", " +
                "count= " + count + ", " +
                "activitity= " +  activity + ", " +
                "male_adult= " + male_adult + ", " +
                "male_subadult= " + male_subadult + ", " +
                "female_adult= " + female_adult + ", " +
                "female_subadult= " + female_subadult + ", " +
                "juvenile= " + juvenile + ", " +
                "unidentified= " + unidentified + "}";
    }
}