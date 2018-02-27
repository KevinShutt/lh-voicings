package org.launchcode.lefthandvoicings.controllers;

import com.google.gson.Gson;

import org.launchcode.lefthandvoicings.models.Chord;
import org.launchcode.lefthandvoicings.models.Song;
import org.launchcode.lefthandvoicings.models.data.ChordDAO;
import org.launchcode.lefthandvoicings.models.data.SongDAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;



@Controller
@RequestMapping(value = "lhv")
public class LHVController {

    @Autowired
    private SongDAO songDAO;

    @Autowired
    private ChordDAO chordDAO;

    @RequestMapping(value="")
    public String index(Model model) {


        model.addAttribute("songs", songDAO.findAll());
        model.addAttribute("title", "Songs");

        return "lhv/index";
    }

    @RequestMapping(value = "new-song", method = RequestMethod.GET )
    public String displayNewSongForm(Model model) {

        model.addAttribute("title", "New Song");

        Integer bigNumber = 100;

        int[] array = new int[bigNumber];

        for (Integer i = 0; i < bigNumber; i++) {
            array[i] = i;
        }

        model.addAttribute("array", array);

        return "lhv/new-song";

    }

    @RequestMapping(value="new-song", method=RequestMethod.POST)
    public String processNewSongForm(Model model, @RequestBody String string) throws UnsupportedEncodingException {

        //make sure that we are dealing with URL-encoded JSON string
        if (string.charAt(0) == '%') {
           String encodedJson = string;

           String decodedJson = URLDecoder.decode(encodedJson, "UTF-8");



            //URLDecoder.decode returns a String with an extra '=' at the end
            //need to get substring
            int stringSize = decodedJson.length();
            String json = decodedJson.substring(0, stringSize - 1);

            //convert JSON string to Java object with Gson

            Gson gson = new Gson();
            Song song = gson.fromJson(json, Song.class);


            //save song to database

            songDAO.save(song);
        }

        return "redirect:";
    }

    @RequestMapping(value = "song/{id}", method = RequestMethod.GET)
    public String displaySong(Model model, @PathVariable int id) {
        Song oldSong = songDAO.findOne(id);

        //for some reason we have to re-create the song in order for Gson to accept it
        String title = oldSong.getTitle();

        List<Chord> oldList = oldSong.getChords();
        List<Chord> newList = new ArrayList<Chord>();


        for (int i = 0; i < oldList.size(); i++) {
            Chord oldChord = oldList.get(i);
            String root = oldChord.getRoot();
            String quality = oldChord.getQuality();
            String form = oldChord.getForm();
            String lyrics = oldChord.getLyrics();
            Chord newChord = new Chord(root, quality, form, lyrics);
            newList.add(newChord);

        }

        Song newSong = new Song(title, newList);


        //convert Song object (newSong) to JSON string with Gson
        Gson gson = new Gson();
        String json = gson.toJson(newSong);


        //add array of integers to model
        //Thymeleaf will use integers to give each chord div in HTML a unique id
        int[] array = new int[newSong.getChords().size()];
        for (int i = 0; i < newSong.getChords().size(); i++) {
            array[i] = i;
        }

        model.addAttribute("array", array);
        model.addAttribute("song", newSong);
        model.addAttribute("json", json);

        return "lhv/song";
    }

    @RequestMapping(value = "edit", method = RequestMethod.POST)
    public String editSong(Model model, @RequestBody String string) throws UnsupportedEncodingException {


        //make sure that we are dealing with URL-encoded JSON string
        if (string.charAt(0) == '%') {
            String encodedJson = string;

            String decodedJson = URLDecoder.decode(encodedJson, "UTF-8");


            //URLDecoder.decode returns a String with an extra '=' at the end
            //need to get substring to get rid of it
            int stringSize = decodedJson.length();
            String json = decodedJson.substring(0, stringSize - 1);



            //convert JSON string to Java object with Gson

            Gson gson = new Gson();
            Song newSong = gson.fromJson(json, Song.class);



            int songId = newSong.getId();
            Song savedSong = songDAO.findOne(songId);

            if (!savedSong.getTitle().equals(newSong.getTitle())) {
                savedSong.setTitle(newSong.getTitle());
            }


            List<Chord> savedChords = savedSong.getChords();
            List<Chord> newChords = newSong.getChords();


            //iterate through savedChords, compare them to newChords, update data if necessary
            for (int i = 0; i < savedChords.size(); i++) {
                if (!savedChords.get(i).getRoot().equals(newChords.get(i).getRoot())) {
                    savedChords.get(i).setRoot(newChords.get(i).getRoot());
                }
                if (!savedChords.get(i).getQuality().equals(newChords.get(i).getQuality())) {
                    savedChords.get(i).setQuality(newChords.get(i).getQuality());
                }
                if (!savedChords.get(i).getForm().equals(newChords.get(i).getForm())) {
                    savedChords.get(i).setForm(newChords.get(i).getForm());
                }
                if (!savedChords.get(i).getLyrics().equals(newChords.get(i).getLyrics())) {
                    savedChords.get(i).setLyrics(newChords.get(i).getLyrics());
                }

            }

            //save song to database

            songDAO.save(savedSong);
        }

        return "redirect:/lhv";
    }

    @RequestMapping(value = "delete", method = RequestMethod.GET)
    public String displayDeleteSongForm(Model model) {
        model.addAttribute("songs", songDAO.findAll());
        model.addAttribute("title", "Delete Song");
        return "lhv/delete";
    }

    @RequestMapping(value = "delete", method = RequestMethod.POST)
    public String processDeleteSongForm(@RequestParam int[] songIds) {

        for (int songId : songIds) {
            songDAO.delete(songId);
        }

        return "redirect:";
    }



}
