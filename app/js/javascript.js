version = "1.4"

// Defaults class
wordDefaults = {

  // Default words. Currently supports 3, will start with 2, but soon support as many as user wants.
  // Default words are currently based on previous Ubuntu version names. Note: I'm not affiliated with them at all.
  words1: "Warty Hoary Breezy Dapper Edgy Feisty Gutsy Hardy Intrepid Jaunty Karmic Lucid Maveric Natty Oneiric Precise Quantal Raring Saucy Trusty Utopic Vivid Wily Xenial Yakkety Zesty Artful Bionic Cosmic Disco Eoan Focal Groovy Hisute",
  words2: "Warthog Hedgehog Badger Drake Eft Fawn Gibbon Heron Ibex Jackalope Koala Lynx Meerkat Narwhal Ocelot Pangolin Quetzal Ringtail Salamander Tahr Unicorn Vervet Werewolf Xerus Yak Zupus Aardvark Beaver Cuttlefish Dingo Ermine Fossa Gorilla Hippo",
  words3: "",

  fontColor: "#000000",
  fontSize: "68", /* currently in 'px' units */
  shadowH: "3",
  shadowV: "3",
  shadowBlur: "5",
  shadowColor: "#4d4d4d",
  shadowEnabled: "1",

  backgroundURL: "app/img/background.jpg",
  screenshotTime: 5, // 5 seconds
  rotation: 0, // 0 degrees
  rotateX: 0,
  rotateY:  0,
  rotateZ:  0,
  skewX:  0,
  skewY:  0,
  posX:  0,
  posY:  0,

  // Set localStorage back to defaults
  set: function(choice) {

    // Reset words
    if (choice == "words") {
      localStorage.words1 = this.words1
      localStorage.words2 = this.words2
      localStorage.words3 = this.words3
    }

    // Reset colors
    if (choice == "colors" || choice == "all") {
      localStorage.fontColor = this.fontColor
      localStorage.fontSize = this.fontSize
      localStorage.shadowH = this.shadowH
      localStorage.shadowV = this.shadowV
      localStorage.shadowBlur = this.shadowBlur
      localStorage.shadowColor = this.shadowColor
      localStorage.shadowEnabled = this.shadowEnabled

      $("#generatedName").css({"color" : this.fontColor})
      if (this.shadowEnabled == "1") {
        $("#generatedName").css({"text-shadow" : this.shadowH+"px "+this.shadowV+"px "+this.shadowBlur+"px "+this.shadowColor})
        $("#opShadowEnabled").prop({"checked":"checked"})
        $("#opTextShadowsInputs").slideDown()
      } else {
        $("#generatedName").css({"text-shadow" : ""})
        $("#opShadowEnabled").prop({"checked":""})
        $("#opTextShadowsInputs").slideUp()
      }
      $("#opShadowH").val(this.shadowH)
      $("#opShadowV").val(this.shadowV)
      $("#opShadowBlur").val(this.shadowBlur)
      $("#opFontColor").spectrum({color: this.fontColor})
      $("#opFontSize").val(this.fontSize)
      $("#opShadowColor").spectrum({color: this.shadowColor})
    }

    if (choice == "bg" || choice == "all") {

      localStorage.backgroundURL = this.backgroundURL
      $("html").css({"background-image": "url("+this.backgroundURL+")"})
      $("#opBackgroundURL").val(this.backgroundURL)

    }

    if (choice == "all") {
      localStorage.screenshotTime = this.screenshotTime
      $("#opScreenshotTime").val(this.screenshotTime)
    }

    if (choice == "textTransform" || choice == "all") {
      localStorage.rotateX = this.rotateX
      localStorage.rotateY = this.rotateY
      localStorage.rotateZ = this.rotateZ
      localStorage.skewX = this.skewX
      localStorage.skewY = this.skewY
      localStorage.posX = this.posX
      localStorage.posY = this.posY

      // While these are all 0 just set all numbers to 0
      $(".textTransform[type='number']").val(0)

      $("#opRotateX").trigger("change")
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

  // Set the default colors if they haven't been set
  if (!localStorage.shadowH) {
    wordDefaults.set("colors")
  }

  // Set the default background if it hasn't been set
  if (!localStorage.backgroundURL) {
    wordDefaults.set("bg")
  }

  // Set default Screenshot time if it hasn't been set (consolidating all these soon)
  if (!localStorage.screenshotTime) {
    localStorage.screenshotTime = wordDefaults.screenshotTime;
  }

  if (!localStorage.rotateX) {
    wordDefaults.set("textTransform")
  }
  $("#opRotateX").val(localStorage.rotateX)
  $("#opRotateY").val(localStorage.rotateY)
  $("#opRotateZ").val(localStorage.rotateZ)
  $("#opSkewX").val(localStorage.skewX)
  $("#opSkewY").val(localStorage.skewY)
  $("#opPosX").val(localStorage.posX)
  $("#opPosY").val(localStorage.posY)
  $("#opRotateX").trigger("change")

  // Load selected or default colors and fill in the input boxes in Options
  $("#generatedName").css({"color" : localStorage.fontColor})
  $("#opShadowH").val(localStorage.shadowH)
  $("#opShadowV").val(localStorage.shadowV)
  $("#opShadowBlur").val(localStorage.shadowBlur)
  $("#opFontColor").attr({"value": localStorage.fontColor})
  $("#opShadowColor").attr({"value": localStorage.shadowColor})
  $("#opFontSize").val(localStorage.fontSize)
  $("html").css({"background-image" : "url("+localStorage.backgroundURL+")"})
  $("#opBackgroundURL").val(localStorage.backgroundURL)
  $("#opScreenshotTime").val(localStorage.screenshotTime)
  $("#generatedName").css({"transform": "rotate("+localStorage.rotation+"deg)"})

  // Give text a shadow if enabled and show inputs
  if (localStorage.shadowEnabled == "1") {
    $("#generatedName").css({"text-shadow" : localStorage.shadowH+"px "+localStorage.shadowV+"px "+localStorage.shadowBlur+"px "+localStorage.shadowColor})
    $("#opShadowEnabled").prop({"checked":"checked"})
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
    $("#generate, #edit, #takeScreenshot").hide()

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
  $("#generate, #edit, #optionsButton, #takeScreenshot").show()

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
  $("#generate, #edit, #optionsButton, #takeScreenshot").show()

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

    $("#options").css({"opacity" : "1.0"}).fadeIn()

  }


})



// Change font color
$(document).on("change", "#opFontColor", function(e) {

  var fontColor = $(this).val()
  $("#generatedName").css({"color": fontColor})
  localStorage.fontColor = fontColor

})

// Change font size
$(document).on("change", "#opFontSize", function(e) {

  var fontSize = parseInt($(this).val())

  // If font size is not a number, reset to last working number
  if (!isNumber(fontSize)) {
    $("#opFontSize").val(localStorage.fontSize)
  } else {
    $("#generatedName").css({"font-size": fontSize+"px"})
    localStorage.fontSize = fontSize
  }

})

// Change word rotation and skew
$(document).on("change", ".textTransform", function(e) {

  var rotateX = parseInt($("#opRotateX").val())
  var rotateY = parseInt($("#opRotateY").val())
  var rotateZ = parseInt($("#opRotateZ").val())
  var skewX = parseInt($("#opSkewX").val())
  var skewY = parseInt($("#opSkewY").val())
  var posX = parseInt($("#opPosX").val())
  var posY = parseInt($("#opPosY").val())

  $("#generatedName").css({"transform": "rotateX("+rotateX+"deg) rotateY("+rotateY+"deg) rotateZ("+rotateZ+"deg) skew("+skewX+"deg, "+skewY+"deg) translateX("+posX+"px) translateY("+posY+"px)"})

  localStorage.rotateX = rotateX
  localStorage.rotateY = rotateY
  localStorage.rotateZ = rotateZ
  localStorage.skewX = skewX
  localStorage.skewY = skewY
  localStorage.posX = posX
  localStorage.posY = posY

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
  var shadowH = parseInt($("#opShadowH").val())
  var shadowV = parseInt($("#opShadowV").val())
  var blur = parseInt($("#opShadowBlur").val())
  var color = $("#opShadowColor").val()

  // If any aren't a number, reset to last working number
  if (!isNumber(shadowH)) {
    $("#opShadowH").val(localStorage.shadowH)
  }

  if (!isNumber(shadowV)) {
    $("#opShadowV").val(localStorage.shadowV)
  }

  if (!isNumber(blur)) {
    $("#opShadowBlur").val(localStorage.shadowBlur)
  }

  $("#generatedName").css({"text-shadow" : localStorage.shadowH+"px "+localStorage.shadowV+"px "+localStorage.shadowBlur+"px "+color})

  // Save settings
  localStorage.shadowH = shadowH
  localStorage.shadowV = shadowV
  localStorage.shadowBlur = blur
  localStorage.shadowColor = color

})

// Change background
$(document).on("click", "#opBackgroundChange", function(e) {

  var bg = $("#opBackgroundURL").val()

  if (bg == "background.jpg" || bg == "") {

    $("html").css({"background-image":"url(app/img/background.jpg)"})
    localStorage.backgroundURL = "app/img/background.jpg"

  } else {

    $("html").css({"background-image":"url("+bg+")"})
    localStorage.backgroundURL = bg

  }


})

// Reset background
$(document).on("click", "#opBackgroundReset", function(e) {

  $("html").css({"background-image":"url(app/img/background.jpg)"})
  $("#opBackgroundURL").val("background.jpg")

})


// Change Screenshot Timeout time (Mobile Only)
$(document).on("change", "#opScreenshotTime", function(e) {

  var ssTime = $(this).val()

  // Make sure it's a number
  if (!isNumber(ssTime)) {

    // If it's not, reset to last working number
    $(this).val(localStorage.screenshotTime)
    return false

  } else {

    localStorage.screenshotTime = ssTime

  }

})

// Reset options to default
$(document).on("click", "#defaultOptions", function(e) {

  // Don't reset words at the moment since they're separate from options
  wordDefaults.set("all")

})

// Clear all localStorage data and reload the page
$(document).on("click", "#clearData", function(e) {

  var askFirst = confirm("Would you like to clear all data, including words?")

  if (askFirst == true) {

    localStorage.clear()
    window.location = window.location

  }

})


/* Screenshots */

$(document).on("click", "#ssClose", function(e) {

  $("#screenshots").fadeOut()

})

$(document).on("click", ".ssButton", function(e) {

  // Screenshots work differently for mobile and desktop.
  // Desktop users will create a screenshot of the page using html2canvas and have a screenshots panel showing all their screenshots.
  // For Mobile users the icons and buttons on the screen will disappear for a period of time, giving the user time to take a screenshot with their phone.

  // Check if user is on Desktop or Mobile
  if (getWidth() < 1024) { // If Mobile

    // Hide everything on the screen for a bit

  }

  // Check if Options box is already open
  if ( $("#screenshots").is(":visible") ) {

    // Disable any events from when it was turned on
    //$(document).off("click", "#center")

    $("#screenshots").fadeOut()

  } else {

    // Create an event that closes the Screenshots box when you click out of it
    /*
    $(document).on('click', '#center',  function(){
      if ($(this).attr("id") != "screenshots") {
        $("#screenshotsButton").trigger("click")
      }
    })*/

    $("#screenshots").fadeIn()

  }


})


function endHighlight() {
  $("#screenshotsButton").removeClass("ssButtonNew")
}

// Show elements that were hidden for screenshots
function showElements() {

  var showThese = $("#mainButtons, #footer, #editFooter, #ssInfo")

  if (getWidth() < 1024) {
    $(showThese).fadeIn()
  } else {
    $(showThese).show()
  }

}

$(document).on("click", ".takeScreenshot", function(e) {

  // Was the Screenshots panel already open?
  var isOpen = $("#screenshots").is(":visible")

  // Screenshots work differently for mobile and desktop.
  // Desktop users will create a screenshot of the page using html2canvas and have a screenshots panel showing all their screenshots.
  // For Mobile users the icons and buttons on the screen will disappear for a period of time, giving the user time to take a screenshot with their phone.

  // These are the elements to hide for all users
  var hideThese = $("#mainButtons,#footer, #screenshots, #options, #ssNone, #editFooter")

  // Check if user is on Desktop or Mobile
  if (getWidth() < 1024) { // If Mobile

    $(hideThese).fadeOut() // fade out to hint that it will fade back in? idk.

    // Show everything again (based on ScreenshotTime setting)
    setTimeout("showElements()", (localStorage.screenshotTime * 1000))

  } else {

    $(hideThese).hide() // hide immediately

    // Take screenshot and place it in the Screenshots panel
    html2canvas(document.querySelector("html"), { allowTaint: true ,scrollX: 0,scrollY: 0 }).then(canvas => {
        $("#placeScreenshots").append(canvas)
    });


    // Open the Screenshots panel again if it was already open
    if (isOpen == true) {
      $("#screenshots").fadeIn()
    } else {
      // Highlight the "Screenshots" button. Remove highlight in 3 seconds
      $("#screenshotsButton").addClass("ssButtonNew")
      setTimeout("endHighlight()", 3000)
    }

    // Show the elements again right away
    showElements()

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

// ESC closes Screenshots panel and Options box
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 27) {
    if ($("#options").is(":visible")) {
      $("#optionsButton").trigger("click")
    }
    if ($("#screenshots").is(":visible")) {
      $("#screenshotsButton").trigger("click")
    }
    e.preventDefault();
  }
});

// Misc functions

// Get screen width
// From: https://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code
function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

// Check if string is a number
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
