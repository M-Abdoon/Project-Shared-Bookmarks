import { getBookmarksSortedByDate, incrementLike, createBookmark } from "./state.js";
import { getUserIds } from "./storage.js";
import { renderBookmarks, showUserEmptyMessage, showBookmarkEmptyMessage } from "./ui.js";

const userDropdown = document.getElementById("user-dropdown");
const addBookmarkForm = document.getElementById("add-bookmark-form");

let currentUserId = "";

function integrateDropDown() {
    const data = getUserIds();
    data.forEach(userId => {
        userDropdown.innerHTML += `<option value="${userId}">User ${userId}</option>`;
    });
}
integrateDropDown();

userDropdown.addEventListener("change", () => {
    const userId = userDropdown.value;
    currentUserId = userId;

    showUserEmptyMessage("");
    showBookmarkEmptyMessage("");

    if (!userId) {
        showUserEmptyMessage("Select a user to view bookmarks.");
        return;
    }

    const bookmarks = getBookmarksSortedByDate(userId);
    renderBookmarks(userId, bookmarks, incrementLike);
});

addBookmarkForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentUserId) {
        showUserEmptyMessage("Please select a user to add a bookmark.");
        return;
    }

    const url = document.getElementById("bookmark-url").value;
    const title = document.getElementById("bookmark-title").value;
    const description = document.getElementById("bookmark-description").value;

    const bookmark = createBookmark(currentUserId, url, title, description);

    if (!bookmark) {
        alert("Bookmark is not added. Please make sure you entered valid inputs.");
        return;
    }

    addBookmarkForm.reset();

    const bookmarks = getBookmarksSortedByDate(currentUserId);
    renderBookmarks(currentUserId, bookmarks, incrementLike);
});
