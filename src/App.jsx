import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use';

import './App.css'

import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx';
import BookCard from './components/BookCard.jsx';
import { getTrendingBooks, updateSearchCount } from './appwrite.js';

  const App = () => {

//Use States
    const[errorMessage, setErrorMessage] = useState('');
    const[bookList,setBookList]= useState([]);
    const[isLoading,setIsLoading]= useState(false);
    const[searchTerm, setSearchTerm] = useState('');
    const[debouncedSearchTerm,setDebouncedSearchTerm]= useState('');
    const[trendingBooks, setTrendingBooks]= useState([]);


//API details
    const API_BASE_URL = 'https://gutendex.com';

//Fetch Books Function
const fetchBooks = async (query='') => {

      setIsLoading(true);
      setErrorMessage('');

      try {

        const endpoint = query
        ? `${API_BASE_URL}/books/?search=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/books/?sort_by=popularity.desc`;
        
        const response = await fetch(endpoint);

        if (!response.ok){
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
          setErrorMessage('No books found.');
          setBookList([]);
          return;
        }

        setBookList(data.results || []);
        
        // Update search count if user searches for a book
         if (query && data.results.length>0){
          await updateSearchCount(query, data.results[0]);
        }
         
      } catch (error) {
        console.log(`Error fetching books: ${error}`);
        setErrorMessage(`Error fetching books. Please try again later.`)
      
      } finally {
        setIsLoading(false);
      
      }

    }
    
//Load Trending Book Function
const loadTrendingBooks = async() => {
      try{
        const books = await getTrendingBooks();
        setTrendingBooks(books);

      } catch(error){
        console.log(`Error fetching trending books: ${error}`);
      }
    }
    

// Debouncer - to not request until stopped > 1/2 second (Installed)
    useDebounce(()=> setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

// Calls the fetch books function when the searchTerm changes ([dependancy])
  
useEffect(() => {
  fetchBooks(debouncedSearchTerm); 
}, [debouncedSearchTerm]);

useEffect(() => {
      loadTrendingBooks();
    }, [])

//UI
    return(
      <main>
          <div className='pattern'/>
          <div className='wrapper'>
            <header>
              <img src='./hero.png' alt='Hero Banner'/>
              <h1>Find Your Next Favorite Book </h1>
              <h2><span className='text-gradient'>~ Download | Read | Repeat ~</span></h2>
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> 

            </header>

             {!searchTerm && trendingBooks.length>0 &&(
              <section className="trending">
  <h2>Trending Books</h2>
  <div className="relative">
    <ul className="scroll-container">
      {trendingBooks.map((book, index) => (
        <li key={book.$id}>
          <img src={book.image_url} alt={book.title} />
          <p>{index + 1}</p>
        </li>
      ))}
    </ul>

    {/* Left fade */}
    <div className="fade-left"></div>

    {/* Right fade */}
    <div className="fade-right"></div>
  </div>
</section>

            )}

            <section className='all-books'>
              {!searchTerm? (
              <h2 className='mt-[80px]'>All Books</h2> 
            ) : (
              <h2 className='mt-[80px]'>Search results for: {searchTerm} </h2>
            )
            }

               {isLoading ?(
                <Spinner/>
              ) : errorMessage ? (
                <p className='text-red-500'>{errorMessage}</p>
              ) : (
                
                <ul>
                  {bookList.map((book) => (
                    <BookCard key ={book.id} book={book}/>

                  ))}
                </ul>           
              )}
         
            </section>
                  
          </div>
      </main>
    )
  }

export default App
