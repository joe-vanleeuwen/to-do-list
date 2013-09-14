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
		toggleButtons()
		// if newToDoAdded === false, function will only loop through collection and display titles. Otherwise function will first fetch collection and display titles.
		// newToDoAdded = fetchAndOrDisplayCollection(uncompletedToDos, newToDoAdded) || false
		newlyAddedToDos = fetchAndOrDisplayCollection(uncompletedToDos, newlyAddedToDos)
	})

	$('.completed').click(function() {
		toggleButtons()
		// oldToDoCompleted = fetchAndOrDisplayCollection(completedToDos, oldToDoCompleted) || false
		newlyCompletedToDos = fetchAndOrDisplayCollection(completedToDos, newlyCompletedToDos)
	})

	$('.save').click(function() {
		var toDo = new ToDoClass();
		toDo.set('title', $('.add').val());
		// sort into collections based on value of property completed
		toDo.set('completed', false);
		toDo.save({
			success: function(result) {
				console.log(result.id)
				newlyAddedToDos.push(result.id)
				addToDoButton();
				if ($('.uncompleted').hasClass('toggle-button-active')) {
					addToDo(result);
					// $('.content ul').append('<hr>');
				};
			},
			error: function(results, error) {
				console.log(error.description)
			}
		});
	});

	$('.add-to-do').click(function() {
		addToDoButton();
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
		$(addToDo(toDo, resultingCollection)).click(function() {
			console.log(toDo.get('title'));
		}).hover(function() {
			// you'd think i could target the spans in the li and give the class visible and then remove on mouseout. 
			// Could'nt seem to get that to work. And when i chose to append the spans and remove on mouseout,
			// when the mouse would hover for a little extra over the <hr> tagss that separate the <li> tags,
			// the mousein and mouseout would target the <hr> tags and append the spans onto them. . . .
			// HAHA, long story just lost relevance--I just separated the <hr> tag out of var item in the addToDo function. Fixed!
			// Though, i had solved the problem using an alternative method.
			var editCompleteDelete = '<a href="#" class="edit">✎</a><a href="#" class="complete">✓</a><a href="#" class="delete">✕</a>';
			$(this).append(editCompleteDelete);
		},
		function() {
			$(this).html('');
			$(this).text(toDo.get('title'));
		});
	});  
}

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

function toggleButtons() {
	$('.uncompleted').toggleClass('toggle-button-active');
	$('.completed').toggleClass('toggle-button-active');
}

function addToDoButton() {
	$('.new-to-do').toggleClass('new-to-do-active');
	$('.thin-line').toggleClass('thin-line-active');
	$('.container').toggleClass('container-active');
};

function validate() {
	inputs = $('input');
	var valid = true
	inputs.each(function(input) {
		if($(inputs[input]).val() === "") {
			valid = false;
		}
	})
	return valid;
}





