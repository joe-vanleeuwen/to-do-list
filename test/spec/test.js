/*global describe, it */
'use strict';
(function () {
    describe('ToDo', function() {
    	this.timeout(15000);
    	it('when save button is clicked, should save new ToDo to Parse', function(done) {
    		var result;

    		var newToDo = "Do this " + Math.floor(Math.random()*100000) + " times."
            $('.add').val(newToDo)

    		$('.save').click();

    		setTimeout(function(){
    			var query = new Parse.Query(ToDoClass)
    			query.equalTo('title', newToDo)
    			query.find({
    				success: function(results) {
                        result = results[0];
    					expect(result.get('title')).to.equal(newToDo);
    					done();
    				},
    				error: function(result, error) {
    					done(error.description);
    				}
    			});
    		},2000)
    	});

        it('when save button is clicked and ToDo button is depressed, should add the new ToDo to the .content ul', function(done) {

            var newToDo = "Do this " + Math.floor(Math.random()*100000) + " times."
            $('.add').val(newToDo)

            $('.save').click();

            setTimeout(function(){
                expect($('.content ul li').last().text()).to.equal(newToDo)
                done();
            },2000)
        });

        it('when save button is clicked and ToDo button is NOT depressed, should NOT add the new ToDo to the .content ul', function(done) {

            $('.uncompleted').removeClass('toggle-button-active');
            var newToDo = "Do this " + Math.floor(Math.random()*100000) + " times."
            $('.add').val(newToDo)

            $('.save').click();

            setTimeout(function(){
                expect($('.content ul li').last().text()).to.not.equal(newToDo)
                done();
            },2000)
        });

        it('when ToDo button is depressed, the .content ul should only contain toDos who\'s completed property is false', function(done) {
            var uncompleted = 0;
            fetchAndDisplayCollection(uncompletedToDos);

            setTimeout(function(){
                var allToDos = $('.content ul li');
                uncompletedToDos.each(function(toDo, index) {
                    var title = $(allToDos[index]).text()
                    
                    if (toDo.get('title') === title) {
                        if (toDo.get('completed') === false)
                        uncompleted += 1;
                    }
                })
                expect(uncompleted).to.equal(uncompletedToDos.length)
                done();
            },2000)
        });

        it('when Completed button is depressed, the .content ul should only contain toDos who\'s completed property is true', function(done) {
            toggleButtons();

            var completed = 0;
            fetchAndDisplayCollection(completedToDos);

            setTimeout(function(){
                var allToDos = $('.content ul li');
                completedToDos.each(function(toDo, index) {
                    var title = $(allToDos[index]).text()
                    
                    if (toDo.get('title') === title) {
                        if (toDo.get('completed') === true)
                        completed += 1;
                    }
                })
                expect(completed).to.equal(completedToDos.length)
                done();
            },2000)
        });
    })
})();
