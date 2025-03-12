
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, LogOut } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { MONAD_TESTNET_CHAIN_ID, MONAD_TESTNET_CHAIN_ID_DECIMAL } from "@/lib/constants";

export function WalletButton() {
  const [walletState, walletActions] = useWallet();
  const { address, balance, chainId, isConnected, isCorrectNetwork } = walletState;
  const { connect, disconnect, switchToMonadNetwork } = walletActions;
  
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    await connect();
    setIsLoading(false);
  };

  const handleSwitchNetwork = async () => {
    setIsLoading(true);
    await switchToMonadNetwork();
    setIsLoading(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setDialogOpen(false);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const buttonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      );
    }

    if (!isConnected) {
      return (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      );
    }

    if (!isCorrectNetwork) {
      return (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Switch to Monad
        </>
      );
    }

    return (
      <>
        <Wallet className="mr-2 h-4 w-4" />
        {formatAddress(address)}
      </>
    );
  };

  return (
    <>
      {!isConnected ? (
        <Button 
          onClick={handleConnect} 
          disabled={isLoading} 
          className="rounded-full hidden md:flex"
          size="lg"
        >
          {buttonContent()}
        </Button>
      ) : !isCorrectNetwork ? (
        <Button 
          onClick={handleSwitchNetwork} 
          disabled={isLoading} 
          variant="secondary" 
          className="rounded-full hidden md:flex"
          size="lg"
        >
          {buttonContent()}
        </Button>
      ) : (
        <div className="flex gap-2 hidden md:flex">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDisconnect}
            className="rounded-full neo-effect bg-white hover:bg-neutral-50"
            title="Disconnect wallet"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Disconnect wallet</span>
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="rounded-full neo-effect bg-white hover:bg-neutral-50" 
                size="lg"
              >
                {buttonContent()}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glass-effect">
              <DialogHeader>
                <DialogTitle>Wallet Connected</DialogTitle>
                <DialogDescription>
                  Your wallet is currently connected to the application.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-2 text-center items-center">
                  <span className="text-xs text-gray-500">Your Address</span>
                  <code className="bg-secondary px-2 py-1 rounded text-sm font-mono">
                    {address}
                  </code>
                </div>
                <div className="flex flex-col space-y-2 text-center items-center">
                  <span className="text-xs text-gray-500">Balance</span>
                  <div className="text-xl font-semibold flex items-center">
                    {balance} <span className="ml-1 text-sm">MON</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 text-center items-center">
                  <span className="text-xs text-gray-500">Network</span>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${isCorrectNetwork ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    {isCorrectNetwork ? 'Monad Testnet' : 'Wrong Network'}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
