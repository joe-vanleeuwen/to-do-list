/*global describe, it */
'use strict';
(function () {
    describe('ToDo', function() {
    	this.timeout(15000);
    	// it('when save button is clicked, should save new ToDo to Parse', function(done) {
    	// 	var result;

    	// 	var newToDo = "Do this " + Math.floor(Math.random()*100000) + " times."
     //        console.log(newToDo);
     //        $('.add-input').val(newToDo)

    	// 	$('.add-button').click();

    	// 	setTimeout(function(){
    	// 		var query = new Parse.Query(ToDoClass)
    	// 		query.equalTo('title', newToDo)
    	// 		query.find({
    	// 			success: function(results) {
     //                    result = results[0];
    	// 				expect(result.get('title')).to.equal(newToDo);
    	// 				done();
    	// 			},
    	// 			error: function(result, error) {
    	// 				done(error.description);
    	// 			}
    	// 		});
    	// 	},2500)
    	// });

     //    it('when save button is clicked and ToDo button is depressed, should add the new ToDo to the .content ul', function(done) {

     //        var newToDo = "Do this " + Math.floor(Math.random()*100000) + " times."
     //        $('.add-input').val(newToDo)

     //        $('.add-button').click();

     //        setTimeout(function(){
     //            expect($('.content ul li').last().text()).to.equal(newToDo)
     //            done();
     //        },2000)
     //    });

     //    it('when save button is clicked and ToDo button is NOT depressed, should NOT add the new ToDo to the .content ul', function(done) {

     //        $('.uncompleted').removeClass('toggle-button-active');
     //        var newToDo = "Do this " + Math.floor(Math.random()*100000) + " times."
     //        $('.add-input').val(newToDo)

     //        $('.add-button').click();

     //        setTimeout(function(){
     //            expect($('.content ul li').last().text()).to.not.equal(newToDo)
     //            done();
     //        },2000)
     //    });

     //    it('when ToDo button is depressed, the .content ul should only contain toDos who\'s completed property is false', function(done) {
     //        var uncompleted = 0;
     //        fetchCollection(uncompletedToDos)
     //        displayCollection(uncompletedToDos);

     //        setTimeout(function(){
     //            var allToDos = $('.content ul li');
     //            uncompletedToDos.each(function(toDo, index) {
     //                var title = $(allToDos[index]).text()
                    
     //                if (toDo.get('title') === title) {
     //                    if (toDo.get('completed') === false)
     //                    uncompleted += 1;
     //                }
     //            })
     //            expect(uncompleted).to.equal(uncompletedToDos.length)
     //            done();
     //        },2500)
     //    });

     //    it('when Completed button is depressed, the .content ul should only contain toDos who\'s completed property is true', function(done) {
     //        toggleButtons();

     //        var completed = 0;
     //        fetchCollection(completedToDos)
     //        displayCollection(completedToDos);

     //        setTimeout(function(){
     //            var allToDos = $('.content ul li');
     //            completedToDos.each(function(toDo, index) {
     //                var title = $(allToDos[index]).text()
                    
     //                if (toDo.get('title') === title) {
     //                    if (toDo.get('completed') === true)
     //                    completed += 1;
     //                }
     //            })
     //            expect(completed).to.equal(completedToDos.length)
     //            done();
     //        },2500)
     //    });

     //    it('when input value === "", clicking .save (or pressing enter in .add input--how can i test?) should not save new toDo', function(done) {
     //        newlyAddedToDos = [];
     //        $('.add-input').val('');

     //        setTimeout(function(){
     //            $('.add-button').click();
     //            expect(newlyAddedToDos).to.have.length(0);
     //            done();
     //        },2500)
     //    });

        it('when an editted toDo is saved, uncompletedToDos.length should not increase', function(done) {
            var result;
            var collectionLength;

            var newToDo = "Do this " + Math.floor(Math.random()*100000) + " times."
            $('.add-input').val(newToDo)

            setTimeout(function(){
                collectionLength = uncompletedToDos.length;
                $('.add-button').click();
                setTimeout(function(){
                    var query = new Parse.Query(ToDoClass)
                    query.equalTo('title', newToDo)
                    query.find({
                        success: function(results) {
                            result = results[0];
                            $('.edit-input').val(result.get('title'));
                            $('.edit-button').click();
                        },
                        error: function(result, error) {
                            done(error.description);
                        }
                    });
                    setTimeout(function(){
                        uncompletedToDos.fetch();
                        setTimeout(function(){
                            expect(uncompletedToDos).to.have.length(collectionLength + 1);
                            done();
                        },2500)
                    },2500)
                },2500)
            },2500)

            uncompletedToDos.fetch();
        });
    })
})();







