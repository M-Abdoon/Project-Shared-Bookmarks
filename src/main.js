import { getBookmarksSortedByDate, incrementLike, createBookmark } from "./state.js";
import { getUserIds } from "./storage.js";

const userDropdown = document.getElementById("user-dropdown");
const addBookmarkForm = document.getElementById("add-bookmark-form");
const bookmarksContainer = document.getElementById("bookmarks-container");
const userEmptyMessage = document.getElementById("user-empty-message");
const bookmarkEmptyMessage = document.getElementById("bookmark-empty-message");

let currentUserId = "";

const notification = document.createElement("p");
notification.setAttribute("role", "status");
notification.setAttribute("aria-live", "polite");
notification.style.display = "none";
notification.style.color = "green";
notification.style.fontWeight = "bold";
notification.style.marginBottom = "1rem";
bookmarksContainer.parentNode.insertBefore(notification, bookmarksContainer);

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
        return;
    }

    bookmarkEmptyMessage.style.display = "none";

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

function showNotification(message, isError = false) {
    notification.innerText = message;
    notification.style.color = isError ? "red" : "green";
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

integrateDropDown();

userDropdown.addEventListener("change", () => {
    const userId = userDropdown.value;
    currentUserId = userId;

    userEmptyMessage.style.display = "none";
    bookmarkEmptyMessage.style.display = "none";

    if (!userId) {
        userEmptyMessage.innerText = "Select a user to view bookmarks.";
        userEmptyMessage.style.display = "block";
        bookmarksContainer.innerHTML = "";
        return;
    }

    const bookmarks = getBookmarksSortedByDate(userId);
    renderBookmarks(userId, bookmarks);
});

addBookmarkForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentUserId) {
        userEmptyMessage.innerText = "Please select a user to add a bookmark.";
        userEmptyMessage.style.display = "block";
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
