package org.launchcode.lefthandvoicings.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class Chord {

    @Id
    @GeneratedValue
    private int id;

    @NotNull
    private String root;

    @NotNull
    private String quality;

    @NotNull
    private String form;

    @Size(max = 255, message = "Lyric cannot be longer than 255 characters")
    private String lyrics;

    @ManyToOne
    private Song song;

    public Chord() {}

    public Chord(String root, String quality, String form, String lyrics) {
        this.root = root;
        this.quality = quality;
        this.form = form;
        this.lyrics = lyrics;
    }

    public int getId() {
        return id;
    }

    public String getRoot() {
        return root;
    }

    public void setRoot(String root) {
        this.root = root;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public String getForm() {
        return form;
    }

    public void setForm(String form) {
        this.form = form;
    }

    public String getLyrics() {
        return lyrics;
    }

    public void setLyrics(String lyrics) {
        this.lyrics = lyrics;
    }

}
