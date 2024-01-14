import { useState } from 'react';

export default function useFetch() {
  const [data, setData] = useState(undefined);
  const [fetching, setFetching] = useState(false);
  const [redir, setRedirect] = useState('');
  const [error, setError] = useState('');

  const request = async (path='', method='GET', body={}, content='application/json', link='') => {
    setFetching(true);
    setError('');
    const opt = {credentials: 'include'};
    if (method !== 'GET') {
      opt.method = method;
      if (content) { opt.headers = {'Content-Type': content}; }
      if (content === 'application/json') { opt.body = JSON.stringify(body); }
      else { opt.body = body; }
    }
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND + path, opt);
      if (!response.ok) { throw new Error(response.statusText); }
      if (response.status >= 200 && response.status < 300) {
        const json = await response.json();
        setData(json); 
      }
      setError('');
      setRedirect(link);
    } catch (e) { 
      console.log(`Request ${method} ${process.env.REACT_APP_BACKEND + path} | ${e}`);
      setError(String(e));
    } finally { setFetching(false); }
  };

  return {data, fetching, error, redir, request};
}
