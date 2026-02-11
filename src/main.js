import { getBookmarksSortedByDate, incrementLike } from "./state.js";
import { getUserIds } from "./storage.js";

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

        const likeWrapper = document.createElement("div");

        const likesCounter = document.createElement("span");
        likesCounter.innerText = `Liked ${bookmark.likes} times`;
        likesCounter.setAttribute("aria-live", "polite");

        const likeButton = document.createElement("button");
        likeButton.innerText = "Like";
        likeButton.setAttribute("aria-label", `Like bookmark titled ${bookmark.title}`);

        likeButton.addEventListener("click", () => {
            incrementLike(userId, objectId, bookmark.likes);
            bookmark.likes += 1;
            likesCounter.innerText = `Liked ${bookmark.likes} times`;
        });

        likeWrapper.appendChild(likeButton);
        likeWrapper.appendChild(likesCounter);
        li.appendChild(likeWrapper);

        const copyButton = document.createElement("button");
        copyButton.innerText = "Copy URL";
        copyButton.setAttribute("aria-label", `Copy URL for ${bookmark.title}`);

        copyButton.addEventListener("click", async () => {
            await navigator.clipboard.writeText(bookmark.url);
        });

        li.appendChild(copyButton);

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
    const userId = userDropdown.value;

    if (!userId) {
        bookmarksContainer.innerHTML = "<p>Select a user to view bookmarks.</p>";
        return;
    }

    const bookmarks = getBookmarksSortedByDate(userId);
    renderBookmarks(userId, bookmarks);
});
