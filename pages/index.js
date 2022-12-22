import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import Address from "../components/elrond/address";

export default function Home() {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>

            <Address />
        </Layout>
    )
}