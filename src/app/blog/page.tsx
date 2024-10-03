"use client";

import React, { useState, useEffect } from "react";
import { useWordpress } from "@/context/wordpress-context";
import { useAuth } from "@/context/platform-user-context";
import { useSearchParams, useRouter } from "next/navigation"; 
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge"

import MoveUpLoader from '@/components/shared/moveup-loader';

const BlogPage = () => {
    const { fetchPosts } = useWordpress();
    const { completeUser } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [postsByStatus, setPostsByStatus] = useState({
        publish: [],
        future: [],
        private: [],
        draft: [],
        trash: [],
    });

    const [isLoading, setIsLoading] = useState(false);

    const statusFromUrl = searchParams.get("status") || "publish";

    const [selectedStatus, setSelectedStatus] = useState(statusFromUrl);

    const postStatus = [
        { name: "Publicado", slug: "publish", color: '#deffe5', bg: '#012609' },
        { name: "Programados", slug: "future", color: '#17a2b8', bg: '#e0f7fa' }, 
        { name: "Privados", slug: "private", color: '#6c757d', bg: '#f8f9fa' }, 
        { name: "Borrador", slug: "draft", color: '#ffc107', bg: '#fff8e1' }, 
        { name: "Papelera", slug: "trash", color: '#dc3545', bg: '#f8d7da' },
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
            console.error("Error fetching posts:", error);
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
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Blogs</h1>

            <Tabs
                defaultValue={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value)}
            >
                <TabsList className="mb-4">
                    {postStatus.map((status) => (
                        <TabsTrigger key={status.slug} value={status.slug}>
                            {status.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {postStatus.map((status) => (
                    <TabsContent key={status.slug} value={status.slug}>
                        <Table>
                            {/* <TableCaption>Lista de posts en el estado: {status.name}</TableCaption> */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead className="w-32">Estado</TableHead>
                                    <TableHead className="w-32">Fecha</TableHead>
                                    <TableHead className="w-32"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && postsByStatus[selectedStatus].length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            <div className="min-h-48 grid place-items-center"><MoveUpLoader/></div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    postsByStatus[selectedStatus].map((post, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{post.title.rendered}</TableCell>
                                            <TableCell>
                                            <Badge
                                                className={``}
                                                style={{backgroundColor: getPostStatusBySlug(post.status)?.bg, color: getPostStatusBySlug(post.status)?.color}}
                                                variant="outline"
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
