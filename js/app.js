$(document).ready(function () {

  //Onload do ASAP 
  //==============

  getAllFieldNotes();

  initPopovers();

  //Listeners
  //=========

  $("#manage").click(function() {
    $(".manage").css("display", "inline");
  });

  // FORM TRIGGERS NAV UNDER PAGE TITLE

  $("#cropLogTrigger").click(function () {
    //clear first then show
    resetAllForms();
    toggleCropForm();
  });

  $("#actionLogTrigger").click(function () {
    //clear first then show
    resetAllForms();
    toggleActionForm();
  });

  $("#quickNoteTrigger").click(function () {
    //clear first then show
    resetAllForms();
    toggleQuickNoteForm();
  }); 

  // FORM CLEAR AND CANCEL

  $(".cancelForm").click(function() {
    hideAllFormsSlow();
    resetAllForms();
  });

  $(".clearForm").click(function () {
    resetAllForms();
  });

  // FORM SUBMIT ACTIONS

  $("#submitCropLog").click(function () {
    //set data
    var imputData = {
      
      kind: "Crop",
      
      parentId: "gardenLog",
      parentTitle: "Garden Log",
      
      date: new Date().toString('MMM d, yyyy'),
      time: new Date().toString('h:mm tt'),

      title:        $("#imputLogTitle").val(), // common Name
      strain:       $("#imputLogStrain").val(), 
      harvestNotes: $("#imputLogHarvestNotes").val(),
      flags:        $("#imputLogFlags").val(),
      longText:     $("#imputLogLongText").val()
    
    }
    //post data
    postNewFieldNote(imputData);
  }); 

  $("#submitActionLog").click(function () {
    //set data
    var imputData = {
      
      kind: "Action",

      parentId:    $("#imputActionParentId").val(),
      parentTitle: $("#imputActionParentTitle").val(),
      
      date: new Date().toString('MMM d, yyyy'),
      time: new Date().toString('h:mm tt'),

      title:    $("#imputActionTitle").val(),
      workers:  $("#imputActionWorkers").val(),
      items:    $("#imputActionItems").val(),
      weather:  $("#imputActionWeather").val(),
      longText: $("#imputActionLongText").val()
    
    }
    //post data
    postNewFieldNote(imputData);
  });

  $("#submitQuickNote").click(function () {
    //set data
    var imputData = {
     
      kind: "Quick",
     
      parentId:    $("#imputQuickParentId").val(),
      parentTitle: $("#imputQuickParentTitle").val(),
     
      date: new Date().toString('MMM d, yyyy'),
      time: new Date().toString('h:mm tt'),

      title: "A note",
      longText: $("#imputQuickLongText").val()
    
    }
    //post data
    postNewFieldNote(imputData);
  }); 

  // CHANGE PARENT ON DROPDOWN CHANGE

  $("#imputQuickDropdown").change(function () {
    //set parent to value of dropdown
    $("#imputQuickParentId").val( $("#imputQuickDropdown").val() );
    // alert that parent is changed
    $("#quickNoteParent").html("Posting To:");
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

//AJAX GET POST DELETE UPDATE
//===========================

function getAllFieldNotes() {
  $.ajax({
    url: "backliftapp/fieldNotesData",
    type: "GET",
    success: function (data) {
      if (data.length === 0) {
        $("#gardenLog").append("Log a crop or a Action to see some data!")
      } else {
        for (var i = 0; i < data.length; i++) {
          printFieldNotesToScreen(data[i]);
          populateQuickDropdown(data[i]);
          populateCropLinks(data[i]);
        } // end loop
      }  // end else
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
      printFieldNotesToScreen(data);
      populateQuickDropdown(data);
      populateCropLinks(data);
      resetAllForms();
      hideAllFormsSlow();

    } // end sucess
  }); // end ajax post call
}

function deleteRecord(id) {
  $.ajax({
    url: "backliftapp/fieldNotesData/" + id,
    type: "DELETE",
    success: function (data) {
      console.log('deleted: ' + id);
      $('#' + id).hide();
    } // end sucess
  }); // end ajax delete call
}

function purgeDatabase() {
  var conf = confirm("Are you sure you want to clear all the garden data");
  if (conf == true) {
    $.ajax({
      url: "backliftapp/fieldNotesData",
      type: "GET",
      success: function (data) {
        for (i = 0; i < data.length; i++) { // clear each score record by record id
          deleteRecord(data[i].id);
        } // end for loop
        location.reload;
      } // end sucess
    }); // end ajax get call
  } // end if 
}

//Display The data on site
//========================

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
  $('<div class="cropContainer" id="' + data.id + '">' + 
    '<h2><em>' + data.kind + '</em> :: ' + data.title + '</h2>' + 

      '<ul id="UL_' + data.id + '">' +
        '<li>Plant Strain: ' + data.strain + '</li>' +
      '</ul>' +
      '<p>'+ data.longText + '</p>' +
    
    '<a href="#actionLogForm" onclick="setActionLogParent(\'' + 
      data.id + '\', \'' + data.title + '\' )">[Log Action]</a>' +
    '<a href="#quickNoteForm" onclick="setQuickNoteParent(\'' + 
      data.id + '\', \'' + data.title + '\' )">[Quick Note]</a>' +
    '<a class="red manage" onclick="deleteRecord(\'' + 
      data.id + '\')">[Remove]</a>' +

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
  $('<div class="actionContainer" id="' + data.id + '">' + 
    '<h4><em>' + data.kind + '</em> :: ' + data.title + '</h4>' + 

      '<span id="SP_' + data.id + '"></span>' +
      '<p>' + data.longText + '</p>' +

    '<a href="#actionLogForm" onclick="setActionLogParent(\'' + 
      data.id + '\', \'' + data.title + '\' )">[Log Action]</a>' +
    '<a href="#quickNoteForm" onclick="setQuickNoteParent(\'' + 
      data.id + '\', \'' + data.title + '\' )">[Quick Note]</a>' +
    '<a class="red manage" onclick="deleteRecord(\'' + 
      data.id + '\')">[Remove]</a>' +

    '</div>').appendTo('#'+data.parentId);

  // Display Non-Required Information
  if (data.items !== undefined) {
    $('#SP_' + data.id).append('<p>Items: ' + data.items + '</p>');
  }

  if (data.workers !== undefined) {
    $('#SP_' + data.id).append('<p>Workers: ' + data.workers + '</p>');
  }

  if (data.weather !== undefined) {
    $('#SP_' + data.id).append('<p>Weather: ' + data.weather + '</p>');
  }

}

function printQuickToScreen(data) {

  // Display Required Information
  $('<div class="quickContainer" id="' + data.id + '">' + 

      '<span id="SP_' + data.id + '"></span>' +
      '<p>' + data.longText + '</p>' +
    
    '<a class="red manage" onclick="deleteRecord(\'' + 
      data.id + '\')">[Remove]</a>' +
    
    '</div>').appendTo('#'+data.parentId);

  // Display Non-Required Information
  if (data.weather !== undefined) {
    $('#SP_' + data.id).append('<p>Weather: ' + data.weather + '</p>');
  }

}

function printChronOldest(data) {
  $(
    '<div class="logByDate">' +
      '<h5><a href="#' + data.id + '" onclick="toggleCropView()">' +
        '<em>' + data.date + '</em> :: ' + data.kind + ' post :: <em>' + data.parentTitle + '</em> :: ' + data.title + ' ::' +
      '</a></h5>' +
      '<p>' + data.longText + '</p>' + 
    '</div>'
  ).appendTo('#chronOldest');
}

function printChronNewest(data) {
  $(
    '<div class="logByDate">' +
      '<h5><a href="#' + data.id + '" onclick="toggleCropView()">' +
        '<em>' + data.date + '</em> :: ' + data.kind + ' post :: <em>' + data.parentTitle + '</em> :: ' + data.title + ' ::' +
      '</a></h5>' +
      '<p>' + data.longText + '</p>' + 
    '</div>'
  ).prependTo('#chronNewest');
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

// Populate crop into navagation and selection
//////////////////////////////////////////////

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

// Parent set and reset functions
/////////////////////////////////

function setActionLogParent(parentId, parentTitle) {
  // set parent id
  $("#imputActionParentId").val(parentId);
  // set parent Title 
  $("#imputActionParentTitle").val(parentTitle);
  // tell user what the target is
  $("#actionLogParent").html("Posting To: " + parentTitle)
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
  toggleQuickNoteForm();
}

function resetActionLogParent() {
  $("#imputActionParent").val("gardenLog");
  $("#actionLogParent").html("Posting To: gardenLog")
}

function resetQuickNoteParent() {
  //set all to default
  $("#imputQuickDropdown").show();
  $("#imputQuickParentId").val("");
  $("#quickNoteParent").html("No location targeted")
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

function resetAllForms() {
  // clear Imputs
  $(':input')
    .not(':button, :submit, :reset, :hidden')
    .val('')
    .removeAttr('checked')
    .removeAttr('selected');

  resetQuickNoteParent();
  resetActionLogParent();
}

//MISC...
/////////

function initPopovers() {
  $(".formQ").popover();
}

//Get current weather
/////////////////////

function getWeather() {

  // http://api.openweathermap.org
  var baseUrl   = "http://api.openweathermap.org/data/2.1";
  var station   = "/weather/city/4644585";
  var units     = "?units=imperial"; //imperial or metric
  var mode      = "&mode=daily_compact"; // snapshot not forecast 
  var type      = "&type=json"; // json or html
  var url       = baseUrl + station + units + mode + type;

  //http://api.openweathermap.org/data/2.1/weather/city/4644585?units=imperial&mode=daily_compact&type=json
 
}



