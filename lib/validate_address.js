import { Address } from "@elrondnetwork/erdjs";

export function validate_address(address) {
    try {
        new Address(address)
    } catch (err) {
        return false
    }
    return true
}
