import Head from 'next/head'
import Link from 'next/link'
import {HeartIcon, LightningBoltIcon} from "@heroicons/react/solid";
import {RefreshIcon} from "@heroicons/react/outline";

const name = 'erd360'
export const siteTitle = 'erd360'
export const siteDescription = 'One page wallet viewer for Elrond'

export default function Layout({ children, home }) {
    return (
        <div className="container mx-auto px-4 max-w-4xl">
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png"/>
                <link rel="manifest" href="/icons/site.webmanifest"/>
                <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5"/>
                <link rel="shortcut icon" href="/icons/favicon.ico"/>
                <meta name="msapplication-TileColor" content="#da532c"/>
                <meta name="msapplication-config" content="/icons/browserconfig.xml"/>
                <meta name="theme-color" content="#18191a"/>
                <meta
                    name="description"
                    content={siteDescription}
                />
                <meta
                    property="og:image"
                    content={`/android-icon-192x192.png`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <header className="flex flex-col items-center my-8">

                {home ? (
                    <>
                        <div className={"flex bg-black w-48 h-48 rounded-full inline-block relative logo"}>
                            <RefreshIcon className={"w-40 h-40 my-4 mx-4 absolute align-middle content-center inverse text-grey-500"} />
                            <LightningBoltIcon className={"w-40 h-40 my-4 mx-4 text-yellow absolute"}/>
                        </div>
                        <h1>{siteTitle} • {siteDescription}</h1>
                    </>
                ) : (
                    <>
                        <Link href="/">
                            <a>
                                <div className={"flex bg-black w-48 h-48 rounded-full inline-block relative logo"}>
                                    <RefreshIcon className={"w-40 h-40 my-4 mx-4 absolute align-middle content-center inverse text-grey-500"} />
                                    <LightningBoltIcon className={"w-40 h-40 my-4 mx-4 text-yellow absolute"}/>
                                </div>
                            </a>
                        </Link>
                    </>
                )}
            </header>

            <main className="my-8">{children}</main>

            <footer className="my-8 text-center">
                <Link href="https://twitter.com/erd360wallet">
                    <a className="text-grey-100 hover:text-grey-200 text-sm" target="_blank">
                        Made with <HeartIcon className="h-4 w-4 inline-block align-text-bottom text-red" /> by erd360
                    </a>
                </Link>
            </footer>
        </div>
    )
}