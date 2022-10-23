import './App.css';
import { useState, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import {FaRegGrinBeamSweat} from 'react-icons/fa'

const AccessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const getKey = (pageIndex, previousPageData, query) => {
  if (!query) return null;
  if (previousPageData && previousPageData?.results?.length === 0) return null;
  return `https://api.unsplash.com/search/photos?client_id=${AccessKey}&page=${pageIndex+1}&query=${query}&per_page=20`
}

const fetcher = async (url) => {
  const res = await fetch(url);
  return res.json();
}

function App() {
  const [query, setQuery] = useState("")
  const onKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && event.target.value.trim().length > 0) {
      setQuery(event.target.value.trim());
    }
  }, [])
  
  const { data, error, setSize, isValidating } = useSWRInfinite((...args) => getKey(...args, query), fetcher, { revalidateFirstPage: false, revalidateOnFocus: false })
  
  const photos = data?.map(item => item.results).flat() ?? []
  const isEmpty = data?.[0].results?.length === 0;
  const isEnd = photos.length === data?.[0]?.total;
  const isLoading = (!data && !error && query) || isValidating


  console.log(data)
  return (
    <>
      <div className="input-container">
        <input type="text" placeholder="검색어를 입력해주세요" className="search-input" onKeyDown={onKeyDown}></input>
      </div>
      {
        isEmpty ? <div className='no-result'>
          <FaRegGrinBeamSweat className="no-result-icon" />
          No Images Found
        </div> : null
      }
      <div className="image-container">
        {data?.[0].results.map(({ urls, alt_description }, index) => (
          <img key={index} className="image" src={urls?.regular} alt={alt_description} />
       ))}
      </div>
    </>
  );
}

export default App;
