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
  posts: string | null;
  categories: string | null;
  tags: string | null;
  fetchPosts: (sett: any) => any; // Post[]
  fetchCategories: () => any; // Category[]
  fetchTags: () => any; // Tag[]
}

const WordpressContext = createContext<WordpressContextProps | undefined>(undefined);

const WordpressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { completeUser } = useAuth();

  const [posts, setPosts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);

  const fetchPosts = async ({ status = "publish" }: { status?: string }) => {
    const response = await axios.get(`${ServerUrl}/wordpress/posts?userId=${completeUser._id}&status=${status}`);
    console.log("posts", response.data)
    return response.data
  };

  const fetchCategories = async () => {
    const response = await axios.get(`${ServerUrl}/wordpress/categories?userId=${completeUser._id}`);
    console.log("categories", response.data)
    setCategories(response.data);
  };

  const fetchTags = async () => {
    const response = await axios.get(`${ServerUrl}/wordpress/tags?userId=${completeUser._id}`);
    console.log("tags", response.data)
    setTags(response.data);
  };

  const [post, setPost] = useState(null);
  const [category, setCategory] = useState(null);
  const [tag, setTag] = useState(null);

  useEffect(() => {
    if (!completeUser) return;
    fetchCategories();
    fetchTags();
  }, [completeUser]);

  return (
    <WordpressContext.Provider
      value={{
        posts,
        categories,
        tags,
        fetchPosts,
        fetchCategories,
        fetchTags
      }}
    >
      {children}
    </WordpressContext.Provider>
  );
};

const useWordpress = (): any => {
  const context = useContext(WordpressContext);
  if (context === undefined) {
    throw new Error('useWordpress must be used within an WordpressProvider');
  }
  return context;
};

export { WordpressProvider, useWordpress };
