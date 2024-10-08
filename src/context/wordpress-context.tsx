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
  addCategory: (sett: any) => any; // Tag[]
  fetchPostsCountByStatus: () => any;
}

const WordpressContext = createContext<WordpressContextProps | undefined>(undefined);

const WordpressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const { completeUser } = useAuth();

  const [posts, setPosts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);

  const fetchPosts = async ({ status = 'publish' }: { status?: string }) => {
    try {
      /*if (!completeUser || !completeUser.token) {
        throw new Error('Usuario no autenticado o token no disponible');
      }*/

      /*
      * {
          headers: {
            'Authorization': `Bearer ${completeUser.token}`,
          },
        },
      * */
      const response = await axios.get(
        `${ServerUrl}/wordpress/posts?userId=${completeUser._id}&status=${status}`,
        {
          headers: {
            'Authorization': `Bearer ${completeUser.token}`,
          },
        },
      );

      console.log('posts', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

  const fetchPostsCountByStatus = async () => {
    const response = await axios.get(`${ServerUrl}/wordpress/posts/status-count?userId=${completeUser._id}`);
    console.log('post count status', response.data);
    return response.data;
  };

  const fetchCategories = async () => {
    const response = await axios.get(`${ServerUrl}/wordpress/categories?userId=${completeUser._id}`);
    console.log('categories', response.data);
    return response.data;
  };

  const fetchTags = async () => {
    const response = await axios.get(`${ServerUrl}/wordpress/tags?userId=${completeUser._id}`);
    console.log('tags', response.data);
    return response.data;
  };

  const addCategory = async (data: any) => {
    console.log('calling');
    const response = await axios.post(`${ServerUrl}/wordpress/categories?userId=${completeUser._id}`,
      data);
    console.log('category', response.data);
    return response.data;
  };

  const addTagsMultiple = async (data) => {
    console.log({ addTagsMultiple: data });
    const response = await axios.post(`${ServerUrl}/wordpress/tags/multiple?userId=${completeUser._id}`,
      data);
    console.log('category', response.data);
    return response.data;
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
        fetchTags,
        addCategory,
        fetchPostsCountByStatus
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
