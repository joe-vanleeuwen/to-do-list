function addToDo(a){var b=$("<li>"+a.get("title")+"</li>");return $(".content ul").append("<hr>"),$(".content ul").append(b),b}function fetchAndOrDisplayCollection(a,b){return displayCollection(a),b.length>0&&b.forEach(function(b){getQuery(a,b)}),[]}function getQuery(a,b){var c=new Parse.Query(ToDoClass);c.get(b,{success:function(b){a.add(b),displayCollection(a)},error:function(a,b){console.log(b.description)}})}function displayCollection(a){$(".content ul").html(""),a.each(function(b){$(addToDo(b,a)).click(function(){console.log(b.get("title"))}).hover(function(){var a='<a href="#" class="edit">✎</a><a href="#" class="complete">✓</a><a href="#" class="delete">✕</a>';$(this).append(a)},function(){$(this).html(""),$(this).text(b.get("title"))})})}function fetchCollection(a){a.fetch({success:function(a){console.log("what"),displayCollection(a)},error:function(a,b){console.log(b.description)}})}function toggleButtons(){$(".uncompleted").toggleClass("toggle-button-active"),$(".completed").toggleClass("toggle-button-active")}function addToDoButton(){$(".new-to-do").toggleClass("new-to-do-active"),$(".thin-line").toggleClass("thin-line-active"),$(".container").toggleClass("container-active")}function validate(){inputs=$("input");var a=!0;return inputs.each(function(b){""===$(inputs[b]).val()&&(a=!1)}),a}Parse.initialize("ltHC6n4UFCaXv6WtrRIh2EqlUUtos2cJLleHs1r2","27H9dOOERvmIJvN0KwLBvPAQ5FaCrwGZNX1YgS0S");var ToDoClass=Parse.Object.extend("ToDo"),UncompletedToDoCollectionClass=Parse.Collection.extend({model:ToDoClass,query:new Parse.Query(ToDoClass).equalTo("completed",!1)}),CompletedToDoCollectionClass=Parse.Collection.extend({model:ToDoClass,query:new Parse.Query(ToDoClass).equalTo("completed",!0)}),uncompletedToDos=new UncompletedToDoCollectionClass,completedToDos=new CompletedToDoCollectionClass,newlyAddedToDos=[],newlyCompletedToDos=[];$("document").ready(function(){fetchCollection(completedToDos),fetchCollection(uncompletedToDos),$(".uncompleted").click(function(){toggleButtons(),newlyAddedToDos=fetchAndOrDisplayCollection(uncompletedToDos,newlyAddedToDos)}),$(".completed").click(function(){toggleButtons(),newlyCompletedToDos=fetchAndOrDisplayCollection(completedToDos,newlyCompletedToDos)}),$(".save").click(function(){var a=new ToDoClass;a.set("title",$(".add").val()),a.set("completed",!1),a.save({success:function(a){console.log(a.id),newlyAddedToDos.push(a.id),addToDoButton(),$(".uncompleted").hasClass("toggle-button-active")&&addToDo(a)},error:function(a,b){console.log(b.description)}})}),$(".add-to-do").click(function(){addToDoButton()})});