import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';

import { HomeUrl, ServerUrl } from '@/lib/utils';
import { useAuth } from './platform-user-context';

interface WordpressContextProps {

}

//  const WordpressContext = createContext<WordpressContextProps | undefined>(undefined);
const WordpressContext = createContext<any>(undefined);

const WordpressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { completeUser } = useAuth();

  const [posts, setPosts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);

  useEffect(() => {

    if (completeUser) {

      const fetchPosts = async () => {
        const response = await axios.get(`${ServerUrl}/wordpress/posts?userId=${completeUser._id}`);
        console.log("posts",response.data)
        setPosts(response.data);
      };

      const fetchCategories = async () => {
        const response = await axios.get(`${ServerUrl}/wordpress/categories?userId=${completeUser._id}`);
        console.log("categories",response.data)
        setCategories(response.data);
      };

      const fetchTags = async () => {
        const response = await axios.get(`${ServerUrl}/wordpress/tags?userId=${completeUser._id}`);
        console.log("tags",response.data)
        setTags(response.data);
      };

      fetchPosts();
      fetchCategories();
      fetchTags();
    }
  }, [completeUser]);

  return (
    <WordpressContext.Provider
      value={{
        posts,
        categories,
        tags
      }}
    >
      {children}
    </WordpressContext.Provider>
  );
};

const useWordpress = (): WordpressContextProps => {
  const context = useContext(WordpressContext);
  if (context === undefined) {
    throw new Error('useWordpress must be used within an WordpressProvider');
  }
  return context;
};

export { WordpressProvider, useWordpress };
