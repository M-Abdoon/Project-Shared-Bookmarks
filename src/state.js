import { getData, setData } from "./storage.js";

export function createBookmark( userId, url, title, description ) {
	if( !title || !url || !description )
		return false;

	if(	typeof url !== "string" || 
		typeof title !== "string" ||
		typeof description !== "string"
	)
		return false;

	let getUserBookmark = getData(userId) ?? [];
	
	const newEntryJson = { 
		url: url, 
		title: title, 
		description: description,
		createdAt: Date.now(),
		likes: 0
	};

	getUserBookmark.push(newEntryJson);

	setData(userId, getUserBookmark);
	return newEntryJson;
}

export function getBookmarksSortedByDate(userId){
	const data = getData(userId) ?? [];
	data.sort((a, b) => b.createdAt - a.createdAt);
	return data;
}

export function incrementLike(id){} // returns: void (nothing)
export function setCurrentUser(userId){} // returns: void (nothing)