"use client"

import { useWordpress } from "@/context/wordpress-context"

const BlogPage = () => {

    const { posts } = useWordpress()


    return <>
    <h1>Blogs</h1>
    {
        posts && posts.length > 0 && posts.map((post, index) => 
            <div key={index}>
                    {post.title.rendered}
                </div>
        )
    }
    </>

}

export default BlogPage