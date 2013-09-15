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

var selectedId;

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
		// save('.edit-input', uncompletedToDos);
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
function getQuery(id, toggleClass, collectionToBeAddedTo, collectionToBeDisplayed) {
	var query = new Parse.Query(ToDoClass);
	query.get(id, {
	  success: function(toDo) {
	      collectionToBeAddedTo.add(toDo);
	      displayCollectionIf(collectionToBeDisplayed, toggleClass)
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
		makeIconsClickable(addIcons(addToDo(toDo, collection), toDo, collection), toDo)
	});  
};

function addIcons(item, toDo, collection) {
	$(item).hover(function() {
		var editIt = '<a href="#" class="edit" "' + toDo.id + '">✎</a>';
		var completeIt = '<a href="#" class="complete" "' + toDo.id + '">✓</a>';
		var deleteIt = '<a href="#" class="delete" "' + toDo.id + '">✕</a>';
		if (collection === uncompletedToDos) {
			$(this).append(editIt, completeIt, deleteIt)
		}
		else { $(this).append(deleteIt) };
	},
	function() {
		$(this).html('');
		$(this).text(toDo.get('title'));
	});
	return item;
};

function makeIconsClickable(item, toDo) {
	$(item).on('click', '.edit', function() {
		toggleEditModal();
		$('.edit-input').val(toDo.get('title'));
		selectedId = toDo.id;
	});
	$(item).on('click', '.complete', function() {
		selectedId = toDo.id;
		saveCompletion(uncompletedToDos, completedToDos)
	});
	$(item).on('click', '.delete', function() {
		console.log('delete')
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

		hardSave(toDo, inputClass, collection, 'saveAddition');
};

function saveEdit(inputClass, collection) {
	collection.each(function(toDo) {
		if (toDo.id === selectedId) {
			toDo.set('title', $(inputClass).val());
			hardSave(toDo, inputClass, collection, 'saveEdit');
		};
	});
};

function saveCompletion(originalCollection, collection) {
	originalCollection.each(function(toDo) {
		if (toDo.id === selectedId) {
			toDo.set('completed', true);
			originalCollection.remove(toDo);
			hardSave(toDo, '', collection, 'saveCompletion');
		};
	});
};

function hardSave(toDo, inputClass, collection, task) {
	if (validate(inputClass)) {
		toDo.save({
			success: function(result) {
				if (task === 'saveAddition') {
					getQuery(toDo.id, '.uncompleted', collection, collection);
				}
				if (task === 'saveCompletion') {
					getQuery(toDo.id, '.uncompleted', collection, uncompletedToDos);
				}
				else {displayCollectionIf(collection, '.uncompleted')};
			},
			error: function(results, error) {
				console.log(error.description)
			}
		});
	};
};

function displayCollectionIf(collection, toggleClass) {
	if ($(toggleClass).hasClass('toggle-button-active')) {
		displayCollection(collection);
	};
}








