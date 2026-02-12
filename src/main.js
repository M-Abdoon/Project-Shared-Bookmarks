import { getBookmarksSortedByDate, incrementLike, createBookmark } from "./state.js";
import { getUserIds } from "./storage.js";

const userDropdown = document.getElementById("user-dropdown");
const addBookmarkForm = document.getElementById("add-bookmark-form");
const bookmarksContainer = document.getElementById("bookmarks-container");
const showBookmarkText = document.getElementById("showBookmarkText");
const bookmarkEmptyMessage = document.getElementById("bookmark-empty-message");
const notification = document.getElementById("notification");

let currentUserId = "";

integrateDropDown();

function showNotification(message, isError = false) {
    notification.innerText = message;
    notification.style.color = isError ? "red" : "green";
    notification.style.display = "block";
    notification.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

function integrateDropDown() {
    userDropdown.innerHTML = '<option value="">--Select a user--</option>';
    getUserIds().forEach(userId => {
        const option = document.createElement("option");
        option.value = userId;
        option.innerText = `User ${userId}`;
        userDropdown.appendChild(option);
    });
}

function renderBookmarks(userId, bookmarks) {
    bookmarksContainer.innerHTML = "";

    if (!bookmarks || bookmarks.length === 0) {
        bookmarkEmptyMessage.innerText = "There are no bookmarks for this user.";
        bookmarkEmptyMessage.style.display = "block";
		showBookmarkText.style.display = "none";
        return;
    }

    bookmarkEmptyMessage.style.display = "none";
	showBookmarkText.style.display = "block";

    bookmarks.forEach(bookmark => {
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
        timestamp.innerText = `Created: ${new Date(bookmark.createdAt).toLocaleString()}`;
        li.appendChild(timestamp);

        const likeWrapper = document.createElement("div");
        const likesCounter = document.createElement("span");
        likesCounter.innerText = `Liked ${bookmark.likes} times`;

        const likeButton = document.createElement("button");
        likeButton.innerText = "Like";
        likeButton.addEventListener("click", () => {
            incrementLike(userId, bookmark.createdAt, bookmark.likes);
            const updatedBookmarks = getBookmarksSortedByDate(userId);
            renderBookmarks(userId, updatedBookmarks);
        });

        likeWrapper.appendChild(likeButton);
        likeWrapper.appendChild(likesCounter);
        li.appendChild(likeWrapper);

        const copyButton = document.createElement("button");
        copyButton.innerText = "Copy URL";
        copyButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(bookmark.url);
                showNotification("URL copied to clipboard!");
            } catch {
                showNotification("Failed to copy URL.", true);
            }
        });
        li.appendChild(copyButton);

        bookmarksContainer.appendChild(li);
    });
}

userDropdown.addEventListener("change", () => {
    const userId = userDropdown.value;
    currentUserId = userId;

    bookmarkEmptyMessage.style.display = "none";

    if (!userId) {
        showNotification("Select a user to view bookmarks.", true);
        bookmarksContainer.innerHTML = "";
		showBookmarkText.style.display = "none";
        return;
    }

    const bookmarks = getBookmarksSortedByDate(userId);
    renderBookmarks(userId, bookmarks);
});

addBookmarkForm.addEventListener("submit", (e) => {
    e.preventDefault();
    currentUserId = userDropdown.value;
    if (!currentUserId) {
        showNotification("Please select a user before adding a bookmark!", true);
        return;
    }

    const url = document.getElementById("bookmark-url").value.trim();
    const title = document.getElementById("bookmark-title").value.trim();
    const description = document.getElementById("bookmark-description").value.trim();

    const bookmark = createBookmark(currentUserId, url, title, description);

    if (!bookmark) {
        showNotification("Bookmark not added. Please enter valid inputs.", true);
        return;
    }

    addBookmarkForm.reset();

    const bookmarks = getBookmarksSortedByDate(currentUserId);
    renderBookmarks(currentUserId, bookmarks);

    const newBookmarkElement = Array.from(bookmarksContainer.children).find(li =>
        li.querySelector("a").href === bookmark.url &&
        li.querySelector("a").innerText === bookmark.title
    );

    if (newBookmarkElement) {
        newBookmarkElement.scrollIntoView({ behavior: "smooth", block: "center" });
        showNotification("Bookmark added successfully!");
    }
});
