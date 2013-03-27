$(document).ready(function () {

  //Onload do ASAP 
  ////////////////

  getAllFieldNotes();
  initPopovers();

  // Weather saving, setting and loading
  var currentWeatherCondtions = "Another Beautiful Day";
  // //Load weather from API
  // getWeather();
  // function getWeather() {
  //   $.ajax({
  //     url: "https://api.wunderground.com/api/75bb4d672596d1a6/conditions/q/TN/Nashville.json",
  //     type: "GET",
  //     dataType: "JSONP",
  //     async: false,
  //     success: function (data) {
  //       currentWeatherCondtions = data.current_observation.weather + ', ' + 
  //         data.current_observation.temperature_string +
  //         ' Precip Today: ' + data.current_observation.precip_today_string; 
  //     }  // end sucess
  //   }); // end ajax
  // } // end getWeather

  //Listeners
  ///////////

  $("#hideShow_Show").click(function() {
    $(".hideShow").css("display", "inline");
  });

  $("#hideShow_Hide").click(function() {
    $(".hideShow").css("display", "none");
  });

  // FORM TRIGGERS NAV UNDER PAGE TITLE

  $(".cropLogTrigger").click(function () {
    clearAllInputs();
    toggleCropForm();
  });

  $(".actionLogTrigger").click(function () {
    clearAllInputs();
    // set parent to default also toggles view
    setActionLogParent("gardenLog", "Garden Log"); 
 });

  $(".quickNoteTrigger").click(function () {
    clearAllInputs();
    toggleQuickNoteForm();
    setQuickNoteParentNull();
  }); 

  // FORM CLEAR AND CANCEL

  $(".cancelForm").click(function() {
    clearAllInputs();
    hideAllFormsSlow();
  });

  $(".clearForm").click(function () {
    clearAllInputs();
  });

  // CROP LOG SUBMIT ACTION
  $("#submitCropLog").click(function () {
    // Check for imput in required fields
    if( $.trim($('#imputLogTitle').val()).length    === 0 ||
        $.trim($('#imputLogStrain').val()).length   === 0 ||
        $.trim($('#imputLogLongText').val()).length === 0 ){
      alert("Required fields cannot be empty");
    } else {
      //set data
      var imputData = {
        kind: "Crop",
        parentId:     "gardenLog",
        parentTitle:  "Garden Log",
        date:         new Date().toString('MMM d, yyyy'),
        time:          new Date().toString('h:mm tt'),
        title:        $("#imputLogTitle").val(), // common Name
        strain:       $("#imputLogStrain").val(), 
        harvestNotes: $("#imputLogHarvestNotes").val(),
        flags:        $("#imputLogFlags").val(),
        longText:     $("#imputLogLongText").val()}
      //post data
      postNewFieldNote(imputData);
    } // end else
  }); 

  // ACTION LOG FORM FUNCTIONS
  $("#checkActionWeather").change(function () {
    if ($("#checkActionWeather").is(":checked")) {
      $("#imputActionWeather").val(currentWeatherCondtions);
    } else {
      $("#imputActionWeather").val("");
    } // end if else
  }); // end change

  $("#submitActionLog").click(function () {
    // Check for imput in required fields
    if( $.trim($('#imputActionTitle').val()).length    === 0 ||
        $.trim($('#imputActionLongText').val()).length === 0 ){
      alert("Required fields cannot be empty");
    } else {
      //set data
      var imputData = {
        kind:        "Action",
        parentId:    $("#imputActionParentId").val(),
        parentTitle: $("#imputActionParentTitle").val(),
        date:        new Date().toString('MMM d, yyyy'),
        time:        new Date().toString('h:mm tt'),
        title:       $("#imputActionTitle").val(),
        workers:     $("#imputActionWorkers").val(),
        items:       $("#imputActionItems").val(),
        weather:     $("#imputActionWeather").val(),
        longText:    $("#imputActionLongText").val()}
      //post data
      postNewFieldNote(imputData);
    } // end else
  });

  // QUICKNOTE FORM FUNCTIONS
  $("#imputQuickDropdown").change(function () {
    $("#imputQuickParentId").val( $("#imputQuickDropdown").val() );
    $("#quickNoteParent").html("Posting To:");
  });

  $("#submitQuickNote").click(function () {
    // Check for imput in required fields
    if( $.trim($('#imputQuickParentId').val()).length === 0 ||
        $.trim($('#imputQuickLongText').val()).length === 0 ){
      alert("Required fields cannot be empty");
    } else {
      // include weather if requested
      if ($("#checkQuickWeather").is(':checked')) {
        var weatherOrNoWeather = currentWeatherCondtions; }
      //set data
      var imputData = {
        kind: "Quick",
        parentId:    $("#imputQuickParentId").val(),
        parentTitle: $("#imputQuickParentTitle").val(),
        date:        new Date().toString('MMM d, yyyy'),
        time:        new Date().toString('h:mm tt'),
        weather:     weatherOrNoWeather,
        title:       "A note",
        longText:    $("#imputQuickLongText").val()}
      //post data
      postNewFieldNote(imputData);
     } // end else
  }); 

  //PAGE VIEWS

  $("#cropView").click(function () {
    toggleCropView();
  });

  $("#cronOldestView").click(function () {
    toggleChronOldestView();
  });

  $("#cronNewestView").click(function () {
    toggleChronNewestView();
  });

}); // end document.ready

//AJAX GET POST DELETE
//////////////////////

function getAllFieldNotes() {
  $.ajax({
    url: "backliftapp/fieldNotesData",
    type: "GET",
    success: function (data) {
      if (data.length === 0) {
        printEmptyMessage();
      } else {
        for (var i = 0; i < data.length; i++) {
          printFieldNotesToScreen(data[i]);
          populateQuickDropdown(data[i]);
          populateCropLinks(data[i]);
        } // end loop
      }  // end else
      initPopovers();
    }   // end sucess
  });  // end ajax get call
}

function postNewFieldNote(imputData) {
  $.ajax({
    url: "backliftapp/fieldNotesData",
    type: "POST",
    dataType: "json",
    data: imputData,
    success: function (data) {
      // Print log on screen
        printFieldNotesToScreen(data);
        populateQuickDropdown(data);
        populateCropLinks(data);
      // clear forms
        clearAllInputs();
        hideAllFormsSlow();
      //change view and go to new post
        toggleCropView();
        window.location.assign("#" + data.id);
    } // end sucess
  }); // end ajax post call
}

function deleteRecord(id) {
  $.ajax({
    url: "backliftapp/fieldNotesData/" + id,
    type: "DELETE",
    success: function (data) {
      $('#' + id).hide();
      $('.' + id).hide();
      console.log('deleted: ' + id);
    } // end sucess
  }); // end ajax
} // end function

// function purgeDatabase() {
//   var conf = confirm("Are you sure you want to clear all the garden data");
//   if (conf == true) {
//     $.ajax({
//       url: "backliftapp/fieldNotesData",
//       type: "GET",
//       success: function (data) {
//         // clear each one by one
//         for (i = 0; i < data.length; i++) {
//           deleteRecord(data[i].id);
//         } // end for
//       } // end sucess
//     }); // end ajax get call
//   } // end if 
// } // end ajax

//Display The data on site
//////////////////////////

function printEmptyMessage() {
  $("#gardenLog").append(
    '<h3>Welcome</h3> <p>If this is your first time here we reccommend taking a look at a <a href="#myModal" role="button" data-toggle="modal">A rundown of this app</a> Otherwise, have fun using this and be sure to send <a href="mailto:farfromguam@gmail.com?Subject=Feedback%20Ahoy!">Feedback</a></P>'); 
  $("#chronOldest").append("I have nothing to show you, Sorry."); 
  $("#chronNewest").append("I have nothing to show you, Sorry."); 
  $('<li>Your Future Crops</li>').appendTo('#ulCropLinks');
}

function printFieldNotesToScreen(data) {
  //Logic for displaying to Crop View
  if (data.kind === "Crop") {
    printCropToScreen(data);
  } else if (data.kind === "Action") {
    printActionToScreen(data);
  } else if (data.kind === "Quick") {
    printQuickToScreen(data);
  } 
  // Chron Views
  printChronOldest(data);
  printChronNewest(data);
} 

function printCropToScreen(data) {

  // Display Required Information
  $('<div class="cropContainer" id="' + data.id + '" class="' + data.id + '">' + 
    '<h2><em>' + data.kind + '</em> :: ' + data.title + '</h2>' + 

      '<ul id="UL_' + data.id + '">' +
        '<li>Plant Strain: ' + data.strain + '</li>' +
      '</ul>' +
      '<p>'+ data.longText + '</p>' +
    
    '<a href="#actionLogForm" onclick="setActionLogParent(\'' + 
      data.id + '\', \'' + data.title + '\' )">[Log Action]</a>' +
    '<a href="#quickNoteForm" onclick="setQuickNoteParent(\'' + 
      data.id + '\', \'' + data.title + '\' )">[Quick Note]</a>' +
    '<a class="red hideShow" onclick="deleteRecord(\'' + 
      data.id + '\')">[Delete]</a>' +

    '</div>').appendTo('#'+data.parentId);

  // Display Non-Required Information
  if (data.harvestNotes !== undefined) {
    $('#UL_' + data.id).append('<li>Harvest Notes: ' + data.harvestNotes + '</li>');
  }
  if (data.flags !== undefined) {
    $('#UL_' + data.id).append('<li>Remember!: ' + data.flags + '</li>');
  }
}

function printActionToScreen(data) {

  // Display Required Information
  $('<div class="actionContainer" id="' + data.id + '" class="' + data.id + '">' + 
    '<h4><em>' + data.kind + '</em> :: ' + data.title + '</h4>' + 

      '<span id="SP_' + data.id + '"></span>' +
      '<p>' + data.longText + '</p>' +

    '<a href="#actionLogForm" onclick="setActionLogParent(\'' + 
      data.id + '\', \'' + data.title + '\' )">[Log Action]</a>' +
    '<a href="#quickNoteForm" onclick="setQuickNoteParent(\'' + 
      data.id + '\', \'' + data.title + '\' )">[Quick Note]</a>' +
    '<a class="red hideShow" onclick="deleteRecord(\'' + 
      data.id + '\')">[Delete]</a>' +

    '</div>').appendTo('#'+data.parentId);

  // Display Non-Required Information
  if (data.items !== undefined) {
    $('#SP_' + data.id).append('<p>Items: ' + data.items + '</p>');
  }
  if (data.workers !== undefined) {
    $('#SP_' + data.id).append('<p>Workers: ' + data.workers + '</p>');
  }
  if (data.weather !== undefined) {
    $('#SP_' + data.id).append('<p><i class="icon-asterisk"></i> ' + data.weather + '</p>');
  }
}

function printQuickToScreen(data) {

  // Display Required Information
  $('<div class="quickContainer" id="' + data.id + '" class="' + data.id + '">' + 

      '<span id="SP_' + data.id + '"></span>' +
      '<p>' + data.longText + '</p>' +
    
    '<a class="red hideShow" onclick="deleteRecord(\'' + 
      data.id + '\')">[Delete]</a>' +
    
    '</div>').appendTo('#'+data.parentId);

  // Display Non-Required Information
  if (data.weather !== undefined) {
    $('#SP_' + data.id).append('<p><i class="icon-asterisk"></i> ' + data.weather + '</p>');
  }
}

function printChronOldest(data) {
  $(
    '<div class="logByDate ' + data.id + '">' +
      '<h5><a href="#' + data.id + '" onclick="toggleCropView()">' +
        '<em>' + data.date + '</em> :: ' + data.kind + ' post :: <em>' + data.parentTitle + '</em> :: ' + data.title + ' ::' +
      '</a></h5>' +
      '<p>' + data.longText + '</p>' + 
      '<a class="red hideShow" onclick="deleteRecord(\'' + data.id + '\')">[Delete]</a>' +
    '</div>'
  ).appendTo('#chronOldest');
}

function printChronNewest(data) {
  $(
    '<div class="logByDate ' + data.id + '">' +
      '<h5><a href="#' + data.id + '" onclick="toggleCropView()">' +
        '<em>' + data.date + '</em> :: ' + data.kind + ' post :: <em>' + data.parentTitle + '</em> :: ' + data.title + ' ::' +
      '</a></h5>' +
      '<p>' + data.longText + '</p>' +
      '<a class="red hideShow" onclick="deleteRecord(\'' + data.id + '\')">[Delete]</a>' + 
    '</div>'
  ).prependTo('#chronNewest');
}

// Populate crop info - navagation and selection
////////////////////////////////////////////////

function populateQuickDropdown(data) {
  if (data.kind === "Crop") {
    // open and close an option with the value of ID and html title of title
    $('<option/>').val(data.id).html(data.title).appendTo('#imputQuickDropdown');
  }
}

function populateCropLinks(data) {
  if (data.kind === "Crop") {
    $('<li><a href="#' + data.id + '" onclick="toggleCropView()">'+ data.title +'</li>').appendTo('#ulCropLinks');
  }
}

// View Switching
/////////////////

function toggleCropView() {
  $("#gardenLog").show();
  $("#chronOldest").hide();
  $("#chronNewest").hide();
}

function toggleChronOldestView() {
  $("#gardenLog").hide();
  $("#chronOldest").show();
  $("#chronNewest").hide();
}

function toggleChronNewestView() {
  $("#gardenLog").hide();
  $("#chronOldest").hide();
  $("#chronNewest").show();
}

//Form Functions
////////////////

function toggleCropForm() {
  $("#cropLogForm").show(500);
  $("#actionLogForm").hide();
  $("#quickNoteForm").hide();
}

function toggleActionForm() {
  $("#cropLogForm").hide();
  $("#actionLogForm").show(500);
  $("#quickNoteForm").hide();
}

function toggleQuickNoteForm() {
  $("#cropLogForm").hide();
  $("#actionLogForm").hide();
  $("#quickNoteForm").show(500);
}

function hideAllFormsSlow() {
    $("#cropLogForm").hide(500);
    $("#actionLogForm").hide(500);
    $("#quickNoteForm").hide(500);
}

function clearAllInputs() {
  // clear Imputs
  $(':input')
    .not(':button, :submit, :reset, :hidden')
    .val('')
    .removeAttr('checked')
    .removeAttr('selected');
}

// Parent set and reset functions
/////////////////////////////////

function setActionLogParent(parentId, parentTitle) {
  // set parent id
  $("#imputActionParentId").val(parentId);
  // set parent Title 
  $("#imputActionParentTitle").val(parentTitle);
  // tell user what the target is
  $("#actionLogParent").html("Posting To: " + parentTitle)
  //Show Form
  toggleActionForm();
}

function setQuickNoteParent(parentId, parentTitle) {
  // hide default dropdown
  $("#imputQuickDropdown").hide();
  // set parent id
  $("#imputQuickParentId").val(parentId);
  // set parent title
  $("#imputQuickParentTitle").val(parentTitle);
  // tell user what the target is
  $("#quickNoteParent").html("Posting To: " + parentTitle);
  //Show Form
  toggleQuickNoteForm();
}

function setQuickNoteParentNull() {
  //set all to Null
  $("#imputQuickDropdown").show();
  $("#imputQuickParentId").val("");
  $("#quickNoteParent").html("No location targeted")
}

//MISC...
/////////

function initPopovers() {
  $(".Q").popover();
}