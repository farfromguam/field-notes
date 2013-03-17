$(document).ready(function () {

  //Onload do ASAP 
  //==============

  getAllFieldNotes();

  initPopovers();

  //Listeners
  //=========


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


  $("#submitCropLog").click(function () {
    //set data
    var imputData = {
      
      kind: "Crop",
      
      parentId: "gardenLog",
      parentTitle: "Garden Log",
      
      title: $("#imputLogTitle").val(),
      longText: $("#imputLogBox").val()
    
    }
    //post data
    postNewFieldNote(imputData);
  }); 

  $("#submitActionLog").click(function () {
    //set data
    var imputData = {
      
      kind: "Action",

      parentId: $("#imputActionParentId").val(),
      parentTitle: $("#imputActionParentTitle").val(),
      
      title: $("#imputActionTitle").val(),
      longText: $("#imputActionBox").val()
    
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
     
      title: "A note",
      longText:    $("#imputQuickNoteBox").val()
    
    }
    //post data
    postNewFieldNote(imputData);
  }); 


  $("#imputQuickDropdown").change(function () {
    //set parent to value of dropdown
    $("#imputQuickParentId").val( $("#imputQuickDropdown").val() );
    // alert that parent is changed
    $("#quickNoteParent").html("Posting To:");
  });


  $(".cancelForm").click(function() {
    hideAllFormsSlow();
    resetAllForms();
  });

  $(".clearForm").click(function () {
    resetAllForms();
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

      }// end else

    } // end sucess
  }); // end ajax get call
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
  $(
    '<div class="cropContainer" id="' + data.id + '">' + 
    '<h2><em>' + data.kind + '</em> :: ' + data.title + '</h2>' + 
    '<p>' + data.longText + '</p>' +
    '<a href="#actionLogForm" onclick="setActionLogParent(\'' + data.id + '\', \'' + data.title + '\' )">[Log Action]</a>' +
    '<a href="#quickNoteForm" onclick="setQuickNoteParent(\'' + data.id + '\', \'' + data.title + '\' )">[Quick Note]</a>' +
    '<a onclick="deleteRecord(\'' + data.id + '\')">[Remove]</a>' +
    '</div>'
  ).appendTo('#'+data.parentId);
}

function printActionToScreen(data) {
  $(
    '<div class="actionContainer" id="' + data.id + '">' + 
    '<h3><em>' + data.kind + '</em> :: ' + data.title + '</h3>' + 

    '<p>' + data.longText + '</p>' +

    '<a href="#actionLogForm" onclick="setActionLogParent(\'' + data.id + '\', \'' + data.title + '\' )">[Log Action]</a>' +
    '<a href="#quickNoteForm" onclick="setQuickNoteParent(\'' + data.id + '\', \'' + data.title + '\' )">[Quick Note]</a>' +
    '<a onclick="deleteRecord(\'' + data.id + '\')">[Remove]</a>' +
    '</div>'
  ).appendTo('#'+data.parentId);
}

function printQuickToScreen(data) {
  $(
    '<div class="quickContainer" id="' + data.id + '">' + 
    '<p>' + data.longText + '</p>' +
    '<a onclick="deleteRecord(\'' + data.id + '\')">[Remove]</a>' +
    '</div>'
  ).appendTo('#'+data.parentId);
}

function printChronOldest(data) {
  $(
    '<div class="logByDate">' +
    '<h5><em>' + 'Date' + '</em> :: ' + data.kind + ' post :: <em>' + data.parentTitle + '</em> :: ' + data.title + ' ::</h5>' +
    '<p>' + data.longText + '</p>' + 
    '</div>'
  ).appendTo('#chronOldest');
}

function printChronNewest(data) {
  $(
    '<div class="logByDate">' +
    '<h5><em>' + 'Date' + '</em> :: ' + data.kind + ' post :: <em>' + data.parentTitle + '</em> :: ' + data.title + ' ::</h5>' +
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
  if (data.kind === "crop") {
    // open and close an option with the value of ID and html title of title
    $('<option/>').val(data.id).html(data.title).appendTo('#imputQuickDropdown');
  }
}

function populateCropLinks(data) {
  if (data.kind === "crop") {
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

function hideAllForms () {
    $("#cropLogForm").hide();
    $("#actionLogForm").hide();
    $("#quickNoteForm").hide();
}

function hideAllFormsSlow () {
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








