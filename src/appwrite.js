import { ID, Query, Client, Databases } from "appwrite";

const database_id = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collection_id = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const project_id = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client();
client.setEndpoint("https://nyc.cloud.appwrite.io/v1");
client.setProject(project_id);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // 1. use appwrite SDK to check if the searchterm already exists in the database
  try {
    const result = await database.listDocuments(database_id, collection_id, [
      Query.equal("searchTerm", searchTerm)
    ]);

    // 2. if it does, update the count
    if(result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(database_id, collection_id, doc.$id, {
          count: doc.count + 1
      });
    } else {
      // 3. if it doesn't, create a new document with the searchterm and count as 1
      await database.createDocument(database_id, collection_id, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      });
    }
  } catch (error) {
    console.log(error);
  }
}