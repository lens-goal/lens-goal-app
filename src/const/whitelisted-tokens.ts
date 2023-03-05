import { Address } from "../types/types"

export interface WhiteListedToken {
    address: Address,
    name: string,
    symbol: string
}

// TODO: these are MUMBAI ADDRESSES
// TODO: implement also MAINNET ADDRESSES
export const whitelistedTokens: {[key:string]:WhiteListedToken} = {
    
    'LINK': {
        address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
        name: 'Chainlink Token',
        symbol: 'LINK'
    },
    'USDC': {
        address: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
        name: 'USDC',
        symbol: 'USDC'
    },
    'DAI': {
        address: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
        name: 'DAI Stablecoin',
        symbol: 'DAI'
    },
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

export function getWhitelistedTokensByAddress(){
    return Object.values(whitelistedTokens).reduce((acc,cur)=>{
        acc[cur.address] = cur
        
        return acc
    },{} as any)
}

export const whitelistedTokensByAddress: {[key:Address]:WhiteListedToken} = getWhitelistedTokensByAddress()
