import { getBookmarksSortedByDate, incrementLike } from "./state.js";

const userDropdown = document.getElementById("user-dropdown");
const bookmarksContainer = document.getElementById("bookmarks-container");

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

userDropdown.addEventListener("change", () => {
    const userId = userDropdown.value;

    if (!userId) {
        bookmarksContainer.innerHTML = "<p>Select a user to view bookmarks.</p>";
        return;
    }

    const bookmarks = getBookmarksSortedByDate(userId);
    renderBookmarks(userId, bookmarks);//userId should be passed for likes counter to work
});
