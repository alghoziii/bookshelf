const UNCOMPLETED_BOOK_ID = "unread";
const COMPLETED_BOOK_ID = "read";
const BOOK_ITEMID = "itemId ";

if (localStorage.getItem("theme") == "tDark") setDarkMode();

function setDarkMode() {
  let iconDarkMode = "";
  let isdark = document.body.classList.toggle("dark");
  if (isdark) {
    iconDarkMode = '<h2><i class="fas fa-sun"></i></h2>';
    localStorage.setItem("theme", "tDark");
  } else {
    iconDarkMode = '<h2><i class="fas fa-moon"></i></h2>';
    localStorage.removeItem("theme");
  }
  document.getElementById("darkBtn").innerHTML = iconDarkMode;
}

const TambahBook = () => {
  const uncompletedBook = document.getElementById(UNCOMPLETED_BOOK_ID);
  const inputTitle = document.getElementById("title").value;
  const inputAuthor = document.getElementById("author").value;
  const inputYear = document.getElementById("year").value;

  const book = BuatBook(inputTitle, inputAuthor, inputYear, false);
  const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, false);

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  uncompletedBook.append(book);
  updateDataToStorage();
};

const BuatBook = (title, author, year, isCompleted) => {
  const bookTitle = document.createElement("h2");
  bookTitle.innerText = title;

  const authorName = document.createElement("p");
  authorName.innerText = author;

  const bookYear = document.createElement("small");
  bookYear.innerText = `${year}`;

  const detail = document.createElement("div");
  detail.classList.add("detail-book");
  detail.append(bookTitle, authorName, bookYear);

  const container = document.createElement("div");
  container.classList.add("my-container");
  container.append(detail);

  if (isCompleted) {
    container.append(createUnreadButton(), createTrashButton());
  } else {
    container.append(createReadButton(), createTrashButton());
  }
  return container;
};
const buatButton = (buttonTypeClass, eventListener) => {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);

  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
};
const createReadButton = () => {
  return buatButton("check-button", function (event) {
    addBookToCompleted(event.target.parentElement);
  });
};
const addBookToCompleted = (bookElement) => {
  const bookCompleted = document.getElementById(COMPLETED_BOOK_ID);
  const bookTitle = bookElement.querySelector(".detail-book > h2").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;

  const BookBaru = BuatBook(bookTitle, bookAuthor, bookYear, true);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = true;
  BookBaru[BOOK_ITEMID] = book.id;

  bookCompleted.append(BookBaru);
  bookElement.remove();

  updateDataToStorage();
};

const removeBookFromCompleted = (bookElement) => {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);
  bookElement.remove();
  updateDataToStorage();
};

const createTrashButton = () => {
  return buatButton("trash-button", function (event) {
    removeBookFromCompleted(event.target.parentElement);
  });
};

const undoBookFromCompleted = (bookElement) => {
  const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);
  const bookTitle = bookElement.querySelector(".detail-book > h2").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;

  const BookBaru = BuatBook(bookTitle, bookAuthor, bookYear, false);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = false;
  BookBaru[BOOK_ITEMID] = book.id;

  listUncompleted.append(BookBaru);
  bookElement.remove();
  updateDataToStorage();
};

const createUnreadButton = () => {
  return buatButton("undo-button", function (event) {
    undoBookFromCompleted(event.target.parentElement);
  });
};
