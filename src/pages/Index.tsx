
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/WalletButton";
import LeaderCard from "@/components/LeaderCard";
import Leaderboard from "@/components/Leaderboard";
import { LEADERS } from "@/lib/constants";
import { useWallet } from "@/hooks/useWallet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Coins } from "lucide-react";

const Index = () => {
  const [walletState] = useWallet();
  const { isConnected } = walletState;
  
  const [leaders, setLeaders] = useState(LEADERS);
  const [sortedBy, setSortedBy] = useState<"default" | "votes">("default");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle voting
  const handleVote = (leaderId: number) => {
    setLeaders(prevLeaders => 
      prevLeaders.map(leader => 
        leader.id === leaderId
          ? { ...leader, votes: leader.votes + 1 }
          : leader
      )
    );
  };

  // Sort leaders
  const sortLeaders = () => {
    if (sortedBy === "default") {
      setSortedBy("votes");
      setLeaders([...leaders].sort((a, b) => b.votes - a.votes));
    } else {
      setSortedBy("default");
      setLeaders([...leaders].sort((a, b) => a.id - b.id));
    }
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div 
          key={index} 
          className="animate-pulse rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 h-[340px]"
        >
          <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="pt-2 flex justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 dark:from-dark-background dark:to-dark-card/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 flex items-center">
          <Coins className="h-6 w-6 text-primary mr-2" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-monad-dark via-monad to-blue-400">
              Monad Leaders
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Vote for your OGs.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <WalletButton />
        </div>
        
        {/* Mobile "Ready to Vote" section */}
        {!isConnected && (
          <div className="md:hidden w-full glass-effect p-4 rounded-lg text-center space-y-3 animate-float mt-4">
            <h3 className="font-medium text-sm">Ready to Vote?</h3>
            <p className="text-xs text-muted-foreground">
              Connect your wallet to start voting for your favorite blockchain leaders.
            </p>
            <WalletButton />
          </div>
        )}
      </header>
      
      <main className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-4 gap-4 mt-4">
          {/* Main Content - Leader Cards */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Blockchain Leaders</h2>
              <Button
                variant="outline"
                onClick={sortLeaders}
                size="sm"
                className="text-xs"
              >
                Sort by {sortedBy === "default" ? "ID" : "Votes"} ↓
              </Button>
            </div>
            
            {isLoading ? (
              renderSkeleton()
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
                {leaders.map(leader => (
                  <LeaderCard 
                    key={leader.id} 
                    leader={leader} 
                    onVote={handleVote} 
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar - Leaderboard */}
          <div className="md:col-span-1 space-y-4">
            <Leaderboard leaders={leaders} />
            
            {/* Desktop "Ready to Vote" section */}
            {/* {!isConnected && (
              <div className="hidden md:block glass-effect p-4 rounded-lg text-center space-y-3 animate-float">
                <h3 className="font-medium text-sm">Ready to Vote?</h3>
                <p className="text-xs text-muted-foreground">
                  Connect your wallet to start voting for your favorite blockchain leaders.
                </p>
                <WalletButton />
              </div>
            )} */}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 border-t dark:border-dark-border bg-white/50 dark:bg-dark-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>Built on the Monad testnet. For demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
