document.addEventListener("DOMContentLoaded", function () {
    const inputBookTitle = document.getElementById("inputBookTitle");
    const inputBookAuthor = document.getElementById("inputBookAuthor");
    const inputBookYear = document.getElementById("inputBookYear");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
    const bookSubmit = document.getElementById("bookSubmit");
    const searchBookTitle = document.getElementById("searchBookTitle");
    const searchSubmit = document.getElementById("searchSubmit");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const linkcss = document.getElementById("mycss");
    const toogle = document.getElementById("toogle");
    const toogle1 = document.getElementById("toogle-1");
    const checkbox = document.getElementById("cb");
    const idbook = document.getElementById("id-books");
    idbook.value = +new Date;

    toogle.addEventListener("click", function () {
        linkcss.href = "styledark.css";
    });

    toogle1.addEventListener("click", function () {
        linkcss.href = "style.css";
    });

    let isEditing = false;
    let bookToEdit = null;

    bookSubmit.addEventListener("click", function (e) {
        e.preventDefault();
        if (isEditing) {
            updateBook(bookToEdit.id);
        } else {
            addBook();
        }
    });

    searchSubmit.addEventListener("click", function (e) {
        e.preventDefault();
        searchBook();
    });

    function addBook() {
        const id = idbook.value;
        const title = inputBookTitle.value;
        const author = inputBookAuthor.value;
        const year = inputBookYear.value;
        const isComplete = inputBookIsComplete.checked;

        const book = {
            id,
            title,
            author,
            year,
            isComplete
        };

        let bookshelfList;
        if (isComplete) {
            bookshelfList = completeBookshelfList;
        } else {
            bookshelfList = incompleteBookshelfList;
        }

        const bookItem = createBookItem(book);
        bookshelfList.appendChild(bookItem);

        updateDataToStorage();
        clearForm();
    }

    function createBookItem(book) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.setAttribute("data-id", book.id);

        const h3 = document.createElement("h3");
        h3.innerText = book.title;

        const authorP = document.createElement("p");
        authorP.innerText = `Penulis: ${book.author}`;

        const yearP = document.createElement("p");
        yearP.innerText = `Tahun: ${book.year}`;

        const actionDiv = document.createElement("div");
        actionDiv.classList.add("action");

        const actionButton = document.createElement("button");
        const iconsmph = document.createElement("i");
        iconsmph.classList.add("bi-trash3-fill");
        actionButton.appendChild(iconsmph);
        actionButton.classList.add("red");
        actionButton.style.padding = "10px";
        actionButton.style.marginLeft = "10px";

        const editbutton = document.createElement("button");
        const iconsgreenbtn = document.createElement("i");
        iconsgreenbtn.classList.add("bi-pen-fill");
        editbutton.appendChild(iconsgreenbtn);
        editbutton.style.color = "white";
        editbutton.style.backgroundColor = "#333";
        editbutton.style.padding = "10px";
        editbutton.style.marginLeft = "10px";
        

        editbutton.addEventListener("click", function () {
            editBook(book);
        });

        actionButton.addEventListener("click", function () {
            removeBook(bookItem);
        });

        actionDiv.appendChild(actionButton);
        actionDiv.appendChild(editbutton);
        bookItem.appendChild(h3);
        bookItem.appendChild(authorP);
        bookItem.appendChild(yearP);
        bookItem.appendChild(actionDiv);

        if (book.isComplete) {
            const moveButton = document.createElement("button");
            const movebtnicons = document.createElement("i");
            movebtnicons.classList.add("bi-bookmark-x-fill");
            moveButton.appendChild(movebtnicons);
            moveButton.classList.add("green");
            moveButton.style.backgroundColor = "darkgoldenrod";
            moveButton.style.padding = "10px";

            moveButton.addEventListener("click", function () {
                moveToIncomplete(bookItem);
            });

            actionDiv.insertBefore(moveButton, actionButton);
        } else {
            const moveButton = document.createElement("button");
            const movebtnicons =document.createElement("i");
            movebtnicons.classList.add("bi-bookmark-check-fill");
            moveButton.appendChild(movebtnicons);
            moveButton.classList.add("green");
            moveButton.style.padding = "10px";

            moveButton.addEventListener("click", function () {
                moveToComplete(bookItem);
            });

            actionDiv.insertBefore(moveButton, actionButton);
        }

        return bookItem;
    }

    function editBook(book) {
        isEditing = true;
        bookToEdit = book;
        inputBookTitle.value = book.title;
        inputBookAuthor.value = book.author;
        inputBookYear.value = book.year;
        inputBookIsComplete.checked = book.isComplete;
        bookSubmit.innerText = "Update Buku";
        cb.style.visibility = "hidden";

    }

    function updateBook(bookId) {
        bookToEdit.title = inputBookTitle.value;
        bookToEdit.author = inputBookAuthor.value;
        bookToEdit.year = inputBookYear.value;
        bookToEdit.isComplete = inputBookIsComplete.checked;

        const bookItem = document.querySelector(`[data-id="${bookId}"]`);
        const h3 = bookItem.querySelector("h3");
        h3.innerText = bookToEdit.title;
        const authorP = bookItem.querySelector("p");
        authorP.innerText = `Penulis: ${bookToEdit.author}`;
        const yearP = authorP.nextElementSibling;
        yearP.innerText = `Tahun: ${bookToEdit.year}`;

        clearForm();
        bookSubmit.innerText = "Masukkan Buku ke Rak";
        cb.style.visibility = "visible";
        isEditing = false;
        bookToEdit = null;

        updateDataToStorage();
    }

    function removeBook(bookItem) {
        if (confirm("Yakin ingin menghapus buku ini?")) {
            bookItem.parentElement.removeChild(bookItem);
            updateDataToStorage();
        }
    }

    function moveToComplete(bookItem) {
        const book = {
            id: bookItem.getAttribute("data-id"),
            title: bookItem.querySelector("h3").innerText,
            author: bookItem.querySelector("p").innerText.replace("Penulis: ", ""),
            year: bookItem.querySelector("p").nextElementSibling.innerText.replace("Tahun: ", ""),
            isComplete: true
        };

        const completeList = completeBookshelfList;
        const newBookItem = createBookItem(book);
        completeList.appendChild(newBookItem);
        bookItem.parentElement.removeChild(bookItem);

        updateDataToStorage();
    }

    function moveToIncomplete(bookItem) {
        const book = {
            id: bookItem.getAttribute("data-id"),
            title: bookItem.querySelector("h3").innerText,
            author: bookItem.querySelector("p").innerText.replace("Penulis: ", ""),
            year: bookItem.querySelector("p").nextElementSibling.innerText.replace("Tahun: ", ""),
            isComplete: false
        };

        const incompleteList = incompleteBookshelfList;
        const newBookItem = createBookItem(book);
        incompleteList.appendChild(newBookItem);
        bookItem.parentElement.removeChild(bookItem);

        updateDataToStorage();
    }

    function searchBook() {
        const query = searchBookTitle.value.toLowerCase();

        const bookItems = document.querySelectorAll(".book_item");

        bookItems.forEach(function (bookItem) {
            const title = bookItem.querySelector("h3").innerText.toLowerCase();
            if (title.indexOf(query) !== -1) {
                bookItem.style.display = "block";
            } else {
                bookItem.style.display = "none";
            }
        });
    }

    function clearForm() {
        inputBookTitle.value = "";
        inputBookAuthor.value = "";
        inputBookYear.value = "";
        inputBookIsComplete.checked = false;
    }

    function updateDataToStorage() {
        const completeBooks = [];
        const incompleteBooks = [];

        const bookItems = document.querySelectorAll(".book_item");

        bookItems.forEach(function (bookItem) {
            const book = {
                id: bookItem.getAttribute("data-id"),
                title: bookItem.querySelector("h3").innerText,
                author: bookItem.querySelector("p").innerText.replace("Penulis: ", ""),
                year: bookItem.querySelector("p").nextElementSibling.innerText.replace("Tahun: ", ""),
                isComplete: bookItem.querySelector(".green").innerText === "Selesai dibaca"
            };

            if (book.isComplete) {
                completeBooks.push(book);
            } else {
                incompleteBooks.push(book);
            }
        });

        localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
        localStorage.setItem("incompleteBooks", JSON.stringify(incompleteBooks));
    }

    function loadDataFromStorage() {
        let completeBooks = [];
        let incompleteBooks = [];

        if (localStorage.getItem("completeBooks")) {
            completeBooks = JSON.parse(localStorage.getItem("completeBooks"));
        }

        if (localStorage.getItem("incompleteBooks")) {
            incompleteBooks = JSON.parse(localStorage.getItem("incompleteBooks"));
        }

        for (const book of completeBooks) {
            const bookItem = createBookItem(book);
            completeBookshelfList.appendChild(bookItem);
        }

        for (const book of incompleteBooks) {
            const bookItem = createBookItem(book);
            incompleteBookshelfList.appendChild(bookItem);
        }
    }

    loadDataFromStorage();
});
