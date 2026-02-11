const bookmarksContainer = document.getElementById("bookmarks-container");
const bookmarkEmptyMessage = document.getElementById("bookmark-empty-message");
const userEmptyMessage = document.getElementById("user-empty-message");

export function showUserEmptyMessage(message) {
    userEmptyMessage.innerText = message;
    userEmptyMessage.style.display = message ? "block" : "none";
}

export function showBookmarkEmptyMessage(message) {
    bookmarkEmptyMessage.innerText = message;
    bookmarkEmptyMessage.style.display = message ? "block" : "none";
}

export function renderBookmarks(userId, bookmarks, incrementLikeCallback) {
    bookmarksContainer.innerHTML = "";

    if (!bookmarks || bookmarks.length === 0) {
        showBookmarkEmptyMessage("There are no bookmarks for this user.");
        return;
    }

    showBookmarkEmptyMessage("");

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
        timestamp.innerText = `Created: ${new Date(bookmark.createdAt).toLocaleString()}`;
        li.appendChild(timestamp);

        const likeWrapper = document.createElement("div");

        const likesCounter = document.createElement("span");
        likesCounter.innerText = `Liked ${bookmark.likes} times`;
        likesCounter.setAttribute("aria-live", "polite");

        const likeButton = document.createElement("button");
        likeButton.innerText = "Like";
        likeButton.setAttribute("aria-label", `Like bookmark titled ${bookmark.title}`);
        likeButton.addEventListener("click", () => {
            incrementLikeCallback(userId, objectId, bookmark.likes);
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
