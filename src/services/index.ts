// ------------------------------------------------------------------- GET
export { readUserMe } from "./users/readUserMe";
export { readUserById } from "./users/readUserById";
export { readUsers } from "./users/readUsers";
export { readGames } from "./rental/readGames";
export { readGameById } from "./rental/readGameById";
export { readPlays } from "./rental/readPlays";
export { readPlayById } from "./rental/readPlayById";
export { readStudents } from "./rental/readStudents";
export { readStudentById } from "./rental/readStudentById";
export { readLogs } from "./rental/readLogs";
export { readSanctions } from "./rental/readSanctions";
export { readSanctionById } from "./rental/readSanctionById";
export { readImages } from "./rental/readImages";


// ------------------------------------------------------------------- POST
export { createUser } from "./users/createUser";
export { refreshToken } from "./token/refreshToken";
export { obtainToken } from "./token/obtainToken";
export { createGame } from "./rental/createGame";
export { endPlaysById } from "./rental/endPlaysById";
export { createPlay } from "./rental/createPlay";
export { createStudent } from "./rental/createStudent";
export { logInAccess } from "./logInAccess/logInAccess";
export { createSanction } from "./rental/createSanction";
export { createImage } from "./rental/createImage";


// ------------------------------------------------------------------- PUT
export { updateUserById } from "./users/updateUserById";
export { updateGameById } from "./rental/updateGameById";


// ------------------------------------------------------------------- PATCH
export { patchUserById } from "./users/patchUserById";
export { patchGameById } from "./rental/patchGameById";
export { patchPlayById } from "./rental/patchPlayById";
export { patchSanctionById } from "./rental/patchSanctionById";


// ------------------------------------------------------------------- DELETE
export { deleteGameById } from "./rental/deleteGameById";
export { deletePlayById } from "./rental/deletePlayById";
export { deleteStudentById } from "./rental/deleteStudentById";
export { deleteSanctionById } from "./rental/deleteSanctionById";


// ------------------------------------------------------------------- UTILS
export { changeIdToName } from "./rental/changeIdToName";
export { completeImageUrl } from "./rental/completeImageUrl";
export { findImageIdWithUrl } from "./rental/findImageIdWithUrl";
