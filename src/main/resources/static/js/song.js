$(document).ready(function() {

    $('#json').hide();
    $('#nav-bar').hide();
    $('.input').hide();

    var jsonElement = document.getElementById('json');
    var jsonString = jsonElement.textContent;
    var song = JSON.parse(jsonString);
    $('h1').text(song.title);



    //setup the view-model with empty objects
    displayed = [];

    for (var i = 0; i < song.chords.length; i++) {
        displayed.push({});
    }



    $('#edit').on('click', function(){
        $('h1').hide();
        $('#nav-bar').show();
        $('#player-piano').hide();
        $('.input').show();
        $('#title').val(song.title);

    });






  $('#save-song').submit(function(e){
    e.preventDefault();


    var title = $('#title').val();
    song.title = title;

    //filter out empty chord objects

    var newArray = [];

    for (var i = 0; i < song.chords.length; i++) {
        if (song.chords[i].root && song.chords[i].quality) {
            newArray.push(song.chords[i]);
        }
    }

    song.chords = newArray;

    //extract number from path name and assign it to song ID
    var pathname = window.location.pathname;
    var songId = pathname.replace(/\D/g, '');
    song.id = songId;

    var newSongStr = JSON.stringify(song);
    console.log(newSongStr);


    $.ajax({
        type: "POST",
        url: "http://localhost:8080/lhv/edit.html",
        data: newSongStr,
        dataType: 'json',
        success: function(){alert(newSongStr)},
    });


        $('h1').text(song.title);
        $('h1').show();
        $('#edit').hide();
        $('#player-piano').show();
        $('#nav-bar').hide();
        $('.input').hide();


  });

    //get rid of previously displayed chord tones (if necessary)
    function clearChord(chordIndex, pianoId) {
      if (displayed[Number(chordIndex)] && displayed[Number(chordIndex)].tones) {
        for (var i = 1; i < displayed[chordIndex].tones.length; i++) {
          selector = "#" + pianoId + " div." + displayed[chordIndex].tones[i].midi;
          $(selector).removeClass('highlight');
          $(selector).text("");
        }
      }
    }
      //get input from chord select form
      var root = $("#" + this.id + ' select.selectRoot').val();
      var quality = $("#" + this.id + ' select.selectQuality').val();
      var form = $("#" + this.id + ' select.selectForm').val();


    function displayChord(pianoId, chord, chordSymbol) {



      $(chordSymbol).text(chord.rootDisplay + chord.qualityDisplay);
      //$(lyricsDisplay).text(lyrics);

      for (var tone = 1; tone < chord.tones.length; tone++) {
        selector = "#" + pianoId + " div." + chord.tones[tone].midi;
        $(selector).addClass('highlight');
        $(selector).text(chord.tones[tone].degree);
      }
    }




    function displaySong() {
      for (var i = 0; i < song.chords.length; i++) {
        if (song.chords[i].root && song.chords[i].quality && song.chords[i].form) {
          root = song.chords[i].root;
          quality = song.chords[i].quality;
          form = song.chords[i].form;
          lyrics = song.chords[i].lyrics

        var rootSelect = $("#" + i + ' .root-select');
                $(rootSelect).val(root);

        var qualitySelect = $("#" + i + ' .quality-select');
                $(qualitySelect).val(quality);

        var formSelect = $("#" + i + ' .form-select');
                $(formSelect).val(form);

        var lyricsInput = $("#" + i + ' .lyrics-input');
        $(lyricsInput).val(lyrics);

        //get values to pass to displayChord()
        chord = billEvans(root, quality, form);

        displayed[i] = chord;

        lyricDisplay = "#" + i + " .lyrics"
        chordSymbol = "#" + i + " .chord-symbol";

        //display values


        $(lyricDisplay).text(lyrics);
        displayChord(i, chord, chordSymbol);

        }

      }

    }

    displaySong();

    function playSong() {

        var i = 0;
        var j = -1;
        var intId = setInterval(chordsInSong, 1500);

        function chordsInSong() {
          if (song.chords[i].root && song.chords[i].quality && song.chords[i].form) {
            root = song.chords[i].root;
            quality = song.chords[i].quality;
            form = song.chords[i].form;

            //get values
            chord = billEvans(root, quality, form);

            chordDisplay = "#player-piano .chord-symbol";

            display = "player-piano"

          //display values

            clearChord(j , display);
            displayChord(display, chord, chordDisplay);
            if (song.chords[i].lyrics === "") {
                $("#player-piano .lyrics").text("...");
            } else {
                $("#player-piano .lyrics").text(song.chords[i].lyrics);
            }


            if (i < song.chords.length) {
               displayed[i] = chord;
            }

            if ( i + 1 == song.chords.length) {
              i = 0;
            } else {
              i++;
            }

            if (j == song.chords.length - 1) {
              j = 0;
            } else {
              j++;
            }


          }
        }
        console.log(song);;
        console.log(displayed);
      }

      playSong();


  $('.chord-selection').submit(function(e){
      e.preventDefault();


      //get rid of previously displayed chord tones (if necessary)
      if (displayed[Number(this.id)].tones) {
        for (var i = 1; i < displayed[this.id].tones.length; i++) {
          selector = "#" + this.id + " div." + displayed[this.id].tones[i].midi;
          $(selector).removeClass('highlight');
          $(selector).text("");
        }
      }
      //get input from chord-select form
      var root = $("#" + this.id + ' .root-select').val();
      var quality = $("#" + this.id + ' .quality-select').val();
      var form = $("#" + this.id + ' .form-select').val();
      var lyrics = $("#" + this.id + ' .lyrics-input').val();

      //get chord tone values
      chord = billEvans(root, quality, form);

      lyricsDisplay = "#" + this.id + " .lyrics"
      chordDisplay = "#" + this.id + " .chord-symbol";


      //display values: lyrics and chord symbol
      $(lyricsDisplay).text(lyrics);
      $(chordDisplay).text(chord.rootDisplay + chord.qualityDisplay);
      //$(rootDisplay).text(chord.rootDisplay);
      //$(qualityDisplay).text(chord.qualityDisplay);


      //display values: piano voicing
      for (var i = 1; i < chord.tones.length; i++) {
        selector = "#" + this.id + " div." + chord.tones[i].midi;
        $(selector).addClass('highlight');
        $(selector).text(chord.tones[i].degree);
      };


      //update array: view model
      displayed[Number(this.id)] = chord;

      //update array: model
      selection = {'root': root, 'quality': quality, 'form': form, 'lyrics': lyrics};
      song.chords[Number(this.id)] = selection;

    });



  function billEvans(root, quality, form) {

    chord = {};


    //get proper sharp and flat characters for display
    roots = {
      "C"  : "C",
      "C#" : "C♯",
      "Db" : "D♭",
      "D"  : "D",
      "D#" : "D♯",
      "Eb" : "E♭",
      "E"  : "E",
      "F"  : "F",
      "F#" : "F♯",
      "Gb" : "G♭",
      "G"  : "G",
      "G#" : "G♯",
      "Ab" : "A♭",
      "A"  : "A",
      "A#" : "A♯",
      "Bb" : "B♭",
      "B"  : "B"
    }

    chord.rootDisplay = roots[root];

    qualities = {       "maj7"      : "maj7",
    					"6/9"       : "6/9",
    					"maj7#11"   : "maj7(♯11)",
                        "maj7#5"    : "maj7♯5",
                        "maj7sus4"  : "maj7sus4",
    					"min7"      : "-7",
    					"min6"      : "-6",
    					"min/maj7"  : "-maj7",
                        "minb6"     : "-(♭6)",
                        "sus4b9"    : "sus4(♭9)",
    					"7"         : "7",
    					"7alt"      : "7alt",
    					"7sus4"     : "7sus4",
    					"7#11"      : "7(♯11)",
    					"7b9#11"    : "7(♭9♯11)",
                        "7sus4b9"   : "7sus4(♭9)",
                        "7b13"      : "7(♭13)",
    					"min7b5"    : "-7♭5",
    					"dim7"      : "°",
    }

    chord.qualityDisplay = qualities[quality];


    // numbers are MIDI notes from C3 - B3
    octave3 = {
      "C"  : 48,
      "C#" : 49,
      "Db" : 49,
      "D"  : 50,
      "D#" : 51,
      "Eb" : 51,
      "E"  : 52,
      "F"  : 53,
      "F#" : 54,
      "Gb" : 54,
      "G"  : 55,
      "G#" : 56,
      "Ab" : 56,
      "A"  : 57,
      "A#" : 58,
      "Bb" : 58,
      "B"  : 59
    }

    root = octave3[root];

    bass  = {midi: root - 12, degree: '1'}

    //list intervals
    p1    = {midi: root, degree: '1'}

    min2  = {midi: root + 1, degree: '♭9'}

    maj2  = {midi: root + 2, degree: '9'}

    min3  = {midi: root + 3, degree: '♭3'}

    maj3  = {midi: root + 4, degree: '3'}

    p4    = {midi: root + 5, degree: '4'}
    p11   = {midi: root + 5, degree: '11'}

    aug11 = {midi: root + 6, degree: '♯11'}
    dim5  = {midi: root + 6, degree: '♭5'}

    p5    = {midi: root + 7, degree: '5'}

    aug5  = {midi: root + 8, degree: '♯5'}
    min6  = {midi: root + 8, degree: '♭6'}
    min13 = {midi: root + 8, degree: '♭13'}

    maj6  = {midi: root + 9, degree: '6'}
    maj13 = {midi: root + 9, degree: '13'}
    dim7  = {midi: root + 9, degree: '♭♭7'}

    min7  = {midi: root + 10, degree: '♭7'}

    maj7  = {midi: root + 11, degree: '7'}

    p8  = {midi: root + 12, degree: '1'}

    min9  = {midi: root + 13, degree: '♭9'}

    maj9  = {midi: root + 14, degree: '9'}

    aug9  = {midi: root + 15, degree: '♯9'}

    maj10 = {midi: root + 16, degree: '3'}


    function minor7(root) {

      chord.tones = [bass , min3, p5, min7, maj9];
      return chord;
    }
    if (quality === "min7"){
      minor7(root)
    }

    function dominant7(root) {

      chord.tones = [bass , maj3, maj13, min7, maj9];
      return chord;
    }
    if (quality === "7"){
      dominant7(root)
    }

    function major7(root) {

      chord.tones = [bass , maj3, p5, maj7, maj9];
      return chord;
    }
    if (quality === "maj7"){
      major7(root)
    }

    function major6(root) {

      chord.tones = [bass , maj3, p5, maj6, maj9];
      return chord;
    }
    if (quality === "6/9"){
      major6(root)
    }

    function minor7b5(root) {

      chord.tones = [bass, p1, p11, dim5, min7];
      return chord;
    }
    if (quality === "min7b5"){
      minor7b5(root)
    }


    function altDominant7(root) {

      chord.tones = [bass, maj3, min13, min7, aug9];
      return chord;
    }
    if (quality === "7alt"){
      altDominant7(root)
    }

    function minorMajor7(root) {

      chord.tones = [bass, min3, p5, maj7, maj9];
      return chord;
    }
    if (quality === "min/maj7"){
      minorMajor7(root)
    }

    function minor6(root) {

      chord.tones = [bass, min3, p5, maj6, maj9];
      return chord;
    }
    if (quality === "min6") {
      minor6(root)
    }

    function diminished7(root) {

      chord.tones = [bass, min3, dim5, dim7, maj9];
      return chord;
    }
    if (quality === "dim7") {
      diminished7(root)
    }

    function major7aug11(root) {

      chord.tones = [bass, p1, maj3, aug11, maj7];
      return chord;
    }
    if (quality === "maj7#11") {
      major7aug11(root)
    }

    function dominant7sus4(root) {

      chord.tones = [bass, p4, maj13, min7, maj9];
      return chord;
    }
    if (quality === "7sus4") {
      dominant7sus4(root)
    }

    function dominant7sus4b9(root) {

      chord.tones = [bass, min2, p4, p5, p8];
      return chord;
    }
    if (quality === "7sus4b9") {
      dominant7sus4b9(root)
    }

    function dominant7aug11(root) {

      chord.tones = [bass, maj3, aug11, min7, maj9];
      return chord;
    }
    if (quality === "7#11") {
      dominant7aug11(root)
    }

    function dominant7b13(root) {

      chord.tones = [bass, maj2, p5, min13, p8];
      return chord;
    }
    if (quality === "7b13") {
      dominant7b13(root)
    }

    function dominant7min9aug11(root) {

      chord.tones = [bass, maj3, aug11, min7, min9];
      return chord;
    }
    if (quality === "7b9#11") {
      dominant7min9aug11(root)
    }

    function sus4min9(root) {

      chord.tones = [bass, min2, p4, min13, p8];
      return chord;
    }
    if (quality === "sus4b9") {
      sus4min9(root)
    }

    function minorb6(root) {

      chord.tones = [bass, maj2, p5, min6, p8];
      return chord;
    }
    if (quality === "minb6") {
      minorb6(root)
    }

    function major7sus4(root) {

      chord.tones = [bass, p4, maj13, maj7, maj10];
      return chord;
    }
    if (quality === "maj7sus4") {
      major7sus4(root)
    }

    function major7aug5(root) {
      chord.tones = [bass, p1, maj3, aug11, maj7];
      return chord;
    }
    if (quality === "maj7#5") {
      major7aug5(root)
    }





     // invert from A-form to B-form if necessary

    function invert(chordTones) {

      if (form === "B") {
        chord.tones[3].midi -= 12;
        chord.tones[4].midi -= 12;
      }
      temp1 = chord.tones[1]
      temp2 = chord.tones[2]
      chord.tones[1] = chord.tones[3];
      chord.tones[2] = chord.tones[4];
      chord.tones[3] = temp1;
      chord.tones[4] = temp2;

      return chord;

  }

    if (form === "B") {
      invert(chord);
    }
    // make sure that highest note of chord is between middle C(included) and the octave above(excluded)
    // move each chord tone up or down one octave if necessary

    function ruleOfThumb(chordTones){
      if (chord.tones[4].midi < 60) {
        // shift all chord tones up one octave
        for (var i = 0; i < chord.tones.length; i++) {
          chord.tones[i].midi += 12;
        }
      } else if (chord.tones[4].midi >= 72) {
        // shift all chord tones down one octave
        for (var i = 0; i < chord.tones.length; i++) {
          chord.tones[i].midi -= 12;
        }
      }
      return chord;
    }

    while (chord.tones[4].midi < 60 || chord.tones[4].midi >= 72) {
      ruleOfThumb(chord);
    }

  return chord;

  };




});