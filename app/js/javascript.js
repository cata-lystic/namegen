version = "1.1"

// Defaults class
wordDefaults = {

  // Default words. Currently supports 3, will start with 2, but soon support as many as user wants.
  // Default words are currently based on previous Ubuntu version names. Note: I'm not affiliated with them at all.
  words1: "Warty Hoary Breezy Dapper Edgy Feisty Gutsy Hardy Intrepid Jaunty Karmic Lucid Maveric Natty Oneiric Precise Quantal Raring Saucy Trusty Utopic Vivid Wily Xenial Yakkety Zesty Artful Bionic Cosmic Disco Eoan Focal Groovy Hisute",
  words2: "Warthog Hedgehog Badger Drake Eft Fawn Gibbon Heron Ibex Jackalope Koala Lynx Meerkat Narwhal Ocelot Pangolin Quetzal Ringtail Salamander Tahr Unicorn Vervet Werewolf Xerus Yak Zupus Aardvark Beaver Cuttlefish Dingo Ermine Fossa Gorilla Hippo",
  words3: "",

  fontColor: "#000000",
  shadowH: "3",
  shadowV: "3",
  shadowBlur: "5",
  shadowColor: "#4d4d4d",
  shadowEnabled: "0", // disabled by default

  // Set localStorage back to defaults
  set: function(choice) {

    // Reset words
    if (choice == "words" || choice == "all") {
      localStorage.words1 = this.words1
      localStorage.words2 = this.words2
      localStorage.words3 = this.words3
    }

    // Reset colors
    if (choice == "colors" || choice == "all") {
      localStorage.fontColor = this.fontColor
      localStorage.shadowH = this.shadowH
      localStorage.shadowV = this.shadowV
      localStorage.shadowBlur = this.shadowBlur
      localStorage.shadowColor = this.shadowColor
      localStorage.shadowEnabled = this.shadowEnabled

      $("#generatedName").css({"color" : this.fontColor})
      if (this.shadowEnabled == "1") {
        $("#generatedName").css({"text-shadow" : this.shadowH+"px "+this.shadowV+"px "+this.shadowBlur+"px "+this.shadowColor})
      } else {
        $("#generatedName").css({"text-shadow" : ""})
      }
      $("#opShadowH").val(this.shadowH)
      $("#opShadowV").val(this.shadowV)
      $("#opShadowBlur").val(this.shadowBlur)
      $("#opFontColor").spectrum({color: this.fontColor})
      $("#opShadowColor").spectrum({color: this.shadowColor})
    }

  }

}

// Do this on startup
$("document").ready(function() {

  // Set the default words if they haven't been set
  if (!localStorage.words1) wordDefaults.set("words")

  // Load the defaults into the edit boxes
  $("#edit1").val(localStorage.words1)
  $("#edit2").val(localStorage.words2)
  $("#edit3").val(localStorage.words3)

  // Set the default colors if they haven't been setting
  if (!localStorage.shadowH) {
    wordDefaults.set("colors")
  }

  // Load selected or default colors
  $("#generatedName").css({"color" : localStorage.fontColor})

  // Give text a shadow if enabled and show inputs
  if (localStorage.shadowEnabled == "1") {
    $("#generatedName").css({"text-shadow" : localStorage.shadowH+"px "+localStorage.shadowV+"px "+localStorage.shadowBlur+"px "+localStorage.shadowColor})

    $("#opTextShadowsInputs").show()
  }

  // Generate a word to begin with
  generate()

  // Place the Namegen version on the footer
  $("#namegenVersion").text(version)

  // Create the Colorpickers in options
  $(".spectrum").spectrum({
    preferredFormat: "hex",
    showInput: true
  });

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
  $("#generate, #edit, #optionsButton").show()

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
  $("#generate, #edit, #optionsButton").show()

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


/* OPTIONS */

// Toggle Options dialog box
$(document).on("click", ".optionsButton", function(e) {

  // Check if Options box is already open
  if ( $("#options").is(":visible") ) {

    // Disable any events from when it was turned on
    $(document).off("mouseenter", "#options")
    $(document).off("click", "#center")

    $("#options").fadeOut()

  } else {

    // Create an event that changes the opacity of the Options dialog as you hover over it so you can preview your font changes
    $(document).on('mouseenter', '#options',  function(){
      $("#options").css({"opacity" : "1.0"})
    }).on('mouseleave', '#options', function() {
      $("#options").css({"opacity" : "0.3"})
    });

    // Create an event that closes the Options box when you click out of it
    $(document).on('click', '#center',  function(){
      if ($(this).attr("id") != "options") {
        $("#optionsButton").trigger("click")
      }
    })

    $("#options").fadeIn()

  }


})



// Change font color
$(document).on("change", "#opFontColor", function(e) {

  var fontColor = $(this).val()
  $("#generatedName").css({"color": fontColor})
  localStorage.fontColor = fontColor

})

// Toggle Text Shadow options when enabled/disabled
$(document).on("click", "#opShadowEnabled", function(e) {

  // Check if shadows were enabled or disabled
  if ( $(this).prop("checked") == true ) {
    $("#opTextShadows input").trigger("change") // "Change" an input so it loads the default text shadow
    $("#opTextShadowsInputs").slideDown()
    localStorage.shadowEnabled = "1"
  } else {
    $("#generatedName").css({"text-shadow": ""})
    $("#opTextShadowsInputs").slideUp()
    localStorage.shadowEnabled = "0"
  }

})

// Change text shadow
$("#opTextShadows").on("change", "input", function(e) {

  // Grab the selected inputs. Check to make sure they're numbers later ;)
  var shadowH = $("#opShadowH").val()
  var shadowV = $("#opShadowV").val()
  var blur = $("#opShadowBlur").val()
  var color = $("#opShadowColor").val()

  $("#generatedName").css({"text-shadow" : shadowH+"px "+shadowV+"px "+blur+"px "+color})

  // Save settings
  localStorage.shadowH = shadowH
  localStorage.shadowV = shadowV
  localStorage.shadowBlur = blur
  localStorage.shadowColor = color

})

// Reset options to default
$(document).on("click", "#defaultOptions", function(e) {

  // Don't reset words at the moment since they're separate from options
  wordDefaults.set("colors")

  // Uncheck the Shadow Enabled box and hide the Shadow options
  $("#opShadowEnabled").prop({"checked" : "" })
  $("#opTextShadowsInputs").slideUp()

})

// Clear all localStorage data and reload the page
$(document).on("click", "#clearData", function(e) {

  var askFirst = confirm("Would you like to clear all data, including words?")

  if (askFirst == true) {

    localStorage.clear()
    window.location = window.location

  }

})



// Generate new word on spacebar click
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body && $("#generatedName").is(":visible")) {
    $("#generate").trigger("click")
    e.preventDefault();
    //console.log(e)
  }
});
