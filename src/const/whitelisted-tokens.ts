import { Address } from "../types/types"

export interface WhiteListedToken {
    address: Address,
    name: string,
    symbol: string
}

export const whitelistedTokens: {[key:string]:WhiteListedToken} = {
    'ABC': {
        address: '0x294210dDbC38114dD6EE4959B797A0D2171f220b',
        name: 'ABCToken',
        symbol: "ABC"
    },
    'DEF': {
        address: '0x90508B34EfBdBe4FcAD51EA8e1167cb6e9dCc575',
        name: 'DEFToken',
        symbol: "DEF"
    },
}

export const whitelistedTokensByAddress: {[key:Address]:WhiteListedToken} = {
    '0x294210dDbC38114dD6EE4959B797A0D2171f220b': {
        address: '0x294210dDbC38114dD6EE4959B797A0D2171f220b',
        name: 'ABCToken',
        symbol: "ABC"
    },
    '0x90508B34EfBdBe4FcAD51EA8e1167cb6e9dCc575': {
        address: '0x90508B34EfBdBe4FcAD51EA8e1167cb6e9dCc575',
        name: 'DEFToken',
        symbol: "DEF"
    },
}