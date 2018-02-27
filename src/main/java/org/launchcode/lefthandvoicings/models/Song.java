package org.launchcode.lefthandvoicings.models;







import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Song {

    @Id
    @GeneratedValue
    private int id;

    @NotNull
    @Size(min = 1, max = 64)
    private String title;

    @OneToMany(cascade = {CascadeType.ALL})
    @JoinColumn(name = "song_id")
    private List<Chord> chords = new ArrayList<Chord>();


    public Song() {}

    public Song(String title, List<Chord>chords) {
        this.title = title;
        this.chords = chords;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Chord> getChords() {
        return chords;
    }

    public void setChords(List<Chord> chords) {
        this.chords = chords;
    }
}
