import { AppBar } from "@/components/AppBar";
import { DropZone } from "@/components/DropZone";
import { Button } from "@/components/ui/button";
import { SignUp, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  return (
    <div>
      <AppBar />
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center text-center">
          <div className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold">
            Talk to your PDF
          </div>
          <div className="text-lg text-gray-400 pt-4">
            With the power of AI
          </div>
          {userId ? (
            <div className="pt-2">
              <Button>
                Your chats <ArrowRight />
              </Button>
            </div>
          ) : (
            <div></div>
          )}
          <div>
            {userId ? (
              <div className="pt-4"><DropZone/></div>
            ) : (<div className="">
              <SignUpButton><Button>Signup to get started</Button></SignUpButton></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}