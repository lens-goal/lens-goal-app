import { Address } from "../types/types"

export interface WhiteListedToken {
    address: Address,
    name: string,
    symbol: string
}

export const whitelistedTokens: {[key:string]:WhiteListedToken} = {
    
    'LINK': {
        address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
        name: 'Chainlink Token',
        symbol: 'LINK'
    },
    'USDC': {
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        name: 'USDC',
        symbol: 'USDC'
    },
    'DAI': {
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        name: 'DAI Stablecoin',
        symbol: 'DAI'
    },
    'ABC': {
        address: '0x9AFA555d4c42f3070baf77bdE27bd833D5383593',
        name: 'ABCToken',
        symbol: "ABC"
    },
}

export function getWhitelistedTokensByAddress(){
    return Object.values(whitelistedTokens).reduce((acc,cur)=>{
        acc[cur.address] = cur
        
        return acc
    },{} as any)
}

export const whitelistedTokensByAddress: {[key:Address]:WhiteListedToken} = getWhitelistedTokensByAddress()
