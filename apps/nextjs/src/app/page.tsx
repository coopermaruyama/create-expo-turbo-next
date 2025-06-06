import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatePostForm, PostCardSkeleton, PostList } from "@/components/posts";
import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server";
import { Button } from "@/ui/button";

import { auth, getSession, signOut } from "~/lib/auth/server";
import { AuthShowcase } from "../components/auth-showcase";

export default async function HomePage() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">T3</span> Turbo
          </h1>
          <form method="post">
            <Button
              type="submit"
              variant="outline"
              formAction={async () => {
                "use server";
                if (!session) {
                  return redirect("/auth/login");
                }
                if (session) {
                  const res = await signOut();
                  if (res.success) {
                    redirect("/");
                  } else {
                    throw new Error("Failed to sign out");
                  }
                }
              }}
            >
              {session ? "Sign Out" : "Sign In"}
            </Button>
          </form>

          <CreatePostForm />
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </div>
              }
            >
              <PostList />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
