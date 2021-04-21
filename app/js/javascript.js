version = "1.1"

// Defaults class
wordDefaults = {

  // Default words. Currently supports 3, will start with 2, but soon support as many as user wants.
  // Default words are currently based on previous Ubuntu version names. Note: I'm not affiliated with them at all.
  words1: "Warty Hoary Breezy Dapper Edgy Feisty Gutsy Hardy Intrepid Jaunty Karmic Lucid Maveric Natty Oneiric Precise Quantal Raring Saucy Trusty Utopic Vivid Wily Xenial Yakkety Zesty Artful Bionic Cosmic Disco Eoan Focal Groovy Hisute",
  words2: "Warthog Hedgehog Badger Drake Eft Fawn Gibbon Heron Ibex Jackalope Koala Lynx Meerkat Narwhal Ocelot Pangolin Quetzal Ringtail Salamander Tahr Unicorn Vervet Werewolf Xerus Yak Zupus Aardvark Beaver Cuttlefish Dingo Ermine Fossa Gorilla Hippo",
  words3: "",

  // Set localStorage back to defaults
  set: function() {

    localStorage.words1 = this.words1
    localStorage.words2 = this.words2
    localStorage.words3 = this.words3

  }

}

// Do this on startup
$("document").ready(function() {

  // Set the defaults if they haven't been set
  if (!localStorage.words1) wordDefaults.set()

  // Load the defaults into the edit boxes
  $("#edit1").val(localStorage.words1)
  $("#edit2").val(localStorage.words2)
  $("#edit3").val(localStorage.words3)

  generate()

  // Place the Namegen version on the footer
  $("#namegenVersion").text(version)

})


// Select a random value from an array
function randWord(words) {

  return words[Math.floor(Math.random()*words.length)];

}

// Generate a new name from all three boxes
function generate() {

  // Turn each set of words into an array
  var word1 = randWord(localStorage["words1"].split(" "))
  var word2 = randWord(localStorage["words2"].split(" "))
  var word3 = randWord(localStorage["words3"].split(" "))

  // If words after the first are not blank, add a space to before it and append it to the final word
  word1 += (word2 != "") ? " "+word2 : ""
  word1 += (word3 != "") ? " "+word3 : ""

  // Output the final words. Excluding word3 for now
  $("#generatedName").text(word1)

}

// Generate button
$(document).on("click", "#generate", function(e) {
  generate()
})

// Edit button
$(document).on("click", "#edit", function(e) {

    // Enable edit section
    $("#generatedName,#footer").slideUp() // Also hide the footer because it gets in the way when mobile keyboard is in use
    $("#editSection").slideDown()
    $("input.editButtons").show()
    $("#generate, #edit").hide()

})

// Save button
$(document).on("click", "#save", function(e) {

  // This is a quick app so it won't do much checking to see if the textarea boxes are valid. It's just going to save the whole value directly to the localStorage
  var words1 = $("#edit1").val()
  var words2 = $("#edit2").val()
  var words3 = $("#edit3").val()

  // If all three are blank, cancel instead
  if (words1 == "" && words2 == "" && words3 =="") {
    $("#cancel").trigger("click")
    return false
  }

  // Save settings
  localStorage.words1 = words1
  localStorage.words2 = words2
  localStorage.words3 = words3

  // Hide the edit area and bring back the home screen
  $("#editSection").slideUp()
  $("#generatedName,#footer").slideDown()
  $("input.editButtons").hide()
  $("#generate, #edit").show()

  // Generate a new word using the new lists
  generate()

})

// Cancel button
$(document).on("click", "#cancel", function(e) {

  // Load the last set words into the edit boxes
  $("#edit1").val(localStorage.words1)
  $("#edit2").val(localStorage.words2)
  $("#edit3").val(localStorage.words3)

  // Hide the edit area and bring back the home screen
  $("#editSection").slideUp()
  $("#generatedName,#footer").slideDown()
  $("input.editButtons").hide()
  $("#generate, #edit").show()

})

// Clear button
$(document).on("mouseup", "#clear", function(e) {

    // Put the default content into the word boxes. If the user cancels after resetting, it will go back to what they had before editing
    $("#edit1,#edit2,#edit3").val("")

})

// Reset button
$(document).on("click", "#reset", function(e) {

  // Put the default content into the word boxes. If the user cancels after resetting, it will go back to what they had before editing
  $("#edit1").val(wordDefaults.words1)
  $("#edit2").val(wordDefaults.words2)
  $("#edit3").val(wordDefaults.words3)

})

// Generate new word on spacebar click
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body && $("#generatedName").is(":visible")) {
    $("#generate").trigger("click")
    e.preventDefault();
    //console.log(e)
  }
});
