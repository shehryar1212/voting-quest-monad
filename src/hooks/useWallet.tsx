
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { MONAD_TESTNET_CHAIN_ID, MONAD_NETWORK_PARAMS } from "@/lib/constants";

// Define Ethereum provider interface for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: {
        method: string;
        params?: any[];
      }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener?: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
}

interface WalletState {
  address: string;
  balance: string;
  chainId: string;
  isConnected: boolean;
  isCorrectNetwork: boolean;
}

interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToMonadNetwork: () => Promise<boolean>;
  sendTransaction: (to: string, value: bigint) => Promise<string | null>;
}

export function useWallet(): [WalletState, WalletActions] {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [chainId, setChainId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // Check if ethereum is available
  const hasEthereum = typeof window !== "undefined" && window.ethereum;

  // Detect when account changes
  useEffect(() => {
    if (!hasEthereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        handleDisconnect();
      } else {
        setAddress(accounts[0]);
        setIsConnected(true);
        updateBalance(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(chainIdHex);
      // Reload page as recommended by MetaMask
      window.location.reload();
    };

    // Check if already connected
    window.ethereum.request({ method: "eth_accounts" })
      .then(handleAccountsChanged)
      .catch((err: Error) => {
        console.error("Failed to get accounts", err);
      });

    // Listen for account changes
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Get current chainId
    window.ethereum.request({ method: "eth_chainId" })
      .then((chainIdHex: string) => {
        setChainId(chainIdHex);
      })
      .catch(console.error);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [hasEthereum]);

  // Update balance
  const updateBalance = useCallback(async (walletAddress: string) => {
    if (!hasEthereum || !walletAddress) return;

    try {
      const balanceHex = await window.ethereum.request({
        method: "eth_getBalance",
        params: [walletAddress, "latest"],
      });
      
      // Convert balance from wei to ETH (string representation)
      const balanceInWei = BigInt(balanceHex);
      // Fix the division of bigint by number issue
      const balanceInEth = Number(balanceInWei) / 10**18;
      setBalance(balanceInEth.toString());
    } catch (error) {
      console.error("Failed to get balance", error);
    }
  }, [hasEthereum]);

  // Auto-update the balance when the address or chainId changes
  useEffect(() => {
    if (address) {
      updateBalance(address);
      
      // Setup timer to refresh balance every 30 seconds
      const intervalId = setInterval(() => {
        updateBalance(address);
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [address, chainId, updateBalance]);

  // Connect wallet
  const connect = async () => {
    if (!hasEthereum) {
      toast.error("No Ethereum wallet found. Please install MetaMask or another compatible wallet.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        updateBalance(accounts[0]);
        
        // Check if we're on the correct network
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        
        setChainId(currentChainId);
        
        if (currentChainId !== MONAD_TESTNET_CHAIN_ID) {
          const switched = await switchToMonadNetwork();
          if (!switched) {
            toast.warning("Please switch to the Monad Testnet to use this app.", {
              duration: 5000,
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to connect to wallet", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  // Disconnect wallet (local state only - doesn't actually disconnect the wallet)
  const handleDisconnect = () => {
    setAddress("");
    setBalance("0");
    setIsConnected(false);
  };

  // Switch to Monad network
  const switchToMonadNetwork = async (): Promise<boolean> => {
    if (!hasEthereum) return false;

    try {
      // First try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET_CHAIN_ID }],
      });
      return true;
    } catch (switchError: any) {
      // If the network doesn't exist in the wallet, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [MONAD_NETWORK_PARAMS],
          });
          return true;
        } catch (addError) {
          console.error("Failed to add Monad network", addError);
          toast.error("Failed to add Monad Testnet to your wallet. Please add it manually.");
          return false;
        }
      } else {
        console.error("Failed to switch network", switchError);
        toast.error("Failed to switch to Monad Testnet. Please try again.");
        return false;
      }
    }
  };

  // Send transaction
  const sendTransaction = async (to: string, value: bigint): Promise<string | null> => {
    if (!hasEthereum || !isConnected) {
      toast.error("Please connect your wallet first.");
      return null;
    }

    try {
      // Check network before sending
      if (chainId !== MONAD_TESTNET_CHAIN_ID) {
        const switched = await switchToMonadNetwork();
        if (!switched) {
          toast.error("Please switch to Monad Testnet to vote.");
          return null;
        }
      }

      // Send the transaction
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: address,
          to,
          value: `0x${value.toString(16)}`, // Convert to hex
          gas: "0x5208", // 21000 gas
        }],
      });

      updateBalance(address);
      return txHash;
    } catch (error: any) {
      console.error("Transaction failed", error);
      if (error.code === 4001) {
        // User rejected transaction
        toast.error("Transaction was rejected.");
      } else {
        toast.error("Transaction failed. Please try again.");
      }
      return null;
    }
  };

  return [
    {
      address,
      balance,
      chainId,
      isConnected,
      isCorrectNetwork: chainId === MONAD_TESTNET_CHAIN_ID,
    },
    {
      connect,
      disconnect: handleDisconnect,
      switchToMonadNetwork,
      sendTransaction,
    },
  ];
}
