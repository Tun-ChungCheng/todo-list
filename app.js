/* jQuery version */
$(document).ready(() => {
  /**
   *
   * @param null
   * @return void
   */
  function init() {
    const localStorageData = JSON.parse(localStorage.getItem("list"));
    localStorageData.forEach((item) => {
      createTodo(item.todoText, item.todoMonth, item.todoDate);
    });
  }

  /**
   * @param todoText
   * @param todoMonth
   * @param todoDate
   * @return void
   */
  function createTodo(todoText, todoMonth, todoDate) {
    $("section").append(
      '<div class="todo animate__bounceIn">' +
        '<p class="todo-text">' +
        todoText +
        "</p>" +
        '<p class="todo-time">' +
        todoMonth +
        "/" +
        todoDate +
        "</p>" +
        // create red check and green trash can
        '<button class="complete">' +
        '<i class="fa-solid fa-circle-check"></i>' +
        "</button>" +
        '<button class="trash">' +
        '<i class="fa-solid fa-trash-can"></i>' +
        "</button>" +
        "</div>"
    );

    $(".complete").click((e) => {
      const todoItem = $(e.target).parent();
      //   todoItem.toggleClass("done");
      todoItem.addClass("done");
    });

    $(".trash").click((e) => {
      const todoItem = e.target.parentElement;
      const target = todoItem.children[0].innerText;
      $(todoItem).addClass("animate__bounceOut");
      todoItem.addEventListener("animationend", () => {
        todoItem.remove();
      });

      // remove data from local storage
      const localStorageData = JSON.parse(localStorage.getItem("list"));
      localStorageData.forEach((item, index) => {
        if (item.todoText == target) {
          localStorageData.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(localStorageData));
        }
      });
    });
  }

  /**
   * @param todoText
   * @param todoMonth
   * @param todoDate
   * @return void
   */
  function storeTodo(todoText, todoMonth, todoDate) {
    //create an object
    const newData = {
      todoText: todoText,
      todoMonth: todoMonth,
      todoDate: todoDate,
    };

    // store data into an array if objects exist
    const localStorageData = JSON.parse(localStorage.getItem("list"));
    if (localStorageData === null) {
      localStorage.setItem("list", JSON.stringify([newData]));
    } else {
      localStorageData.push(newData);
      localStorage.setItem("list", JSON.stringify(localStorageData));
    }
  }

  /**
   * @param A left array
   * @param B right array
   * @return result is a merged array
   */
  function mergeTime(A, B) {
    let leftIdx = 0;
    let rightIdx = 0;
    let result = [];
    while (A.length > leftIdx && B.length > rightIdx) {
      if (A[leftIdx].todoMonth > B[rightIdx].todoMonth) {
        result.push(B[rightIdx]);
        rightIdx += 1;
      } else if (A[leftIdx].todoMonth < B[rightIdx].todoMonth) {
        result.push(A[leftIdx]);
        leftIdx += 1;
      } else {
        if (A[leftIdx].todoDate > B[rightIdx].todoDate) {
          result.push(B[rightIdx]);
          rightIdx += 1;
        } else {
          result.push(A[leftIdx]);
          leftIdx += 1;
        }
      }
    }
    while (A.length > leftIdx) {
      result.push(A[leftIdx]);
      leftIdx += 1;
    }
    while (B.length > rightIdx) {
      result.push(B[rightIdx]);
      rightIdx += 1;
    }
    return result;
  }

  /**
   * @param arr an unsored array for divide
   * @return arr: divide done
   * @return mergeTime(A, B): recursion function for conquer
   */
  function mergeSort(arr) {
    if (arr.length === 1) return arr;
    let midIdx = Math.floor(arr.length / 2);
    let leftArr = arr.slice(0, midIdx);
    let rightArr = arr.slice(midIdx);
    return mergeTime(mergeSort(leftArr), mergeSort(rightArr));
  }

  /**
   *
   * @param e means event
   * @return void
   */
  $("form button").click((e) => {
    // prevent form from being submitted
    e.preventDefault();

    //get the input value
    const form = $(e.target).parent();
    const todoText = $(form).children().first().val();
    const datePicker = $(form).children().eq(1).val();
    const todoMonth = datePicker.split("-")[1];
    const todoDate = datePicker.split("-")[2];
    if (todoText === "") {
      alert("Please Enter some Text.");
      return;
    }
    createTodo(todoText, todoMonth, todoDate);
    storeTodo(todoText, todoMonth, todoDate);

    // set value to null
    $(form).children().first().val(null);
    $(form).children().eq(1).val("2022-01-01");
  });

  /**
   *
   * @param e means event
   * @return void
   */
  $(".sort").click((e) => {
    // sort data
    const localStorageData = JSON.parse(localStorage.getItem("list"));

    // type casting to decimal int
    localStorageData.map((item) => {
      item.todoMonth = parseInt(item.todoMonth, 10);
      item.todoDate = parseInt(item.todoDate, 10);
    });
    const sortedArray = mergeSort(localStorageData);
    localStorage.setItem("list", JSON.stringify(sortedArray));

    // remove Todo
    $("section").children().remove();

    // load Todo
    init();
  });

  /* Enter Point */
  init();
});

/* Without jQuery & localStorage & sort version */
/*
const section = document.querySelector("section");
const add = document.querySelector("form button");

add.addEventListener("click", (e) => {
  // prevent form from being submitted
  e.preventDefault();

  //get the input value
  const form = e.target.parentElement;
  const todoText = form.children[0].value;
  const todoMonth = form.children[1].value;
  const todoDate = form.children[2].value;

  if (todoText === "") {
    alert("Please Enter some Text.");
    return;
  }

  // create a todo
  const todo = document.createElement("div");
  todo.classList.add("todo");
  const text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  const time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + "/" + todoDate;
  todo.append(text);
  todo.append(time);

  // create green check and red trash can
  const completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
  completeButton.addEventListener("click", (e) => {
    const todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });
  const trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  trashButton.addEventListener("click", (e) => {
    const todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      todoItem.remove();
    });
    todoItem.classList.add("animate__bounceOut");
  });
  todo.append(completeButton);
  todo.append(trashButton);
  todo.classList.add("animate__bounceIn");
  for (let i = 0; i < form.children.length; i++) {
    form.children[i].value = ""; // CLEAR THE TEXT INPUT
  }

  section.appendChild(todo);
});
*/
