version = "1.5" // The Words Update

// Defaults class
wordDefaults = {

  // Default words are currently based on previous Ubuntu version names. Note: I'm not affiliated with them at all.
  words: [ "Breezy\nDapper\nEdgy\nGutsy\nLucid\nPrecise\nTrusty\nCosmic", "Hedgehog\nFawn\nKoala\nLynx\nOcelot\nSalamander\nGorilla\nHippo" ],
  font: "Arial, Helvetica, Sans-Serif", // default font
  fontColor: "#000000",
  fontSize: "68", /* currently in 'px' units */
  shadowH: "3",
  shadowV: "3",
  shadowBlur: "5",
  shadowColor: "#4d4d4d",
  shadowEnabled: "1",

  backgroundURL: "app/img/background.jpg", // Can be external URL
  backgroundIsURL: 1, // 1 if background is a URL. 0 if it becomes a Hash (on file upload)
  buttonTheme: "Dark", // Dark or Light
  buttonSmall: 0, // 1 = Small buttons, 0 = Normal buttons
  screenshotTime: 5, // 5 seconds
  rotation: 0, // 0 degrees. Same for everything below
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
      localStorage.words = JSON.stringify(this.words)
    }

    // Reset colors
    if (choice == "colors" || choice == "all") {
      localStorage.font = this.font
      localStorage.bold = this.bold
      localStorage.italic = this.italic
      localStorage.underline = this.underline
      localStorage.fontColor = this.fontColor
      localStorage.fontSize = this.fontSize
      localStorage.shadowH = this.shadowH
      localStorage.shadowV = this.shadowV
      localStorage.shadowBlur = this.shadowBlur
      localStorage.shadowColor = this.shadowColor
      localStorage.shadowEnabled = this.shadowEnabled

      $("#generatedName").css({"font-family":this.font, "color" : this.fontColor})
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
      $("#opFont").val(this.font)
      $("#opFontColor").spectrum({color: this.fontColor})
      $("#opFontSize").val(this.fontSize)
      $("#opShadowColor").spectrum({color: this.shadowColor})
      textDecoration(this.bold, this.italic, this.underline)
    }

    if (choice == "bg" || choice == "all") {

      localStorage.backgroundURL = this.backgroundURL
      localStorage.backgroundIsURL = this.backgroundIsURL
      $("html").css({"background-image": "url("+this.backgroundURL+")"})
      $("#opBackgroundURL").val(this.backgroundURL)

    }

    if (choice == "all") {
      localStorage.screenshotTime = this.screenshotTime
      $("#opScreenshotTime").val(this.screenshotTime)
      localStorage.buttonTheme = this.buttonTheme
      $("input[value='"+this.buttonTheme+"']").prop({checked: true})
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


  // Load the defaults into the edit boxes.
  if (!localStorage.words) {
    wordDefaults.set("all")
    localStorage.words = JSON.stringify(wordDefaults.words)
  }
  var words = JSON.parse(localStorage.words)
  //
  // Loop through each set of words. Create a textarea for each one
  $.each( words, function( key, value ) {

    if (value != "") {
      $("#editWordsBoxes").append('<textarea id="" rows="6" cols="30" class="editTextarea">'+value+'</textarea>')
    }

  })


  // Fill out the Options page based on the user's settings

  // Button Theme options
  $("input[value='"+localStorage.buttonTheme+"']").prop({checked: true})
  if (localStorage.buttonTheme == "Light") {
    $("#opLight").trigger("click")
  }

  // SmalL Buttons options
  if (localStorage.buttonSmall == "1") {
      $("#opButtonSmall").prop({checked:true})
      smallButtons(1)
  }

  // Text Rotate/Skew/Position
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
  $("#opFont").val(localStorage.font)
  $("#opFontColor").attr({"value": localStorage.fontColor})
  $("#opShadowColor").attr({"value": localStorage.shadowColor})
  $("#opFontSize").val(localStorage.fontSize)
  $("html").css({"background-image" : "url("+localStorage.backgroundURL+")"})
  if (localStorage.backgroundIsURL == 1) {
    $("#opBackgroundURL").val(localStorage.backgroundURL)
  }
  $("#opScreenshotTime").val(localStorage.screenshotTime)
  $("#generatedName").css({"font-family":localStorage.font, "transform": "rotate("+localStorage.rotation+"deg)"})
  textDecoration(localStorage.bold, localStorage.italic, localStorage.underline) // Decorate generated name


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

  // Grab the list of words
  var words = JSON.parse(localStorage.words)
  var finalWord = "" // combined word

  // Loop through each set of words. Choose one from each.
  $.each( words, function( key, value ) {
    var thisWord = randWord(value).split("\n")
    if (thisWord != "") {
      finalWord += randWord(value.split("\n"))+" "
    }

  })

  // Output the final words.
  $("#generatedName").text(finalWord)

}

// Generate button
$(document).on("click", ".generate", function(e) {
  generate()
})

// Edit button
$(document).on("click", "#edit", function(e) {

    // Enable edit section
    $("#generatedName,#footer").slideUp() // Also hide the footer because it gets in the way when mobile keyboard is in use
    $("#editSection").slideDown()
    $("input.editButtons").show()
    $("#generateMain, #edit, #takeScreenshotMain").hide()

})

// Save button
$(document).on("click", "#save", function(e) {

  // This is a quick app so it won't do much checking to see if the textarea boxes are valid. It's just going to save the whole value directly to the localStorage
  var words = []
  var num = 0 // Only count up if data (textarea box) wasn't blank

  $("textarea.editTextarea").each(function(index) {

    var data = $(this).val()

    if (data != "" && data != undefined) {

      words[num] = data
      num++ // Move num up because this was successful

    } else {

      $(this).remove()

    }

  })

  // If all the boxes were empty, click "Cancel" instead.
  if (!words[0]) {
    $("#cancel").trigger("click")
    return false
  }

  // Save words
  localStorage.words = JSON.stringify(words)

  // Hide the edit area and bring back the home screen
  $("#editSection").slideUp()
  $("#generatedName,#footer").slideDown()
  $("input.editButtons").hide()
  $("#generateMain, #edit, #optionsButton, #takeScreenshotMain, #screenshotsButton").show()

  // Generate a new word using the new lists
  generate()

})

// Cancel button
$(document).on("click", "#cancel", function(e) {

  // Load the last set words into the edit boxes
  var words = JSON.parse(localStorage.words)
  $("#editWordsBoxes").html("")

  // Loop through each set of words. Create a textarea for each one
  $.each( words, function( key, value ) {

    if (value != "") {
      $("#editWordsBoxes").append('<textarea id="" rows="6" cols="30" class="editTextarea">'+value+'</textarea>')
    }

  })

  // Hide the edit area and bring back the home screen
  $("#editSection").slideUp()
  $("#generatedName,#footer").slideDown()
  $("input.editButtons").hide()
  $("#generateMain, #edit, #optionsButton, #takeScreenshotMain, #screenshotsButton").show()

})

// Clear button
$(document).on("mouseup", "#clear", function(e) {

    // Put the default content into the word boxes. If the user cancels after resetting, it will go back to what they had before editing
    $("textarea.editTextarea").val("")

})

// Reset button
$(document).on("click", "#reset", function(e) {

  // Put the default content into the word boxes. If the user cancels after resetting, it will go back to what they had before editing
  var words = wordDefaults.words
  $("#editWordsBoxes").html("")

  // Loop through each set of words. Create a textarea for each one
  $.each( words, function( key, value ) {

    if (value != "") {
      $("#editWordsBoxes").append('<textarea id="" rows="6" cols="30" class="editTextarea">'+value+'</textarea>')
    }

  })

})

$(document).on("click", ".addRemove", function(e) {

  var choice = $(this).val()


  if (choice == "+") {

    $("#editWordsBoxes").append('<textarea id="" rows="6" cols="30" class="editTextarea"></textarea>')

  } else if (choice == "-") {

    // Remove last textarea if there is more than one
    if ( $("textarea.editTextarea").length > 1) {
      $("textarea.editTextarea:last").remove()
    }

  }

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

// Change font
$(document).on("change", "#opFont", function(e) {

  var font = $(this).val()

  $("#generatedName").css({"font-family": font})

  localStorage.font = font

})

// Add bold, italic, or underline to generated name
function textDecoration(bold, italic, underline) {

  if (bold == 1) {
    $("#generatedName").css({"font-weight": "bold"})
    $("#opBold").prop({"checked":true})
  } else {
    $("#generatedName").css({"font-weight": "normal"})
    $("#opBold").prop({"checked":false})
  }

  if (italic == 1) {
    $("#generatedName").css({"font-style": "italic"})
    $("#opItalic").prop({"checked":true})
  } else {
    $("#generatedName").css({"font-style": "normal"})
    $("#opItalic").prop({"checked":false})
  }

  if (underline == 1) {
    $("#generatedName").css({"text-decoration": "underline"})
    $("#opUnderline").prop({"checked":true})
  } else {
    $("#generatedName").css({"text-decoration": "none"})
    $("#opUnderline").prop({"checked":false})
  }

}

// Change font decoration (bold, italic, underline)
$(document).on("click", "input.fontDecoration", function(e) {

  var bold = ($("#opBold").is(":checked")) ? 1 : 0
  var italic = ($("#opItalic").is(":checked")) ? 1 : 0
  var underline = ($("#opUnderline").is(":checked")) ? 1 : 0

  textDecoration(bold, italic, underline)

  localStorage.bold = bold
  localStorage.italic = italic
  localStorage.underline = underline

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
  if (!isNumber(fontSize) || fontSize < 1) {
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

  if (!isNumber(blur) || blur < 0) {
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

// Change button theme
$(document).on("click", ".buttonTheme", function(e) {

  var theme = $("input[name='opButtonTheme']:checked").val()

  localStorage.buttonTheme = theme

  // This is everything that should be themed
  var themeThese = $(".generate, input.editButtons, #defaultOptions, #clearData, #takeScreenshotMain, #takeScreenshotFooter, #helpScreenshotOK, #footer, #screenshots, #editInfo")

  if (theme == "Dark") {

    $("img.phoneIcon").attr({src: "app/img/phone.png"})
    $(".cameraIcon").attr({src: "app/img/cameraw.png"})
    $("#cameraIconMobile").attr({src: "app/img/camera.png"})
    $(themeThese).removeClass("lightTheme")

  } else {

    $("img.phoneIcon").attr({src: "app/img/phone.png"})
    $(".cameraIcon").attr({src: "app/img/camera.png"})
    $("#cameraIconMobile").attr({src: "app/img/cameraw.png"})
    $(themeThese).addClass("lightTheme")

  }

})

// Switch between Small and Large buttons
function smallButtons(isSmall) {

  if (isSmall == "1") {

    $("#generateMain, #takeScreenshotMain").fadeOut()
    $("#generateFooter, #takeScreenshotFooter").fadeIn()

  } else {

    $("#generateFooter, #takeScreenshotFooter").fadeOut()
    $("#generateMain, #takeScreenshotMain").fadeIn()


  }

}

// Toggle Small buttons
$(document).on("change", "#opButtonSmall", function(e) {

  var isSmall = ($(this).is(":checked")) ? "1" : "0"

  smallButtons(isSmall)

  localStorage.buttonSmall = isSmall

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

// Upload button that leads to file upload for background change
$(document).on("click", "#opBgUpload", function(e) {
  $("#opBgUploadForm").trigger("click")
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

    // Make sure user has acknowledged how mobile screenshots work
    if (localStorage.helpMobileScreenshot != "1") {

      $("#notification").html("<div id='helpScreenshotNotif'><h1>Mobile Screenshots</h1><p>All buttons are going disappear for "+localStorage.screenshotTime+" seconds. This gives you time to use the screenshot feature on your phone (usually hold Home and Volume + VOL Down) to capture just the generated text.</p><p>You can change how long buttons dissapear in the Options.<br /><input id='helpScreenshotOK' type='button' value='Okay' /></p></div>").slideDown()

    } else {

      $(hideThese).fadeOut() // fade out to hint that it will fade back in? idk.

      // Show everything again (based on ScreenshotTime setting)
      setTimeout("showElements()", (localStorage.screenshotTime * 1000))

    }



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

// Mobile user has read how screenshots work.
$(document).on("click", "#helpScreenshotOK", function(e) {

  localStorage.helpMobileScreenshot = "1"
  $("#notification").slideUp()
  $("#takeScreenshotMobile").trigger("click") // take a screenshot now

})

// Generate new word on spacebar click
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body && $("#generatedName").is(":visible")) {
    $("#generateMain").trigger("click")
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

// Load image from file upload (having xss issues. may have to make a hidden image from url and then canvas copy it) and make a base64 hash of it. This will allow background to be loaded offline.
// Thanks to https://stackoverflow.com/a/20285053
// File size validation thanks to https://stackoverflow.com/a/3717847
function encodeImageFileAsURL(element) {
  var file = element.files[0];

  var filesize = element.files[0].size/1024/1024

  // File cannot be larger than 4 MB (localStorage limits)
  if (filesize > 4) {
    alert('Max file size is 4 MB. This file size is: ' + filesize.toFixed(2) + 'MB');
    return false
  }

  var reader = new FileReader();
  reader.onloadend = function() {
    //console.log('RESULT', reader.result)
    localStorage.backgroundURL = reader.result // store hash as the background user wants to load
    $("html").css({"background-image": "url("+localStorage.backgroundURL+")"})
    //$("#opBackgroundURL").val(localStorage.backgroundURL)
    localStorage.backgroundIsURL = 0 // Background is a Hash now, not a URL
  }

  reader.readAsDataURL(file);
}
