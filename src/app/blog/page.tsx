"use client";

import React, { useState, useEffect } from "react";
import { useWordpress } from "@/context/wordpress-context";
import { useAuth } from "@/context/platform-user-context";
import { useSearchParams, useRouter } from "next/navigation"; // Importa hooks de Next.js para manejar la URL
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

const BlogPage = () => {
  const { fetchPosts } = useWordpress();
  const { completeUser } = useAuth();
  const searchParams = useSearchParams(); // Hook para leer parámetros de la URL
  const router = useRouter(); // Hook para navegar y actualizar la URL

  // useState para manejar los posts organizados por status
  const [postsByStatus, setPostsByStatus] = useState({
    publish: [],
    future: [],
    private: [],
    draft: [],
    trash: [],
  });

  // Leer el estado desde los parámetros de la URL
  const statusFromUrl = searchParams.get("status") || "publish"; // Valor por defecto si no hay parámetro en la URL

  // useState para el status seleccionado
  const [selectedStatus, setSelectedStatus] = useState(statusFromUrl);

  const postStatus = [
    { name: "Publicado", slug: "publish" },
    { name: "Programados", slug: "future" },
    { name: "Privados", slug: "private" },
    { name: "Borradores", slug: "draft" },
    { name: "Papelera", slug: "trash" },
  ];

  const loadPosts = async () => {
    try {
      const posts = await fetchPosts({ status: selectedStatus });
      setPostsByStatus((prevPostsByStatus) => ({
        ...prevPostsByStatus,
        [selectedStatus]: posts,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Efecto para cargar posts cuando el status cambia
  useEffect(() => {
    if (!completeUser) return;
    loadPosts();
  }, [completeUser, selectedStatus, fetchPosts]);

  // Efecto para actualizar la URL cuando el status seleccionado cambia
  useEffect(() => {
    router.push(`?status=${selectedStatus}`);
  }, [selectedStatus]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Blogs</h1>

      {/* Tabs para cambiar el estado */}
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

        {/* Contenido de los Tabs, una tabla para cada estado */}
        {postStatus.map((status) => (
          <TabsContent key={status.slug} value={status.slug}>
            <Table>
              <TableCaption>Lista de posts en el estado: {status.name}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsByStatus[status.slug] && postsByStatus[status.slug].length > 0 ? (
                  postsByStatus[status.slug].map((post, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{post.title.rendered}</TableCell>
                      <TableCell>{post.status}</TableCell>
                      <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                      <TableCell>bot1 bpt2</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No hay posts en este estado.
                    </TableCell>
                  </TableRow>
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
