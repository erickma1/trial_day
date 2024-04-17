import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [filterBy, setFilterBy] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users', {
          params: {
            page: currentPage,
            pageSize,
            sortBy,
            filterBy,
          },
        });
        setData(response.data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentPage, pageSize, sortBy, filterBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortBy((prevSortBy) => (prevSortBy.startsWith('-') ? prevSortBy.substring(1) : `-${prevSortBy}`));
    } else {
      setSortBy(field);
    }
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(filterBy.toLowerCase())
  );

  const sortedData = sortBy ? filteredData.sort((a, b) => {
    if (sortBy.startsWith('-')) {
     
      const sortByKey = sortBy.substring(1);
      if (a[sortByKey] < b[sortByKey]) return 1;
      if (a[sortByKey] > b[sortByKey]) return -1;
      return 0;
    } else {
    
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    }
  }) : filteredData;

  const pageCount = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('name')}>Name</th>
            <th onClick={() => handleSortChange('username')}>Username</th>
            <th onClick={() => handleSortChange('email')}>Email</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.username}</td>
              <td>{item.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input
          type="text"
          placeholder="Filter..."
          value={filterBy}
          onChange={(e) => handleFilterChange(e.target.value)}
        />
      </div>
      <div>
        {Array.from({ length: pageCount }).map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
