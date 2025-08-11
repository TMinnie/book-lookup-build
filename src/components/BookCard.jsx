import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const bookId = book.id; // or whatever unique ID field the book has

  return (
    <Link to={`/book/${bookId}`} className="book-card-link">
      <div className="book-card hover:shadow-lg transition-shadow">
        <img
          src={book.formats?.["image/jpeg"] || '/default-cover.jpg'}
          alt={book.title}
        />
        <h3>{book.title}</h3>
        <p className="content">
          {book.authors?.[0]?.name || 'Unknown Author'}
        </p>
      </div>
    </Link>
  );
};

export default BookCard;
