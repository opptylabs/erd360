import Link from 'next/link'
import {useEffect, useState} from "react";
import {validate_address} from "../../lib/validate_address";
import axios from "axios";
import _ from "lodash";
import {CheckIcon, DotsHorizontalIcon} from "@heroicons/react/solid";

export default function Address() {
    const [address, setAddress] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("address") || ''
        }
        return ''
    })
    const [addressValidated, setAddressValidated] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = async function handleChange(e) {
        const inputAdress = _.trim(e.target.value)
        let computedAdress = ''

        if (validate_address(inputAdress)) {
            computedAdress = inputAdress
        } else {
            try {
                setLoading(true)
                const res = await axios({
                    method: 'get',
                    url: `https://api.elrond.com/usernames/${inputAdress}`,
                    timeout: 1000
                })
                if (validate_address(res.data.address)) {
                    computedAdress = res.data.address
                }
            } catch (e) {

            } finally {
                setLoading(false)
            }
        }

        setAddress(computedAdress)
    }

    useEffect(() => {
        localStorage.setItem("address", address);
        setAddressValidated(address && address !== '')
    }, [address])

    return (
        <div>
            <form className="flex space-x-4 mx-auto">
                <label className={"relative bg-grey-400 text-lg border-0 text-white h-16 rounded-lg w-5/6"}>
                    <div className="absolute pointer-events-none right-3 w-10 h-10 top-1/2 transform -translate-y-1/2">
                        {
                            loading ? <DotsHorizontalIcon className="h-10 w-10 animate-blink text-grey-200" /> : (addressValidated ? <CheckIcon className="h-10 w-10 text-green-100" /> : '')
                        }
                    </div>
                    <input
                        type={"text"}
                        defaultValue={address}
                        className="form-input p-4 bg-grey-400 text-lg border-0 text-white h-16 rounded-lg w-full"
                        onChange={ handleChange }
                        placeholder="address or herotag"
                        autoComplete="off"
                        data-lpignore="true"
                    />
                </label>

                <Link href={`/accounts/${encodeURIComponent(address)}`}>
                    <button className={`btn-primary h-16 rounded-lg w-1/6 ${!addressValidated ? "disabled" : ""}`} disabled={!addressValidated} type={"submit"}>Explore</button>
                </Link>
            </form>
            <p className="max-w-screen-md mx-auto my-3 text-center">or <Link href={`/accounts/${encodeURIComponent("erd1gw7v56mecu92rvm97rxxx3djdsferczf26ee8pahxr40sx37sdgss6t7ff")}`}><button className={"btn btn-sm"}>use demo address</button></Link></p>
        </div>
    )
}