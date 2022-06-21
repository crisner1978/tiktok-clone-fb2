import ClearIcon from "icons/ClearIcon";
import SearchIcon from "icons/SearchIcon";
import SmallLoadingIcon from "icons/SmallLoadingIcon";
import db from "lib/firebase";
import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchResults from "./SearchResults";

export default function SearchBar() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    setResults([]);
    setQuery('');
  }, [location.pathname]);

  useEffect(() => {
    const searchUsers = debounce(async () => {
      try {
        setLoading(true);
        let usersRef = db
          .collection("users")
          .where("username", ">=", `@${query.toLowerCase()}`)
          .where("username", "<", `@${query.toLowerCase()}\uf8ff`)
          .limit(4);

        const result = await usersRef.orderBy("username").get();
        const results = result.docs.map((doc) => doc.data());
        setResults(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500)

    if (query.trim().length > 0) {
      searchUsers();
    }
  }, [query]);

  function clearInput() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="searchbar-container">
      <form className="searchbar-form">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          placeholder="Search accounts"
          type="text"
          className="searchbar-input"
        />
        <div>
          {query && !isLoading && <ClearIcon onClick={clearInput} />}
          {isLoading && <SmallLoadingIcon />}
        </div>
        <span className="searchbar-border"></span>
        <button className="searchbar-icon">
          <SearchIcon />
        </button>
      </form>
      <SearchResults results={results} query={query} />
    </div>
  );
}
