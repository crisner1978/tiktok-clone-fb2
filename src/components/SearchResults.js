import { Link } from "react-router-dom";

export default function SearchResults({ results, query }) {
  if (!results || query.length === 0) return null

  return (
    <div className="search-results-container">
      <div className="search-result-title">
        {results.map(result => (
          <SearchResultItem key={result.uid} result={result} />
        ))}
        <div className="search-results-all-container">
          <p className="search-results-all">View all results for "{query}"</p>
        </div>
      </div>
    </div>
  );
}

function SearchResultItem({ result }) {
  return (
    <Link to={`/${result.username}`} className="search-result-item">
      <span className="search-result-item-avatar">
        <img src={result.photoURL} alt={result.username} />
      </span>
      <div className="search-result-item-content">
        <h4>{result.username}</h4>
        <p>{result.displayName}</p>
      </div>
    </Link>
  );
}
