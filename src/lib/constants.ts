
// Network constants
export const MONAD_TESTNET_CHAIN_ID = "0x27af";  // 10143 decimal (lowercase hex)
export const MONAD_TESTNET_CHAIN_ID_DECIMAL = 10143;
export const MONAD_TESTNET_RPC_URL = "https://testnet-rpc.monad.xyz";
export const MON_DECIMAL_PLACES = 18;

// Vote constants
export const VOTE_COST_IN_MON = 0.0001;
export const VOTE_COST_IN_WEI = BigInt(Math.floor(VOTE_COST_IN_MON * 10**MON_DECIMAL_PLACES)); // 10^14 wei (0.0001 MON)

// Leaders data
export type Leader = {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  imgSrc: string;
  votes: number;
};

export const LEADERS: Leader[] = [
  { 
    id: 1, 
    name: "Satoshi Nakamoto", 
    country: "Japan",
    countryCode: "jp",
    imgSrc: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1374",
    votes: 214
  },
  { 
    id: 2, 
    name: "Vitalik Buterin", 
    country: "Russia",
    countryCode: "ru",
    imgSrc: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1374",
    votes: 189
  },
  { 
    id: 3, 
    name: "Charles Hoskinson", 
    country: "United States",
    countryCode: "us",
    imgSrc: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1374",
    votes: 143
  },
  { 
    id: 4, 
    name: "Gavin Wood", 
    country: "United Kingdom",
    countryCode: "gb",
    imgSrc: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1374",
    votes: 128
  },
  { 
    id: 5, 
    name: "Silvio Micali", 
    country: "Italy",
    countryCode: "it",
    imgSrc: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1374",
    votes: 117
  },
  { 
    id: 6, 
    name: "Arthur Breitman", 
    country: "France",
    countryCode: "fr",
    imgSrc: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1374",
    votes: 92
  },
  { 
    id: 7, 
    name: "Jae Kwon", 
    country: "South Korea",
    countryCode: "kr",
    imgSrc: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1374",
    votes: 87
  },
  { 
    id: 8, 
    name: "Joseph Lubin", 
    country: "Canada",
    countryCode: "ca",
    imgSrc: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1374",
    votes: 74
  },
  { 
    id: 9, 
    name: "Da Hongfei", 
    country: "China",
    countryCode: "cn",
    imgSrc: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1374",
    votes: 69
  }
];

// Monad network parameters for wallet connection
export const MONAD_NETWORK_PARAMS = {
  chainId: MONAD_TESTNET_CHAIN_ID,
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: MON_DECIMAL_PLACES,
  },
  rpcUrls: [MONAD_TESTNET_RPC_URL],
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
};
