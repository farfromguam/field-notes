Field Notes
-----------

####This will soon be a dead branch

- Apps current location @ https://fieldnotes-y8xlb.backliftapp.com/
- Apps future location @ http://fieldnotes.frymanet.com/


###Goals of This Project:

1.  Use The Tools and skills learned in the first three months
    of the bootcamp to build *something*.

2.  Integrate with an existing API.

3.  Push my knowledge and skills to the limit.

###Self Imposed Goals

1.  Build something useful.

2.  Build for a real user, and have real feedback.

3.  Make it snappy (my last project was slow)

4.  Build the project as best as I can to prepare for a sql backend

###Future Plans

1.  Transfer backend from Backlift to something that I have control over.

2.  Build in support for multiple users with individual gardens.

3.  Build in support for annual garden refreshes


History of Project
------------------

This project arose out of a need to remember what worked historically in our garden the years previously. A Log Book was suggested and it was an ideal soultion, a place to record data that could be looked over and added to. Through conversation with the garden planners I suggested that this Log Book could be built online and it could be a workable solution.

I now have a *client* Taren Spence, She helps run this community garden near my house. Through conversations with her we disussed features of this web app and I was given a [rough scope of work](https://docs.google.com/file/d/1vTGu3K1QMnXq8YzdX1__k7Kvh58bQM7_Ju_w-GencE5vAnCfGidMc5Ca6Zkr/edit?usp=sharing).

The current State
-----------------

I have the ability to post Three different kinds of logs  
* A crop log for the inital plant entry
* A action log for anything that you do and want to track
* A quick note log for ... Quick notes

Why Three?
The user expressed a need to enter data in diffrent combinations for different actions. Logically I broke down these actions into general types and made them unique to avoid the repeated entry of data.

The app is able to view this data in 3 ways
* Orderd by crop, presented in a tree version with nested comments
* Chronologically with the newest first
* Chronoligically with the oldest first

The app is a single page app with navagation handled by Quick Links to the crops, when clicking on these links you are taken to the crop view, and crop entry.

To aid in navagation A find feature is implemed, you stay on the current page and the term you searched for is highlighted, much like the default action of the browsers. In my experience most users do not know that browers have this ability and I wanted to provide this function for them.

Not yet fully implimented
-------------------------

Form Validation
only certain fields are required for each log type. A field with a value of undefined is not displayed in the page views.

The weather API
Currently, the chosen API provides data over http and not https.
The backlift service requires https and I am currently migrating to a new host.
The target website will be at @ http://fieldnotes.frymanet.com/
Once this is complete feature work, and refactoring will resume.






