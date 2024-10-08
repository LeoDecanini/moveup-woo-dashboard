'use client';

import React, { useState, useEffect } from 'react';
import { useWordpress } from '@/context/wordpress-context';
import { useAuth } from '@/context/platform-user-context';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

import MoveUpLoader from '@/components/shared/moveup-loader';
import { Button } from '@/components/ui/button';

import { FiRefreshCw } from 'react-icons/fi';

const BlogPage = () => {
  const { fetchPosts, fetchPostsCountByStatus } = useWordpress();
  const { completeUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [postsByStatus, setPostsByStatus] = useState({
    'publish': [],
    'future': [],
    /* 'private': [], */
    'draft': [],
    'trash': [],
    'pending': [],
    /* 'auto-draft': [],
    'inherit': [],
    'request-pending': [],
    'request-confirmed': [],
    'request-failed': [],
    'request-completed': [], */
  });

  const [isLoading, setIsLoading] = useState(false);

  /*fetchPostCountByStatus*/
  const [postsCountByStatus, setPostsCountByStatus] = useState({
    'publish': 0,
    'draft': 0,
    'pending': 0,
    'future': 0,
   /*  'private': 0, */
    'trash': 0,
    /* 'auto-draft': 0,
    'inherit': 0,
    'request-pending': 0,
    'request-confirmed': 0,
    'request-failed': 0,
    'request-completed': 0, */
  });

  const statusFromUrl = searchParams.get('status') || 'publish';

  const [selectedStatus, setSelectedStatus] = useState(statusFromUrl);

  let postStatus = [
    {
      name: 'Publicado',
      slug: 'publish',
      light: { color: '#012609', bg: '#deffe5' },
      dark: { color: '#deffe5', bg: '#012609' },
      opened: true,
    },
    {
      name: 'Programados',
      slug: 'future',
      light: { color: '#055b69', bg: '#e0f7fa' },
      dark: { color: '#e0f7fa', bg: '#055b69' },
      opened: true,
    },
    /* {
      name: 'Privados',
      slug: 'private',
      light: { color: '#2a2d30', bg: '#d8e2ed' },
      dark: { color: '#d8e2ed', bg: '#2a2d30' },
    }, */
    {
      name: 'Pendiente',
      slug: 'pending',
      light: { color: '#856404', bg: '#fff3cd' },
      dark: { color: '#fff3cd', bg: '#856404' },
    },
    {
      name: 'Borrador',
      slug: 'draft',
      light: { color: '#3d2f03', bg: '#ffecb5' },
      dark: { color: '#ffecb5', bg: '#3d2f03' },
      opened: true,
    },
    {
      name: 'Papelera',
      slug: 'trash',
      light: { color: '#dc3545', bg: '#f8d7da' },
      dark: { color: '#dc3545', bg: '#f8d7da' },
      opened: true,
    },
    /* {
      name: 'Borrador Automático',
      slug: 'auto-draft',
      light: { color: '#004085', bg: '#cce5ff' },
      dark: { color: '#cce5ff', bg: '#004085' },
    },
    {
      name: 'Heredado',
      slug: 'inherit',
      light: { color: '#383d41', bg: '#e2e3e5' },
      dark: { color: '#e2e3e5', bg: '#383d41' },
    },
    {
      name: 'Solicitud Pendiente',
      slug: 'request-pending',
      light: { color: '#856404', bg: '#fff3cd' },
      dark: { color: '#fff3cd', bg: '#856404' },
    },
    {
      name: 'Solicitud Confirmada',
      slug: 'request-confirmed',
      light: { color: '#155724', bg: '#d4edda' },
      dark: { color: '#d4edda', bg: '#155724' },
    },
    {
      name: 'Solicitud Fallida',
      slug: 'request-failed',
      light: { color: '#721c24', bg: '#f8d7da' },
      dark: { color: '#f8d7da', bg: '#721c24' },
    },
    {
      name: 'Solicitud Completada',
      slug: 'request-completed',
      light: { color: '#155724', bg: '#d4edda' },
      dark: { color: '#d4edda', bg: '#155724' },
    }, */
  ];


  const getPostStatusBySlug = (slug) => {
    const status = postStatus.find((status) => status.slug === slug);
    return status || null;
  };

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const posts = await fetchPosts({ status: selectedStatus });
      /* setTimeout(() => { */
      setPostsByStatus((prevPostsByStatus) => ({
        ...prevPostsByStatus,
        [selectedStatus]: posts,
      }));
      /* }, 2500); */
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      /* setTimeout(() => { */
      setIsLoading(false);
      /* }, 2500); */
    }

    try {
      const count = await fetchPostsCountByStatus();
      /* setTimeout(() => { */
      setPostsCountByStatus(count);
      /* }, 2500); */
    } catch (error) {
      console.error('Error fetching count:', error);
    } finally {
      /* setTimeout(() => { */
      setIsLoading(false);
      /* }, 2500); */
    }
  };

  useEffect(() => {
    if (!completeUser) return;
    loadPosts();
  }, [completeUser, selectedStatus, fetchPosts]);

  useEffect(() => {
    router.push(`?status=${selectedStatus}`);
  }, [selectedStatus]);

  return (
    <div className='p-4 max-w-6xl mx-auto'>
      <h1 className='text-xl font-semibold mb-4'>Administrar entradas</h1>

      <Tabs
        defaultValue={selectedStatus}
        onValueChange={(value) => setSelectedStatus(value)}
      >
        <div className='w-full flex justify-between items-center gap-x-8 mb-4'>
          <TabsList className='py-0 overflow-x-scroll custom-scroll'>
            {postStatus.map((status: any) => (
              <TabsTrigger key={status.slug} value={status.slug}>
                {status.name}
                <Badge
                  className={`ml-2 px-1.5`}

                  variant='outline'
                >
                  {postsCountByStatus[status.slug]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className={'min-w-[120.43px] flex items-end justify-end'}>
            <Button disabled={isLoading} onClick={loadPosts} variant='outline'>
              {isLoading && <FiRefreshCw className={'animate-spin mr-1.5'} />}
              Actualizar
            </Button>
          </div>
        </div>

        {postStatus.map((status) => (
          <TabsContent key={status.slug} value={status.slug}>
            <Table>
              {/* <TableCaption>Lista de posts en el estado: {status.name}</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className='w-32'>Estado</TableHead>
                  <TableHead className='w-32'>Fecha</TableHead>
                  <TableHead className='w-32'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && postsByStatus[selectedStatus] && postsByStatus[selectedStatus].length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className='text-center'>
                      <div className='min-h-48 grid place-items-center'><MoveUpLoader /></div>
                    </TableCell>
                  </TableRow>
                ) : (
                  postsByStatus && postsByStatus[selectedStatus] && postsByStatus[selectedStatus].length > 0 && postsByStatus[selectedStatus].map((post, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>{post.title.rendered ||
                        <em className={'opacity-70'}>Sin título</em>}</TableCell>
                      <TableCell>
                        <Badge
                          className={``}
                          style={{
                            backgroundColor: getPostStatusBySlug(post.status)?.light.bg,
                            color: getPostStatusBySlug(post.status)?.light.color,
                          }}
                          variant='outline'
                        >
                          {getPostStatusBySlug(post.status)?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                      <TableCell>bot1 bpt2</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BlogPage;
