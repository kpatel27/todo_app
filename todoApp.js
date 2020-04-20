//TODO OBJECT

function Todo(todo) {
  if (!todo.title || Object.keys(todo).length > 4) {
    return { invalidInput: 'Please enter a valid todo'};
  }

  this.title = todo.title;
  this.month = todo.month || String(new Date().getMonth() + 1);
  this.year = todo.year || String(new Date().getFullYear());
  this.description = todo.description;
  this.completed = false;
}

Todo.prototype.isWithinMonthYear = function(month, year) {
  var todoYear = parseInt(this.year, 10);
  var todoMonth = parseInt(this.month, 10);
  var month = parseInt(month, 10);
  var year = parseInt(year, 10);
  return todoYear < year || (todoYear === year && todoMonth <= month);
};

//TODOLIST

var todoList = (function() {
  var todoId = 0;
  var todos = [];

  function generateTodoId() {
    todoId += 1;
    return todoId;
  }

  function cloneTodo(todo) {
    var todoCopy = new Todo({title: '-', month: '', year: '', description: ''});
    Object.keys(todo).forEach(function(property) {
      todoCopy[property] = todo[property];
    });

    return todoCopy;
  }

  function cloneTodoList(list) {
    var todoListCopy = [];
    list.forEach(function(todo) {
      todoListCopy.push(cloneTodo(todo));
    });

    return todoListCopy;
  }

  return {
    init: function(todoSet) {
      todoSet.forEach(function(todo) {
        var todoObj = new Todo(todo);
        if (todoObj instanceof Todo) {
          todoObj.id = generateTodoId();
          todos.push(todoObj);
        }
      });

      return this;
    },

    allTodos: function() {
      return cloneTodoList(todos);
    },

    addTodo: function(todo) {
      var todoObj = new Todo(todo);
      if (todoObj instanceof Todo) {
        todoObj.id = generateTodoId();
        todos.push(todoObj);
        return 'Todo successfully added!'
      } else {
        return 'Invalid Todo Object';
      }

    },

    deleteTodo: function(todoId) {
      var newList = todos.filter(function(todo) {
        return todo.id !== todoId;
      });

      if (newList.length < todos.length) {
        todos = newList;
        return 'Todo successfully deleted!'
      } else {
        return 'Delete unsuccessful! Todo not found!'
      }
    },

    updateTodo: function(todoId, title, month, year, description, completed) {
      var todo = todos.filter(function(todo) {
        return todo.id === todoId;
      })[0];

      if (todo) {
        todo.title = title || todo.title;
        todo.month = month || todo.month;
        todo.year = year || todo.year;
        todo.description = description || todo.description;
        todo.completed = completed || todo.completed;
        return 'Todo successfully updated!';
      } else {
        return 'Update unsuccessful! Todo not found!';
      }
    },

    findTodo: function(todoId) {
      if (todoId === undefined) {return 'Please enter an ID';}

      var todo = todos.filter(function(todo) {
        return todo.id === todoId;
      })[0];

      if (todo) {
        return cloneTodo(todo);
      } else {
        return 'Todo not found!';
      }
    },
  };
})();

//TODOMANAGER

function todoManager(todoList) {
  return {
    allTodos: function() {
      return todoList.allTodos()
    },

    completedTodos: function() {
      return todoList.allTodos().filter(function(todo) {
        return todo.completed;
      });
    },

    todosWithinMonthYear: function(month, year) {
      return todoList.allTodos().filter(function(todo) {
        return todo.isWithinMonthYear(month, year);
      });
    },

    completedTodosWithinMonthYear: function(month, year) {
      return todoList.allTodos().filter(function(todo) {
        return todo.isWithinMonthYear(month, year) && todo.completed;
      });
    },
  };
}

//TESTS

var todoData1 = {
  title: 'Buy Milk',
  month: '1',
  year: '2017',
  description: 'Milk for baby',
};

var todoData2 = {
  title: 'Buy Apples',
  month: '',
  year: '2017',
  description: 'An apple a day keeps the doctor away',
};

var todoData3 = {
  title: 'Buy chocolate',
  month: '1',
  year: '',
  description: 'For the cheat day',
};

var todoData4 = {
  title: 'Buy Veggies',
  month: '',
  year: '',
  description: 'For the daily fiber needs',
};

var invalidTodoData = {
  title: '',
  month: '',
  year: '',
  description: 'No title',
};

var todoSet = [todoData1, todoData2, todoData3, todoData4, invalidTodoData];

//Initialize todoList with todoSet
todoList.init(todoSet);

//invalidTodoData not added
console.log(todoManager(todoList).allTodos());
console.log('==========================================')

//Find Todos
console.log(todoList.findTodo(1));
console.log(todoList.findTodo(4));
console.log('==========================================')

//Update Todos
console.log(todoList.updateTodo(2, 'Eat Apples', '5', '2018', 'Good Vitamins', true));
console.log(todoList.findTodo(2));
console.log('==========================================')

//Delete Todos
console.log(todoList.deleteTodo(3));
console.log(todoManager(todoList).allTodos());
console.log('==========================================')

//Add & Update Todo
var todoData5 = {
  title: 'Finish Assessment',
  month: '',
  year: '',
  description: 'Submit within 24 hours',
};

console.log(todoList.addTodo(todoData5));
console.log(todoList.findTodo(5));
console.log(todoList.updateTodo(5, '', '', '', 'Submitted successfully', true));
console.log(todoList.findTodo(5));
console.log('==========================================')

//All Todos
console.log(todoManager(todoList).allTodos());
console.log('==========================================')

//All Completed Todos
console.log(todoManager(todoList).completedTodos());
console.log('==========================================')

//Query TodoList Within Date
console.log('Within 12/2000')
console.log(todoManager(todoList).todosWithinMonthYear('12', '2000'));
console.log('Within 5/2018')
console.log(todoManager(todoList).todosWithinMonthYear('5', '2018'));
console.log('Within 12/2020')
console.log(todoManager(todoList).todosWithinMonthYear('12', '2020'));
console.log('==========================================')

//Query TodoList Within Date & Completed
console.log('Within 12/2000')
console.log(todoManager(todoList).completedTodosWithinMonthYear('12', '2000'));
console.log('Within 5/2018')
console.log(todoManager(todoList).completedTodosWithinMonthYear('5', '2018'));
console.log('Within 12/2020')
console.log(todoManager(todoList).completedTodosWithinMonthYear('12', '2020'));
console.log('==========================================')

//Todo Not Found
console.log(todoList.findTodo(6));
console.log(todoList.deleteTodo(6));
console.log(todoList.updateTodo(6, 'Buy iPad', '10', '2019', 'iPad for baby'));
console.log('==========================================')

//Invalid Todo
var invalidTodo1 = {
  title: '',
  month: '2',
  year: '2015',
  description: 'Missing Title',
};

var invalidTodo2 = {
  title: 'Invalid Todo',
  nickname: 'Fail',
  month: '2',
  year: '2015',
  description: 'Extra Properties',
};

console.log(todoList.addTodo(invalidTodo1));
console.log(todoList.addTodo(invalidTodo2));
console.log('==========================================')

//Copy of Todos Returned
var todo4Copy = todoList.findTodo(4);
todo4Copy.title = 'I am a copy of Todo4';
console.log(todo4Copy);
console.log(todoList.findTodo(4));
console.log('==========================================')

//Copy of Todos List Returned
var completedList = todoManager(todoList).completedTodos();
completedList.forEach(function(todo) {
  todo.completed = false;
});

console.log(completedList);
console.log(todoManager(todoList).completedTodos());
console.log('==========================================')

// ADDITIONAL TESTS FOR REVISION
//TodoList returns copy of all todos
var todoListCopy = todoList.allTodos();
todoListCopy[0].id = 100;
console.log(todoListCopy[0].id);
console.log(todoList.allTodos()[0].id)
console.log('==========================================')

//TodoManager returns copy of all todos
var allTodosCopy = todoManager(todoList).allTodos();
allTodosCopy[0].title = 'this is a copy';
console.log(allTodosCopy[0].title);
console.log(todoManager(todoList).allTodos()[0].title);
console.log('==========================================')

//TodoManager returns copy of todos within date
var todoListCopy = todoManager(todoList).todosWithinMonthYear('5', '2018');
todoListCopy[0].month = '7';
console.log(todoListCopy[0].month);
console.log(todoManager(todoList).todosWithinMonthYear('5', '2018')[0].month);
console.log('==========================================')
//TodoManager returns copy of completed todos within date
var todoListCopy = todoManager(todoList).completedTodosWithinMonthYear('5', '2018');
todoListCopy[0].year = '3000';
console.log(todoListCopy[0].year);
console.log(todoManager(todoList).completedTodosWithinMonthYear('5', '2018')[0].year);
