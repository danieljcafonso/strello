import { A, createAsync } from "@solidjs/router";
import { ParentProps, Show } from "solid-js";
import { DiscordIcon, GitHubIcon, Logo } from "./Logo";
import { getUser, logout } from "~/lib";

export default function Layout(props: ParentProps) {
    const user = createAsync(() => getUser());

    return (
        <div class="min-h-screen bg-slate-900">
            <header
                class="sticky top-0 z-50 flex items-center justify-between bg-blue-50/80 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none backdrop-blur  dark:bg-transparent bg-transparent"
            >
                <div class="grid lg:grid-cols-[1fr1fr] grid-cols-2 py-2 px-8 items-center w-full max-w-8xl mx-auto ">
                    <div class="flex justify-start gap-2">
                        <div class="flex justify-start gap-2">
                            <A href="/" aria-label="Home page">
                                <Logo class="h-9" />
                            </A>
                        </div>
                    </div>

                    <div class="lg:order-2 flex basis-0 gap-4 items-center justify-end order-">
                        <A
                            href="https://github.com/danieljcafonso/strello"
                            class="group"
                            aria-label="GitHub"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GitHubIcon class="h-6 w-6 fill-slate-800 dark:fill-slate-200 group-hover:dark:fill-white dark:group-hover:fill-slate-300" />
                        </A>
                        <A
                            href="https://discord.com/invite/solidjs"
                            class="group"
                            aria-label="Discord"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <DiscordIcon class="h-6 w-6 fill-slate-800 dark:fill-slate-200 group-hover:dark:fill-white dark:group-hover:fill-slate-300" />
                        </A>

                        <Show when={user()}>
                            <form action={logout} method="post">
                                <button name="logout" type="submit">
                                    Logout
                                </button>
                            </form>
                        </Show>
                    </div>
                </div>
            </header>
            {props.children}
        </div>
    )
}