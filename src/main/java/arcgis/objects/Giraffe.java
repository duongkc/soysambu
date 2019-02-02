package arcgis.objects;

/**
 * Class implementing Giraffe object. Contains all data per Giraffe.
 * @author Ilse van Santen
 */
public class Giraffe {
    private String id;
    private String name;
    private Gender gender;
    private Age age;
    private String mother;
    private String father;
    private String description;
    private boolean deceased;
    private String notes;
    private String first_seen;

    public String getId() {return id;}
    public String getName() {return name;}
    public Gender getGender() {return gender;}
    public Age getAge() {return age;}
    public String getMother() {return mother;}
    public String getFather() {return father;}
    public String getDescription() {return description;}
    public boolean getDeceased() {return deceased;}
    public String getNotes() {return notes;}
    public String getFirst_seen() {return first_seen;}

    public Giraffe() {}

    public Giraffe(String id, String name, Gender gender, Age age, String mother, String father, String description,
                   boolean deceased, String notes, String first_seen) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.mother = mother;
        this.father = father;
        this.description = description;
        this.deceased = deceased;
        this.notes = notes;
        this.first_seen = first_seen;
    }

    @Override
    public String toString() {
        return "Giraffe {" +
                "id= " + getId() + ", " +
                "name= " + getName() + ", " +
                "gender= " + getGender() + ", " +
                "age= " + getAge() + ", " +
                "mother= " + getMother() + ", " +
                "father= " + getFather() + ", " +
                "description= " + getDescription() + ", " +
                "deceased= " + getDeceased() + ", " +
                "notes= " + getNotes() + ", " +
                "first_seen= " + getFirst_seen() + "}";
    }
}
