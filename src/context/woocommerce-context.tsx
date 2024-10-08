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

interface WoocommerceContextProps {
    createProduct: (sett: any) => any; // Tag[]
    /*  posts: string | null;
     categories: string | null;
     tags: string | null;
     fetchPosts: (sett: any) => any; // Post[] */
    /* fetchCategories: () => any; // Category[]
    fetchTags: () => any; // Tag[]
    addCategory: (sett: any) => any; // Tag[]
    fetchPostsCountByStatus: () => any;
    addTag: (sett: any) => any; // Tag[] */
}

const WoocommerceContext = createContext<WoocommerceContextProps | undefined>(undefined);

const WoocommerceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { completeUser } = useAuth();

    /* const [posts, setPosts] = useState(null);
    const [categories, setCategories] = useState(null);
    const [tags, setTags] = useState(null); */


    const createProduct = async (productData: any) => {
        try {
          const response = await axios.post(
            `${ServerUrl}/wordpress/woocommerce/create-product?userId=${completeUser._id}`,
            productData,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Producto creado en WooCommerce:', response.data);
          return response.data;
        } catch (error) {
          console.error('Error al crear el producto:', error.response?.data || error.message);
          throw error;
        }
      };

    /* const fetchPostsCountByStatus = async () => {
      const response = await axios.get(`${ServerUrl}/wordpress/woocommerce/posts/status-count?userId=${completeUser._id}`);
      console.log('post count status', response.data);
      return response.data;
    };
  
    const fetchCategories = async () => {
      const response = await axios.get(`${ServerUrl}/wordpress/woocommerce/categories?userId=${completeUser._id}`);
      console.log('categories', response.data);
      return response.data;
    };
  
    const fetchTags = async () => {
      const response = await axios.get(`${ServerUrl}/wordpress/woocommerce/tags?userId=${completeUser._id}`);
      console.log('tags', response.data);
      return response.data;
    };
  
    const addCategory = async (data: any) => {
      console.log('calling');
      const response = await axios.post(`${ServerUrl}/wordpress/woocommerce/categories?userId=${completeUser._id}`,
        data);
      console.log('category', response.data);
      return response.data;
    };
  
    const addTag = async (data: any) => {
      console.log('calling');
      const response = await axios.post(`${ServerUrl}/wordpress/woocommerce/tags?userId=${completeUser._id}`,
        data);
      console.log('category', response.data);
      return response.data;
    };
  
    const addTagsMultiple = async (data) => {
      console.log({ addTagsMultiple: data });
      const response = await axios.post(`${ServerUrl}/wordpress/woocommerce/tags/multiple?userId=${completeUser._id}`,
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
   */

    return (
        <WoocommerceContext.Provider
            value={{
                createProduct
                /* posts,
                categories,
                tags,
                fetchPosts, */
                /* fetchCategories,
                fetchTags,
                addCategory,
                addTag,
                fetchPostsCountByStatus, */
            }}
        >
            {children}
        </WoocommerceContext.Provider>
    );
};

const useWoocommerce = (): any => {
    const context = useContext(WoocommerceContext);
    if (context === undefined) {
        throw new Error('useWoocommerce must be used within an WoocommerceProvider');
    }
    return context;
};

export { WoocommerceProvider, useWoocommerce };
