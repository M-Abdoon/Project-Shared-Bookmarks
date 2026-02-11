import { createBookmark, getBookmarksSortedByDate, incrementLike } from "./state.js";
import { getUserIds } from "./storage.js";

const userDropdown = document.getElementById("user-dropdown");
const bookmarksContainer = document.getElementById("bookmarks-container");
const addBookmarkForm = document.getElementById("add-bookmark-form");

let defaultUserId = false;

function renderBookmarks(userId, bookmarks) {
    bookmarksContainer.innerHTML = "";

    if (!bookmarks || bookmarks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.innerText = "There are no bookmarks for this user.";
        bookmarksContainer.appendChild(emptyMessage);
        return;
    }
	
    bookmarks.forEach((bookmark, objectId) => {
        const li = document.createElement("li");

        const link = document.createElement("a");
        link.href = bookmark.url;
        link.innerText = bookmark.title;
        link.target = "_blank";
        li.appendChild(link);

        const description = document.createElement("p");
        description.innerText = bookmark.description;
        li.appendChild(description);

        const timestamp = document.createElement("small");
        const date = new Date(bookmark.createdAt);
        timestamp.innerText = `Created: ${date.toLocaleString()}`;
        li.appendChild(timestamp);

		const likesCounter = document.createElement("p");
		likesCounter.innerText = `Liked ${bookmark.likes} times`;
		
		likesCounter.addEventListener("click", () => {
			incrementLike(userId, objectId, bookmark.likes);
			likesCounter.innerText = `Liked ${bookmark.likes + 1} times`;
		});

		li.appendChild(likesCounter);

        bookmarksContainer.appendChild(li);

    });
}

function integrateDropDown() {
	const data = getUserIds();
	data.forEach(userId => {
		userDropdown.innerHTML += `<option value="${userId}">User ${userId}</option>`;
	});
}

integrateDropDown();


userDropdown.addEventListener("change", () => {
    defaultUserId = userDropdown.value;

    if (!defaultUserId) {
        bookmarksContainer.innerHTML = "<p>Select a user to view bookmarks.</p>";
        return false;
    }

    const bookmarks = getBookmarksSortedByDate(defaultUserId);
    renderBookmarks(defaultUserId, bookmarks);//userId should be passed for likes counter to work
});

addBookmarkForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const bookmarkUrlInput = document.getElementById("bookmark-url");
	const bookmarkTitleInput = document.getElementById("bookmark-title");
	const bookmarkDescriptionInput = document.getElementById("bookmark-description");

	if(!defaultUserId) {
		bookmarksContainer.innerHTML = "<p>Plese select a user to add a bookmark.</p>";
        return false;
	}
    const addBookmark = createBookmark(
        defaultUserId, 
        bookmarkUrlInput.value, 
        bookmarkTitleInput.value, 
        bookmarkDescriptionInput.value
    );

    if (!addBookmark) {
        alert("Book mark is not added, please make sure you entered valid inputs");
    } else {
		addBookmarkForm.reset();
		
		const bookmarks = getBookmarksSortedByDate(defaultUserId);
		renderBookmarks(defaultUserId, bookmarks);
		alert("Bookmark seccusfully added");
	}
});
