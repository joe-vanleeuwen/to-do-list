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

// these properties will help only fetch the collection when an instance of the collection's model has been modified. 
// var newToDoAdded = true;
// var oldToDoCompleted = true;

var newlyAddedToDos = [];
var newlyCompletedToDos = [];

$('document').ready(function() {

	// fetching the uncompleted toDos to display initially
	fetchCollection(completedToDos)
	fetchCollection(uncompletedToDos)

	// toggle buttons ToDo and Completed
	$('.uncompleted').click(function() {
		toggleButtons();
		// if newToDoAdded === false, function will only loop through collection and display titles. Otherwise function will first fetch collection and display titles.
		// newToDoAdded = fetchAndOrDisplayCollection(uncompletedToDos, newToDoAdded) || false
		newlyAddedToDos = fetchAndOrDisplayCollection(uncompletedToDos, newlyAddedToDos);
	})

	$('.completed').click(function() {
		toggleButtons();
		// oldToDoCompleted = fetchAndOrDisplayCollection(completedToDos, oldToDoCompleted) || false
		newlyCompletedToDos = fetchAndOrDisplayCollection(completedToDos, newlyCompletedToDos);
	})

	// clicking the pluss sign will save
	$('.add-button').click(function() {
		toggleDropDown()
		save('.add-input');
	});

	$('.add-input').keydown(function(event) {
		// toggleDropDown()
		saveOnEnter('.' + $(this).attr('class'));
   	});

   	// editting functionality
   	$('.edit-button').click(function() {
   		toggleEditModal()
		save('.edit-input');
	});

   	$('.edit-input').keydown(function(event) {
   		// toggleEditModal()
		saveOnEnter('.' + $(this).attr('class'));
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

function fetchAndOrDisplayCollection(collection, needsFetched) {
	displayCollection(collection);

	if (needsFetched.length > 0) {
		needsFetched.forEach(function(id) {			
			getQuery(collection, id);
		});
	};
	return [];
};

function fetchCollection(collection) {
	collection.fetch({
		success: function(resultingCollection) {
			// this will diplay all toDo's in the specified collection
			// and attatch a click event to each <li>.
			console.log('what')
			displayCollection(resultingCollection);
		},
		error: function(resultingCollection, error) {
			console.log(error.description);
		}
	});
};

// this will get resently modified toDos and add them into the appropriate collection. Awesome.
function getQuery(collection, id) {
	var query = new Parse.Query(ToDoClass);
	query.get(id, {
	  success: function(toDo) {
	      collection.add(toDo)
	      displayCollection(collection);
	  },
	  error: function(toDo, error) {
	  	console.log(error.description);
	  }
	});
}

function displayCollection(resultingCollection) {
	// clearing out the ul
	$('.content ul').html('');
	// adding click and hover events to each toDo and display each toDo's title with edit, complete, and delete icons.
	resultingCollection.each(function(toDo) {
		// appending toDo. Appending icons to each toDo. Making icons clickable and adding functionality.
		makeIconsClickable(addIcons(addToDo(toDo, resultingCollection), toDo), toDo)
	});  
};

// will take item argument which will be an <li> tag with a toDo title inside.
function addIcons(item, toDo) {
	$(item).hover(function() {
		var icons = '<a href="#" class="edit" "' + toDo.id + '">✎</a><a href="#" class="complete" "' + toDo.id + '">✓</a><a href="#" class="delete" "' + toDo.id + '">✕</a>';
		$(this).append(icons)
	},
	function() {
		$(this).html('');
		$(this).text(toDo.get('title'));
	});
	return item;
}

function makeIconsClickable(item, toDo) {
	$(item).on('click', '.edit', function() {
		toggleEditModal();
		$('.edit-input').val(toDo.get('title'));
	});
	$(item).on('click', '.complete', function() {
		console.log('complete')
	});
	$(item).on('click', '.delete', function() {
		console.log('delete')
	});
};

function toggleEditModal() {
	$('.modal-background').toggleClass('modal-background-active');
	$('.modal-box').toggleClass('modal-box-active');
}

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

function save(inputClass) {
	var toDo = new ToDoClass();
	toDo.set('title', $(inputClass).val());
	// sort into collections based on value of property completed
	toDo.set('completed', false);
	if (validate(inputClass)) {
		toDo.save({
			success: function(result) {
				newlyAddedToDos.push(result.id)
				if ($('.uncompleted').hasClass('toggle-button-active')) {
					addToDo(result);
				};
			},
			error: function(results, error) {
				console.log(error.description)
			}
		});
	};
};

function saveOnEnter(inputClass) {
	if (event.which == 13) {
		save(inputClass);
	};
};








