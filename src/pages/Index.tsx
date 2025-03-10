
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/WalletButton";
import LeaderCard from "@/components/LeaderCard";
import Leaderboard from "@/components/Leaderboard";
import { LEADERS } from "@/lib/constants";
import { useWallet } from "@/hooks/useWallet";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, index) => (
        <div 
          key={index} 
          className="animate-pulse rounded-lg overflow-hidden bg-gray-100 h-[400px]"
        >
          <div className="w-full h-[250px] bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="pt-4 flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-monad-dark via-monad to-blue-400">
            Blockchain Leader Voting
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Vote for your favorite blockchain leaders using Monad testnet. Each vote costs 0.0001 MON.
          </p>
        </div>
        
        <WalletButton />
      </header>
      
      <main className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
          {/* Main Content - Leader Cards */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Leaders</h2>
              <Button
                variant="outline"
                onClick={sortLeaders}
                className="text-sm"
              >
                Sort by {sortedBy === "default" ? "ID" : "Votes"} ↓
              </Button>
            </div>
            
            {isLoading ? (
              renderSkeleton()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
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
          <div className="md:col-span-1 lg:col-span-1 space-y-6">
            <Leaderboard leaders={leaders} />
            
            {!isConnected && (
              <div className="glass-effect p-6 rounded-lg text-center space-y-4 animate-float">
                <h3 className="font-medium">Ready to Vote?</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to start voting for your favorite blockchain leaders.
                </p>
                <WalletButton />
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built on the Monad testnet. For demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
