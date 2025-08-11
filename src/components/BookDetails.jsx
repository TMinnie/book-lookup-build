import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with your actual data source
    fetch(`https://gutendex.com/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!book) return <div>Loading...</div>;

  const subjects = book.subjects || [""];
  const bookshelves = book.bookshelves || [""];

  const plainTextKey = Object.keys(book.formats || {}).find((key) =>
    key.startsWith("text/plain")
  
  
  );

  return (

    <div className="px-4 py-6 text-left"> 
         <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-[#8E6E53] hover:text-[#7d6044] transition hover:-translate-y-0.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <div className="book-details mx-auto w-full max-w-6xl px-4 sm:px-8 py-10 flex flex-col md:flex-row gap-8">

      {/* Left Column: Cover + Subjects */}
      <div className="w-full md:w-1/4 flex flex-col items-center gap-6">
        <img
          src={book.formats?.["image/jpeg"] || "/default-cover.jpg"}
          alt={book.title}
          className=""
        />
        <div className="download-options ">

          <ul className="flex flex-wrap justify-center gap-3">
            {book.formats?.["application/epub+zip"] && (
              <li>
                <a
                  href={book.formats["application/epub+zip"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📘 Download ePub
                </a>
              </li>
            )}

            {book.formats?.["application/x-mobipocket-ebook"] && (
              <li>
                <a
                  href={book.formats["application/x-mobipocket-ebook"]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📗 Download Kindle (MOBI)
                </a>
              </li>
            )}

            {(book.formats?.["text/html; charset=utf-8"] ||
              book.formats?.["text/html"]) && (
              <li>
                <a
                  href={
                    book.formats["text/html; charset=utf-8"] ||
                    book.formats["text/html"]
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🌐 Read Online (HTML)
                </a>
              </li>
            )}

            {plainTextKey && (
              <li>
                <a
                  href={book.formats[plainTextKey]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Download Plain Text
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Right Column: Title + Info */}
      <div className="w-full md:w-3/4 space-y-6">

        <h2 className="">{book.title}</h2>
        <h3 className="">Author: {book.authors?.[0]?.name || "Unknown"} ({book.authors?.[0]?.birth_year ||'n/a'}-{book.authors?.[0]?.death_year||'n/a'})</h3>

        {subjects.length > 0 && (
          <div className="subjects">
            <ul className="">
              {subjects.map((subject, index) => (
                <li key={index}>{subject}</li>
              ))}
            </ul>
          </div>
        )}

        <hr className="border-t border-gray-300"/>

        <h3 className="font-semibold">Summary:</h3>

        {book.summaries?.length > 0 && (
          <p className="summary">{book.summaries[0]}</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default BookDetails;
