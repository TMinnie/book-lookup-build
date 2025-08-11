import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, book) => {
  try {
    // 1. Check if searchTerm already exists
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('searchTerm', searchTerm)]
    );

    if (result.documents.length > 0) {
      // 2. If found, increment count
      const doc = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id,
        { count: doc.count + 1 }
      );

    } else {
      // 3. If not found, create new entry
      await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          book_id: book?.id,
          image_url: book.formats?.["image/jpeg"],
        }
      );
    }

  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getTrendingBooks = async() => {
    try {

        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ])

        return result.documents;

    } catch{

        

    }
}
