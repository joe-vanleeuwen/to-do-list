Parse.initialize("ltHC6n4UFCaXv6WtrRIh2EqlUUtos2cJLleHs1r2", "27H9dOOERvmIJvN0KwLBvPAQ5FaCrwGZNX1YgS0S");

// Create the constructor.
var ToDoClass = Parse.Object.extend("ToDo");

// A Collection containing all instances of ToDoClass that have been completed.
var UncompletedToDoCollectionClass = Parse.Collection.extend({
    model: ToDoClass,
    query: (new Parse.Query(ToDoClass)).equalTo('completed', false)
});

// A Collection containing all instances of ToDoClass that have not been completed.
var CompletedToDoCollectionClass = Parse.Collection.extend({
    model: ToDoClass,
    query: (new Parse.Query(ToDoClass)).equalTo('completed', true)
});

// creating new collections. One for uncompleted ToDos and one for completed ToDos
var uncompletedToDos = new UncompletedToDoCollectionClass();
var completedToDos = new CompletedToDoCollectionClass();

// for use when user clicks Completed for the first time.
var needsFetched = true;

$('document').ready(function() {

	// fetching the uncompleted toDos to display initially
	fetchCollection(uncompletedToDos)

	// toggle buttons ToDo and Completed
	$('.uncompleted').click(function() {
		if(!($(this).hasClass('toggle-button-active'))) {
			toggleButtons();
			displayCollection(uncompletedToDos);
		}
	})

	$('.completed').click(function() {
		if(!($(this).hasClass('toggle-button-active'))) {
			toggleButtons();
			
			// previous attempt at fetching had a bug. Think I have to use this global variable instead to ensure the collection gets fetched.
			if(needsFetched) {
				fetchCollection(completedToDos)
				needsFetched = false;
			}
			else {displayCollection(completedToDos)};
		};
	})

	// clicking the pluss sign will save new toDo
	$('.add-button').click(function() {
		toggleDropDown();
		saveAddition('.add-input', uncompletedToDos);
	});

	$('.add-input').keydown(function(event) {
		inputLetterLimit('.add-input')
		if (event.which == 13) {
			toggleDropDown();
			saveAddition(('.add-input'), uncompletedToDos);
		};
   	});

   	// editting functionality
   	$('.edit-button').click(function() {
   		toggleEditModal();
   		saveEdit('.edit-input', uncompletedToDos)
	});

   	$('.edit-input').keydown(function(event) {
   		inputLetterLimit('.edit-input')
   		if (event.which == 13) {
   			toggleEditModal();
			saveEdit(('.edit-input'), uncompletedToDos);
		};
   	});

   	// drop down the .add-to-do
	$('.add-to-do').click(function() {
		$('.add-input').focus();
		toggleDropDown();
	});

	// making content 'scrollable'
	$('.content').scroll();

	// modal off when user clicks outside input and button
	$('.modal-background').click(function(event){
    	if(event.target === this){
    		toggleEditModal();
    	};
    });
});

// end document ready

function addToDo(toDo, collection) {
	var item = $('<li>' + toDo.get('title') + '</li>');
	$('.content ul').append('<hr>');
	$('.content ul').append(item);
	// appending <hr> after last <li> tag. Since the <li> tags are dynamically created, I must use this if statement to find when the last <li> is created and then append the <hr>.
	if ($('li').length === collection.length) {
		$('.content ul').append('<hr>');
	}
	return item;
};

function fetchCollection(collection) {
	collection.fetch({
		success: function(resultingCollection) {
			// this will diplay all toDo's in the specified collection and attatch a hover event to each <li>.
			displayCollection(resultingCollection);
		},
		error: function(resultingCollection, error) {
			console.log(error.description);
		}
	});
};

// this will get resently modified toDos and add them into the appropriate collection. Awesome.
function getQuery(id, collection) {
	var query = new Parse.Query(ToDoClass);
	query.get(id, {
	  success: function(toDo) {
	  		collection.add(toDo);
	      	displayCollectionIf();
	  },
	  error: function(toDo, error) {
	  	console.log(error.description);
	  }
	});
};

function displayCollection(collection) {
	// clearing out the ul
	$('.content ul').html('');
	// adding click and hover events to each toDo and display each toDo's title with edit, complete, and delete icons.
	collection.each(function(toDo) {
		// appending toDo. Appending icons to each toDo. Making icons clickable and adding functionality.
		makeIconsClickable(addIcons(addToDo(toDo, collection), toDo, collection), toDo, collection);
	});  
};

// appends icons to the toDos
function addIcons(item, toDo, collection) {
	$(item).hover(function() {
		var editIt = '<a href="#" class="edit">✎</a>';
		var completeIt = '<a href="#" class="complete">✓</a>';
		var deleteIt = '<a href="#" class="delete">✕</a>';

		// if statement appends icons depending on which collection is being viewed.
		if (collection === uncompletedToDos) {
			$(this).append(editIt, completeIt, deleteIt);
		}
		else { $(this).append(deleteIt) };
	},
	// removes icons hover out
	function() {
		$('ul').find('a').remove();
	});
	// item is the complete <li> tag that represents each toDo
	return item;
};

// listening for a click on the <li> tag representing each toDo. Finding the icon that is clicked and performing related function.
function makeIconsClickable(item, toDo, collection) {
	$(item).on('click', '.edit', function() {
		// revealing input.
		toggleEditModal();
		// hide drop down if visible.
		if ($('.new-to-do').hasClass('new-to-do-active')) {
			toggleDropDown();
		};
		// placing toDo title in input for editting.
		$('.edit-input').val(toDo.get('title'));
		// setting .edit-intup's id to the toDo's id who's icon was clicked--for use in saving the changes.
		$('.edit-input').attr('id', toDo.id);
		// focusing cursur in the input
		$('.edit-input').focus();
	});
	// clicking checkmark
	$(item).on('click', '.complete', function() {
		saveCompletion(collection, completedToDos, toDo.id);
	});
	// clicking x
	$(item).on('click', '.delete', function() {
		saveDeletion(collection, toDo.id);
	});
};

// toggle modal, toggleButtons, and drop-down.
function toggleEditModal() {
	$('.modal-background').toggleClass('modal-background-active');
	$('.modal-box').toggleClass('modal-box-active');
};

function toggleButtons() {
	$('.uncompleted').toggleClass('toggle-button-active');
	$('.completed').toggleClass('toggle-button-active');
};

function toggleDropDown() {
	$('.new-to-do').toggleClass('new-to-do-active');
	$('.thin-line').toggleClass('thin-line-active');
	$('.container').toggleClass('container-active');
};

// confirm input has content and then remove content. Simple, maybe should have done more with validation.
function validate(inputClass) {
	if($(inputClass).val() === '') {
		return false;
	}
	else {
		$(inputClass).val('');
		return true;
	};
};

function inputLetterLimit(inputClass) {
	$('#input-pixel-length').text($(inputClass).val());

	if ($('#input-pixel-length').width() > 225) {
		var inputVal = ($(inputClass).val()).slice(0, -1);
		$(inputClass).val(inputVal);
	};
};

// functions for saving new toDos, edits and completions of existing toDos, deltions of toDos.
function saveAddition(inputClass, collection) {
		var toDo = new ToDoClass();
		toDo.set('title', $(inputClass).val());
		toDo.set('completed', false);

		hardSave(toDo, inputClass, collection);
};

function saveEdit(inputClass, collection) {
	collection.each(function(toDo) {
		if (toDo.id === $(inputClass).attr('id')) {
			toDo.set('title', $(inputClass).val());

			hardSave(toDo, inputClass, collection);
		};
	});
};

function saveCompletion(originalCollection, collection, toDoId) {
	originalCollection.each(function(toDo) {
		if (toDo.id === toDoId) {
			toDo.set('completed', true);
			originalCollection.remove(toDo);

			hardSave(toDo, '', collection);
		};
	});
};

function saveDeletion(collection, toDoId) {
	collection.each(function(toDo) {
		if (toDo.id === toDoId) {
			// i have these following two lines of code outside of the success so the feedback for the user is instantanious. Removed succes callback.
			collection.remove(toDo);
			displayCollectionIf();
			toDo.destroy({
				error: function(toDo, error) {
					console.log(error.description);
					getQuery(toDo.id, collection);
				}
			});
		};
	});
};

function hardSave(toDo, inputClass, collection) {
	if (validate(inputClass)) {
		toDo.save(null, {
			success: function(toDo) {
				// all other saves need a query to alter the collection. Edit does not change a toDo's collection--doesn't need query.
				if (inputClass === '.edit-input') {
					displayCollectionIf();
				}
				else {getQuery(toDo.id, collection)};
			},
			error: function(toDo, error) {
				console.log(error.description);
				getQuery(toDo.id, collection);
			}
		});
	};
};

// displaying collection depending on which toglle button is toggled on.
function displayCollectionIf() {
	if ($('.uncompleted').hasClass('toggle-button-active')) {
		displayCollection(uncompletedToDos);
	};
	if ($('.completed').hasClass('toggle-button-active')) {
		displayCollection(completedToDos);
	};
};








