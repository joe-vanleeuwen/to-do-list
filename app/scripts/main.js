Parse.initialize("ltHC6n4UFCaXv6WtrRIh2EqlUUtos2cJLleHs1r2", "27H9dOOERvmIJvN0KwLBvPAQ5FaCrwGZNX1YgS0S");

// Create the object.
var Participant = Parse.Object.extend("Participant");

// A Collection containing all instances of TestObject.
var ParticipantCollection = Parse.Collection.extend({
  model: Participant
});

var collection = new ParticipantCollection();

// collection.fetch({
//   success: function(collection) {
//     collection.each(function(object) {
//     	var thing = $('<div>' + object.get('name') + ', status: ' + object.get('done') + '<div>')
//     	thing.click(function() {
//     		object.set('done', true);
//     		object.save();
//     	});
//       $('.container').append(thing)
//     });
//   },
//   error: function(collection, error) {
//   }
// });




var Participant = Parse.Object.extend('Participant',
	{
		setProperties: function(name, email, occupation, location) {
			this.set('name', name);
			this.set('email', email);
			this.set('occupation', occupation);
			this.set('location', location);
		}
	}
);

$('document').ready(function() {

	$('.save').click(function() {
		var participant = new Participant();
		participant.setProperties($('.name').val(),$('.email').val(),$('.occupation').val(),$('.location').val());

		if(validate()) {
			participant.save(null, {		
				success: function(participant) {
					$('.success').animate({right: "-100px"}, 500);
				},
				error: function(participant, error) {
					$('.failure').animate({right: "-100px"}, 500);
				}
			});
		}
		else {$('.failure').animate({right: "-100px"}, 500);}
	});
});

$('.add-to-do').click(function() {
		$('.new-to-do').toggleClass('new-to-do-active')
		$('.thin-line').toggleClass('thin-line-active')
		$('.container').toggleClass('container-active')

	});


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

