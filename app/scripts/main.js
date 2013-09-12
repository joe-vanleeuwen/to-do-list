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

var uncompletedToDos = new UncompletedToDoCollectionClass();
var completedToDos = new CompletedToDoCollectionClass();

var newToDoAdded = false;
var oldToDoCompleted = true;

$('document').ready(function() {

	fetchAndDisplayCollection(uncompletedToDos)

	$('.uncompleted').click(function() {
		toggleButtons()
		if (newToDoAdded) {
			fetchAndDisplayCollection(uncompletedToDos)
		}
		else {displayCollection(uncompletedToDos)}
	})

	$('.completed').click(function() {
		toggleButtons()
		if (oldToDoCompleted) {
			fetchAndDisplayCollection(completedToDos)
		}
		else {displayCollection(completedToDos)}
	})

	$('.save').click(function() {
		var toDo = new ToDoClass();
		toDo.set('title', $('.add').val());
		toDo.set('completed', false);
		toDo.save({
			success: function(result) {
				newToDoAdded = true;
				addToDoButton();
				if ($('.uncompleted').hasClass('toggle-button-active')) {
					addToDo(result);
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

function addToDo(toDo) {
	var item = $('<li>' + toDo.get('title') + '</li><hr>');
	$('.content ul').append(item);
	return item;
}

function fetchAndDisplayCollection(collection) {
	collection.fetch({
		success: function(resultinCollection) {
			// clearing out the ul
			$('.content ul').html('');
			// this will diplay all toDo's in the specified collection
			// and attatch a click event to each <li>.
			resultinCollection.each(function(toDo) {
				$(addToDo(toDo)).click(function() {
					console.log(toDo.get('title'));
				})
			}) 
		},
		error: function(resultinCollection, error) {
			console.log(error.description);
		}
	});
}

function displayCollection(collection) {
	$('.content ul').html('');
	collection.each(function(toDo) {
		addToDo(toDo)
	}) 
}

function toggleButtons() {
	$('.uncompleted').toggleClass('toggle-button-active')
	$('.completed').toggleClass('toggle-button-active')
}

function addToDoButton() {
	$('.new-to-do').toggleClass('new-to-do-active')
	$('.thin-line').toggleClass('thin-line-active')
	$('.container').toggleClass('container-active')
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

