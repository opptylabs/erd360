import Head from 'next/head'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ChartPieIcon, CurrencyDollarIcon, PhotographIcon, TableIcon} from "@heroicons/react/solid";
import Layout, {siteTitle} from '../../components/layout'
import Loader from "../../components/loader";
import {useData} from "../../lib/account";
import Table360 from "../../components/elrond/table";
import {formatDollar} from "../../lib/format_dollar";
import tokens from "../../lib/fetch/maiar_tokens";
import {validate_address} from "../../lib/validate_address";
import economics from "../../lib/economics";
import Chart360 from "../../components/elrond/chart";
import TitleWithAddress from "../../components/title_with_address";
import Gallery from "../../components/elrond/gallery";

export async function getServerSideProps() {
    const toks = await tokens()
    const econs = await economics()

    return {
        props: {
            tokens: toks,
            economics: econs,
        }
    }
}

export default function Address({tokens, economics}) {
    const router = useRouter()
    const { address, v } = router.query
    const account = useData(address, tokens, economics)
    const [filterType, setFilterType] = useState('')
    const [view, setView] = useState(() => {
        switch (v) {
            case 'pie':
                return 'pie';
            case 'gallery':
                return 'gallery';
            case 'table':
            default:
                return 'table';
        }
    })

    if (address == null)
        return <Loader />

    useEffect(()=> {
        if (!validate_address(address)) {
            router.push('/')
        }
    })

    const onChangeFilterType = (e) => {
        if (filterType !== e.target.value) {
            setFilterType(e.target.value)
        }
    }

    const changeView = (newView) => {
        if (!newView) {
            newView = view
        }
        if (newView !== view) {
            if (newView === 'table') {
                router.push(`/accounts/${address}`, undefined, { shallow: true })
            } else {
                router.push(`/accounts/${address}?v=${newView}`, undefined, { shallow: true })
            }
            setView(newView)
        }
    }

    return (
        <Layout>
            <Head>
                <title>{siteTitle} • {address}</title>
            </Head>

            <section>
                <TitleWithAddress address={address}/>
            </section>

            {account ? (
                <>
                    <section className={"shadow overflow-hidden border border-grey-500 rounded-lg bg-grey-300 flex space-x-4 my-10 flex-col sm:flex-row"}>
                        <div className={"sm:w-1/3 my-4 px-4 sm:border-r border-grey-500 flex space-x-4"}>
                            <div className={"border border-grey-500 sm:rounded-lg p-3 shadow-2xl"}>
                                <svg width="48" height="48" viewBox="0 0 28 28" className={"h-6 w-6 text-blue"}><title>elrond-symbol</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="elrond-symbol" fill="currentColor"><path d="M22.2061538,5.67753846 C22.1129068,5.58029036 22.0602686,5.45113417 22.0589693,5.31641026 C22.0580557,5.1108679 22.1811865,4.9250609 22.370836,4.84580441 C22.5604854,4.76654792 22.7792124,4.80948898 22.9248205,4.9545641 C23.0260513,5.05651282 23.0777436,5.18430769 23.0777436,5.31641026 C23.0750193,5.59679768 22.8483874,5.82342956 22.568,5.82615407 C22.4327151,5.82628137 22.3028804,5.77285041 22.2068718,5.67753846 M20.7652308,7.11917949 C20.6717377,7.02174279 20.6188556,6.89236128 20.6173333,6.75733333 C20.6173333,6.62523077 20.6683077,6.49815385 20.7652308,6.39620513 C20.9653533,6.19772023 21.2880826,6.19772023 21.4882051,6.39620513 C21.5851282,6.49815385 21.6361026,6.62594872 21.6361026,6.75733333 C21.6361026,6.88512821 21.5858462,7.01723077 21.4882051,7.11917949 C21.3915636,7.21344496 21.2620777,7.26647497 21.1270769,7.26707692 C20.9918275,7.26666114 20.8620506,7.21361741 20.7652308,7.11917949 M19.3243077,8.55507692 C19.1260901,8.35570601 19.1267132,8.03349213 19.3257004,7.83488934 C19.5246876,7.63628655 19.8469021,7.63628655 20.0458893,7.83488934 C20.2448766,8.03349213 20.2454997,8.35570601 20.0472821,8.55507692 C19.9521819,8.65239195 19.821862,8.70725305 19.6857949,8.70725305 C19.5497278,8.70725305 19.4194078,8.65239195 19.3243077,8.55507692 M17.8826667,9.99671795 C17.6867146,9.79751307 17.6867146,9.47797411 17.8826667,9.27876923 C18.0829497,9.08067439 18.405358,9.08067439 18.605641,9.27876923 C18.8027578,9.47749583 18.8027578,9.79799135 18.605641,9.99671795 C18.5102868,10.0929267 18.3799592,10.1463014 18.2445128,10.1446154 C18.1090052,10.1455197 17.978746,10.0922788 17.8826667,9.99671795 M16.4467692,11.438359 C16.349189,11.344431 16.2940513,11.2148259 16.2940513,11.0793846 C16.2940513,10.9439433 16.349189,10.8143382 16.4467692,10.7204103 C16.540595,10.6226431 16.6702382,10.5673742 16.8057436,10.5673742 C16.9412489,10.5673742 17.0708922,10.6226431 17.1647179,10.7204103 C17.2605267,10.8139113 17.3137366,10.9426533 17.3118974,11.0765128 C17.3148985,11.2122751 17.2616306,11.3432362 17.1647179,11.438359 C17.069644,11.5353445 16.93865,11.5886258 16.8028718,11.5855385 C16.6687641,11.5875756 16.5397248,11.5343501 16.4460513,11.438359 M14.8522051,12.5181538 C14.8522051,12.390359 14.9038974,12.2575385 15.0051282,12.1563077 C15.1504793,12.0104868 15.3695964,11.9670769 15.5595647,12.0464666 C15.7495329,12.1258563 15.8726042,12.3122704 15.8709744,12.5181538 C15.8726604,12.6536002 15.8192857,12.7839278 15.7230769,12.8792821 C15.5765162,13.0234607 15.3579179,13.0659678 15.1680079,12.9872169 C14.9780978,12.9084661 14.8537278,12.7237389 14.8522051,12.5181538 L14.8522051,12.5181538 Z M13.5642051,14.3202051 C13.4680663,14.2248041 13.4147042,14.0945075 13.4163077,13.9590769 C13.4163077,13.6793376 13.6430812,13.4525641 13.9228205,13.4525641 C14.2025598,13.4525641 14.4293333,13.6793376 14.4293333,13.9590769 C14.4313214,14.0946508 14.3782096,14.2252282 14.2821538,14.3209231 C14.0834272,14.5180399 13.7629317,14.5180399 13.5642051,14.3209231 M12.1225641,15.7568205 C11.9254473,15.5580939 11.9254473,15.2375984 12.1225641,15.0388718 C12.21776,14.9436471 12.3468907,14.890148 12.4815385,14.890148 C12.6161862,14.890148 12.7453169,14.9436471 12.8405128,15.0388718 C12.9424615,15.1401026 12.9934359,15.2671795 12.9934359,15.4 C12.9933798,15.5348434 12.9381194,15.6637845 12.8405128,15.7568205 C12.7476241,15.8541231 12.6189319,15.9091286 12.4844103,15.909028 C12.3481485,15.909443 12.2175578,15.8545121 12.1225641,15.7568205 M10.681641,17.1977436 C10.4841178,16.9985062 10.4850438,16.6770093 10.6837114,16.4789131 C10.8823791,16.2808168 11.2038773,16.2808168 11.402545,16.4789131 C11.6012126,16.6770093 11.6021386,16.9985062 11.4046154,17.1977436 C11.309614,17.2952413 11.1792571,17.3502298 11.0431282,17.3502298 C10.9069993,17.3502298 10.7766424,17.2952413 10.681641,17.1977436 M9.24,18.6386667 C9.14477529,18.5434707 9.09127619,18.41434 9.09127619,18.2796923 C9.09127619,18.1450446 9.14477529,18.0159139 9.24,17.9207179 C9.44020665,17.7217579 9.76348565,17.7217579 9.96369231,17.9207179 C10.1608091,18.1194445 10.1608091,18.4399401 9.96369231,18.6386667 C9.86833179,18.7353899 9.73766165,18.7890579 9.60184615,18.7872821 C9.46603066,18.7890579 9.33536052,18.7353899 9.24,18.6386667 M7.80410256,20.0803077 C7.7055829,19.9858224 7.6502794,19.8549635 7.65117949,19.7184615 C7.65117949,19.5913846 7.70215385,19.46 7.80410256,19.3573333 C8.00438693,19.164036 8.32176692,19.164036 8.52205128,19.3573333 C8.61543723,19.4545497 8.66831667,19.583668 8.66995233,19.7184615 C8.67045714,19.8538924 8.61727589,19.9840058 8.52205128,20.0803077 C8.42647627,20.1766268 8.29588383,20.2300038 8.16020513,20.2282051 C8.02625557,20.2297715 7.89753011,20.1763089 7.80410256,20.0803077 M6.36246154,21.5219487 C6.26427738,21.4272919 6.20925368,21.2964808 6.21025641,21.1601026 C6.21025641,21.0330256 6.26051282,20.9002051 6.36246154,20.7982564 C6.5627459,20.6049591 6.88012589,20.6049591 7.08041026,20.7982564 C7.17623428,20.8942179 7.22973957,21.0244916 7.22902564,21.1601026 C7.23175252,21.2959556 7.17823183,21.4268994 7.08112821,21.5219487 C6.88176603,21.7175162 6.56254167,21.7175162 6.36317949,21.5219487 M4.92153846,22.9628718 C4.82532969,22.8675175 4.77195497,22.73719 4.77364103,22.6017436 C4.77201122,22.3958601 4.89508248,22.2094461 5.08505072,22.1300564 C5.27501896,22.0506666 5.49413608,22.0940766 5.63948718,22.2398974 C5.7368022,22.3349976 5.79166331,22.4653175 5.79166331,22.6013846 C5.79166331,22.7374517 5.7368022,22.8677716 5.63948718,22.9628718 C5.44044066,23.1592102 5.12058499,23.1592102 4.92153846,22.9628718" id="Shape"/><path d="M5.64451282,5.67753846 C5.73802222,5.58040245 5.79092259,5.4512331 5.79241536,5.31641026 C5.79332888,5.1108679 5.67019809,4.9250609 5.48054864,4.84580441 C5.29089918,4.76654792 5.07217219,4.80948898 4.9265641,4.9545641 C4.82902253,5.04971985 4.77390344,5.18014248 4.77364103,5.31641026 C4.77636531,5.59679768 5.00299719,5.82342956 5.28338462,5.82615385 C5.41548718,5.82615385 5.54830769,5.77517949 5.64451282,5.67753846 M7.08615385,7.11917949 C7.17938466,7.02163107 7.23200476,6.89226263 7.23333333,6.75733333 C7.23277393,6.6224628 7.18002887,6.49304444 7.08615385,6.39620513 C6.88603133,6.19772023 6.563302,6.19772023 6.36317949,6.39620513 C6.26897805,6.49288868 6.21595911,6.62234755 6.21528205,6.75733333 C6.21528205,6.88512821 6.26553846,7.01723077 6.36317949,7.11917949 C6.46512821,7.21610256 6.59220513,7.26707692 6.72430769,7.26707692 C6.85641026,7.26707692 6.98420513,7.21682051 7.08615385,7.11917949 M8.52707692,8.55507692 C8.72529454,8.35570601 8.72467143,8.03349213 8.52568421,7.83488934 C8.32669698,7.63628655 8.0044825,7.63628655 7.80549528,7.83488934 C7.60650805,8.03349213 7.60588495,8.35570601 7.80410256,8.55507692 C7.89920271,8.65239195 8.02952266,8.70725305 8.16558974,8.70725305 C8.30165683,8.70725305 8.43197678,8.65239195 8.52707692,8.55507692 M9.96871795,9.99671795 C10.16467,9.79751307 10.16467,9.47797411 9.96871795,9.27876923 C9.76843496,9.08067439 9.44602658,9.08067439 9.24574359,9.27876923 C9.04862677,9.47749583 9.04862677,9.79799135 9.24574359,9.99671795 C9.34769231,10.0986667 9.47476923,10.1446154 9.60687179,10.1446154 C9.74237939,10.1455197 9.87263858,10.0922788 9.96871795,9.99671795 M11.4046154,11.438359 C11.5021956,11.344431 11.5573333,11.2148259 11.5573333,11.0793846 C11.5573333,10.9439433 11.5021956,10.8143382 11.4046154,10.7204103 C11.3107896,10.6226431 11.1811464,10.5673742 11.045641,10.5673742 C10.9101357,10.5673742 10.7804924,10.6226431 10.6866667,10.7204103 C10.590594,10.8137893 10.5371181,10.9425469 10.5387692,11.0765128 C10.5387692,11.2086154 10.5847179,11.3414359 10.6866667,11.438359 C10.7835897,11.5403077 10.9164103,11.5855385 11.0485128,11.5855385 C11.1823724,11.5873776 11.3111144,11.5341677 11.4046154,11.438359 M12.9984615,12.5181538 C12.9974351,12.3821851 12.9427288,12.2521286 12.8462564,12.1563077 C12.7009053,12.0104868 12.4817882,11.9670769 12.29182,12.0464666 C12.1018517,12.1258563 11.9787804,12.3122704 11.9804103,12.5181538 C11.9804103,12.6502564 12.026359,12.7773333 12.1283077,12.8792821 C12.2748684,13.0234607 12.4934667,13.0659678 12.6833767,12.9872169 C12.8732868,12.9084661 12.9976568,12.7237389 12.9991795,12.5181538 L12.9984615,12.5181538 Z M14.2871795,14.3202051 C14.3833183,14.2248041 14.4366804,14.0945075 14.4350769,13.9590769 C14.4350769,13.6793376 14.2083034,13.4525641 13.9285641,13.4525641 C13.6488248,13.4525641 13.4220513,13.6793376 13.4220513,13.9590769 C13.4220513,14.0911795 13.4672821,14.2189744 13.5692308,14.3209231 C13.7679574,14.5180399 14.0884529,14.5180399 14.2871795,14.3209231 M15.7281026,15.7568205 C15.9252194,15.5580939 15.9252194,15.2375984 15.7281026,15.0388718 C15.6329066,14.9436471 15.5037759,14.890148 15.3691282,14.890148 C15.2344805,14.890148 15.1053498,14.9436471 15.0101538,15.0388718 C14.9126532,15.13376 14.8575238,15.2639483 14.8572308,15.4 C14.8572308,15.5270769 14.9089231,15.6598974 15.0108718,15.7568205 C15.1037605,15.8541231 15.2324527,15.9091286 15.3669744,15.9090263 C15.5029871,15.9092484 15.6332823,15.8543328 15.7281026,15.7568205 M17.1697436,17.1977436 C17.3669737,16.9984027 17.3658335,16.6770916 17.1671938,16.4791555 C16.968554,16.2812193 16.6472409,16.2812193 16.4486011,16.4791555 C16.2499613,16.6770916 16.2488212,16.9984027 16.4460513,17.1977436 C16.5410527,17.2952413 16.6714096,17.3502298 16.8075385,17.3502298 C16.9436674,17.3502298 17.0740242,17.2952413 17.1690256,17.1977436 M18.6106667,18.6386667 C18.7058914,18.5434707 18.7593905,18.41434 18.7593905,18.2796923 C18.7593905,18.1450446 18.7058914,18.0159139 18.6106667,17.9207179 C18.4105441,17.722233 18.0878148,17.722233 17.8876923,17.9207179 C17.6905755,18.1194445 17.6905755,18.4399401 17.8876923,18.6386667 C17.989641,18.7413333 18.1174359,18.7872821 18.2495385,18.7872821 C18.3851058,18.7888619 18.5154797,18.7352091 18.6106667,18.6386667 M20.0465641,20.0803077 C20.1450838,19.9858224 20.2003873,19.8549635 20.1994872,19.7184615 C20.1984276,19.58271 20.1437119,19.4528891 20.0472821,19.3573333 C19.8469977,19.164036 19.5296177,19.164036 19.3293333,19.3573333 C19.2359474,19.4545497 19.1830679,19.583668 19.1814359,19.7184615 C19.1814359,19.8512821 19.2316923,19.9841026 19.3293333,20.0803077 C19.4312821,20.1822564 19.5590769,20.2282051 19.6904615,20.2282051 C19.8246594,20.2299692 19.953682,20.176491 20.0472821,20.0803077 M21.4882051,21.5219487 C21.5866535,21.4274144 21.6419434,21.2965876 21.6411371,21.1601026 C21.640068,21.0239985 21.5850733,20.8938702 21.4882051,20.7982564 C21.2879208,20.6049591 20.9705408,20.6049591 20.7702564,20.7982564 C20.6746955,20.8943358 20.6214547,21.024595 20.622359,21.1601026 C20.622359,21.2922051 20.6683077,21.4250256 20.7702564,21.5219487 C20.9696186,21.7175162 21.2888429,21.7175162 21.4882051,21.5219487 M22.9298462,22.9628718 C23.0260549,22.8675175 23.0794296,22.73719 23.0777436,22.6017436 C23.0793734,22.3958601 22.9563021,22.2094461 22.7663339,22.1300564 C22.5763657,22.0506666 22.3572485,22.0940766 22.2118974,22.2398974 C22.1145824,22.3349976 22.0597213,22.4653175 22.0597213,22.6013846 C22.0597213,22.7374517 22.1145824,22.8677716 22.2118974,22.9628718 C22.410944,23.1592102 22.7307996,23.1592102 22.9298462,22.9628718 M9.0705641,6.06810256 L5.97764103,2.97446154 C8.36769231,1.13435897 11.0090256,0.211794872 13.901641,0.208916409 C16.7791795,0.206051282 19.4226667,1.13076923 21.8313846,2.98020513 L18.7327179,6.07815385 C17.2537436,5.11610256 15.6426667,4.63507692 13.8987692,4.63866667 C12.1326154,4.64225641 10.5244103,5.12041026 9.0705641,6.06738462 L9.0705641,6.06810256 Z M6.0214359,18.7887179 L2.93066667,21.8794872 C1.10564103,19.4865641 0.191692308,16.8452308 0.195271518,13.9533333 C0.197435897,11.0348718 1.10707692,8.39282051 2.92205128,6.02717949 L6.01138462,9.11794872 C5.04215385,10.584 4.55394872,12.1950769 4.55035897,13.9518974 C4.54748718,15.6857436 5.03928205,17.2975385 6.02215385,18.7901538 L6.0214359,18.7887179 Z M18.7578462,21.8629744 L21.8385641,24.9436923 C19.4779487,26.7629744 16.8481026,27.6841026 13.9490256,27.7070769 C11.0219487,27.7300513 8.36194872,26.809641 5.96902564,24.9501538 L9.0454359,21.8730256 C10.5272821,22.8803077 12.1555897,23.3807179 13.9310769,23.3685128 C15.6792821,23.3563077 17.2874872,22.8530256 18.7578462,21.8629744 L18.7578462,21.8629744 Z M21.8041026,9.11507692 L24.8984615,6.02 C26.7593846,8.41220513 27.6790769,11.0722051 27.6561026,14 C27.6331282,16.8868718 26.7105641,19.5152821 24.8891282,21.8859487 L21.797641,18.7944615 C22.7517949,17.3442051 23.2407179,15.7596923 23.2622564,14.0380513 C23.2830769,12.2532308 22.7955897,10.6127179 21.8041026,9.11507692 L21.8041026,9.11507692 Z M25.0154872,22.8566154 C26.2028427,22.8566154 27.1653846,23.8191573 27.1653846,25.0065128 C27.1653846,26.1938684 26.2028427,27.1564103 25.0154872,27.1564103 C23.8281316,27.1564103 22.8655897,26.1938684 22.8655897,25.0065128 C22.8655897,23.8191573 23.8281316,22.8566154 25.0154872,22.8566154 M2.86174359,22.8609231 C4.04909916,22.8609231 5.01164103,23.8234649 5.01164103,25.0108205 C5.01164103,26.1981761 4.04909916,27.1607179 2.86174359,27.1607179 C1.67438802,27.1607179 0.711846154,26.1981761 0.711846154,25.0108205 C0.711846154,23.8234649 1.67438802,22.8609231 2.86174359,22.8609231 M25.0355897,0.687076923 C26.2227471,0.687076923 27.1851282,1.64945807 27.1851282,2.83661538 C27.1851282,4.0237727 26.2227471,4.98615385 25.0355897,4.98615385 C23.8484324,4.98615385 22.8860513,4.0237727 22.8860513,2.83661538 C22.8860513,1.64945807 23.8484324,0.687076923 25.0355897,0.687076923 M2.80717949,0.649025641 C3.57513562,0.649025641 4.28475636,1.05872534 4.66873443,1.72379486 C5.0527125,2.38886438 5.0527125,3.20826382 4.66873443,3.87333334 C4.28475636,4.53840286 3.57513562,4.94810256 2.80717949,4.94810256 C1.62002218,4.94810256 0.657641026,3.98572141 0.657641026,2.7985641 C0.657641026,1.61140679 1.62002218,0.649025641 2.80717949,0.649025641" id="Shape"></path></g></g></svg>
                            </div>
                            <div className={"overflow-hidden"}>
                                <span className={"text-grey-100"}>Balance</span><br/>{account.valueEgld}
                            </div>
                        </div>

                        <div className={"sm:w-1/3 my-4 sm:border-r border-grey-500 flex space-x-4"}>
                            <div className={"border border-grey-500 sm:rounded-lg p-3 shadow-2xl"}>
                                <CurrencyDollarIcon className="h-6 w-6 text-blue"/>
                            </div>
                            <div>
                                <span className={"text-grey-100"}>Value</span><br/>{formatDollar(account.valueUsd)}
                            </div>
                        </div>

                        <div className={"sm:w-1/3 my-4 flex space-x-4"}>
                            <div className={"border border-grey-500 sm:rounded-lg p-3 shadow-2xl"}>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-area"
                                     className="h-6 w-6 text-blue" role="img"
                                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path fill="currentColor"
                                          d="M500 384c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v308h436zM372.7 159.5L288 216l-85.3-113.7c-5.1-6.8-15.5-6.3-19.9 1L96 248v104h384l-89.9-187.8c-3.2-6.5-11.4-8.7-17.4-4.7z"/>
                                </svg>
                            </div>
                            <div>
                                <span className={"text-grey-100"}>1 EGLD</span><br/>{account.pair ? formatDollar(Math.round(account.pair * 100) / 100) : (<Loader/>)}
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-row-reverse my-10">
                        <div className="" role="group">
                            <button className={`${view === 'table' ? 'btn-primary' : 'btn'}`} onClick={() => changeView('table')} title={"Table View"}>
                                <TableIcon className={"w-5 h-5"} />
                            </button>
                            <button className={`${view === 'pie' ? 'btn-primary' : 'btn'}`} onClick={() => changeView('pie')} title={"Chart View"}>
                                <ChartPieIcon className={"w-5 h-5"} />
                            </button>
                            <button className={`${view === 'gallery' ? 'btn-primary' : 'btn'}`} onClick={() => changeView('gallery')} title={"NFT Gallery View"}>
                                <PhotographIcon className={"w-5 h-5"} />
                            </button>
                        </div>
                        {view !== 'gallery' ?
                            <select onChange={onChangeFilterType} defaultValue={filterType} className={"mx-3"}>
                                <option value={''}>360</option>
                                <option value={"nft"}>NFT</option>
                                <option value={"token"}>TOKEN</option>
                                <option value={"meta"}>META</option>
                            </select>
                        : ''}
                    </section>

                    {
                        view === 'gallery' ?
                            <Gallery account={account} filterType={filterType} />
                            :
                            (view === 'pie' ?
                                    <section className={"shadow border border-grey-500 rounded-lg bg-grey-300 flex space-x-4 flex-col sm:flex-row"}>
                                        <Chart360 account={account} filterType={filterType} />
                                    </section>
                                    :
                                    <Table360 account={account} filterType={filterType} />
                            )
                    }
                </>
            ) : (<Loader/>)}

        </Layout>
    )
}