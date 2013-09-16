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
			if(completedToDos.length === 0) {
				fetchCollection(completedToDos)
			}
			else {displayCollection(completedToDos)};
		};
	})

	// clicking the pluss sign will save
	$('.add-button').click(function() {
		toggleDropDown();
		saveAddition('.add-input', uncompletedToDos);
	});

	$('.add-input').keydown(function(event) {
		// toggleDropDown()
		if (event.which == 13) {
			saveAddition(('.' + $(this).attr('class')), uncompletedToDos);
		};
   	});

   	// editting functionality
   	$('.edit-button').click(function() {
   		toggleEditModal()
   		saveEdit('.edit-input', uncompletedToDos)
	});

   	$('.edit-input').keydown(function(event) {
   		// toggleEditModal()
   		if (event.which == 13) {
			saveEdit(('.' + $(this).attr('class')), uncompletedToDos);
		};
   	});

	$('.add-to-do').click(function() {
		toggleDropDown();
	});

	$('.modal-background').click(function(event){
    	if(event.target === this){
    		toggleEditModal();
    	}
    });
});

function addToDo(toDo, collection) {
	var item = $('<li>' + toDo.get('title') + '</li>');
	$('.content ul').append('<hr>');
	$('.content ul').append(item);
	// if ($('li').length === collection.length) {
	// 	$('.content ul').append('<hr>');
	// }
	// $('.content ul').append('<hr>');
	return item;
}

function fetchCollection(collection) {
	collection.fetch({
		success: function(resultingCollection) {
			// this will diplay all toDo's in the specified collection
			// and attatch a click event to each <li>.
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
	      	displayCollectionIf()
	  },
	  error: function(toDo, error) {
	  	console.log(error.description);
	  }
	});
}

function displayCollection(collection) {
	// clearing out the ul
	$('.content ul').html('');
	// adding click and hover events to each toDo and display each toDo's title with edit, complete, and delete icons.
	collection.each(function(toDo) {
		// appending toDo. Appending icons to each toDo. Making icons clickable and adding functionality.
		makeIconsClickable(addIcons(addToDo(toDo, collection), toDo, collection), toDo, collection)
	});  
};

// appends icons to the toDos
function addIcons(item, toDo, collection) {
	$(item).hover(function() {
		var editIt = '<a href="#" class="edit" "' + toDo.id + '">✎</a>';
		var completeIt = '<a href="#" class="complete" "' + toDo.id + '">✓</a>';
		var deleteIt = '<a href="#" class="delete" "' + toDo.id + '">✕</a>';

		// if statement appends icons depending on which collection is being viewed.
		if (collection === uncompletedToDos) {
			$(this).append(editIt, completeIt, deleteIt)
		}
		else { $(this).append(deleteIt) };
	},
	// removes icons and title on hover out, replacing title immediately afterwards.
	function() {
		$(this).html('');
		$(this).text(toDo.get('title'));
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
	});
	$(item).on('click', '.complete', function() {
		saveCompletion(collection, completedToDos, toDo.id)
	});
	$(item).on('click', '.delete', function() {
		saveDeletion(collection, toDo.id)
	});
};

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

function validate(inputClass) {
	if($(inputClass).val() === "") {
		return false;
	}
	else {return true};
};

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
			collection.remove(toDo);
			displayCollectionIf();
			toDo.destroy({
				success: function(toDo) {
				},
				error: function(toDo, error) {
					console.log(error.description);
					getQuery(toDo.id, collection);
				}
			});
		};
	});
}

function hardSave(toDo, inputClass, collection) {
	if (validate(inputClass)) {
		toDo.save({
			success: function(toDo) {
				if (inputClass === '.edit-input') {
					displayCollectionIf()
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

function displayCollectionIf() {
	if ($('.uncompleted').hasClass('toggle-button-active')) {
		displayCollection(uncompletedToDos);
	};
	if ($('.completed').hasClass('toggle-button-active')) {
		displayCollection(completedToDos);
	};
};








