import { SignUpButton, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";

export const AppBar = async () => {
    const {userId} = await auth();
    return (
        <div className="flex sticky top-0 container mx-auto justify-between p-4">
            <div>
                hi there
            </div>
            <div className="flex items-center">
                <div className="mx-6">
                    <ModeToggle/>
                </div>
                {userId ? <UserButton/> : <SignUpButton><Button>Sign up</Button></SignUpButton>}
            </div>
        </div>
    );
}