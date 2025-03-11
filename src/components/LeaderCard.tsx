
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ThumbsUp, Award, TrendingUp } from "lucide-react";
import { Leader, VOTE_COST_IN_MON, VOTE_COST_IN_WEI } from "@/lib/constants";
import { useWallet } from "@/hooks/useWallet";
import TransactionModal from "./TransactionModal";

interface LeaderCardProps {
  leader: Leader;
  onVote: (leaderId: number) => void;
}

export default function LeaderCard({ leader, onVote }: LeaderCardProps) {
  const [walletState, walletActions] = useWallet();
  const { isConnected, isCorrectNetwork } = walletState;
  const { connect, sendTransaction } = walletActions;
  
  const [isVoting, setIsVoting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Function to handle the vote button click
  const handleVoteClick = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    
    if (!isCorrectNetwork) {
      toast.error("Please switch to Monad Testnet to vote");
      return;
    }
    
    // Start voting process
    setIsVoting(true);
    
    try {
      // This should be the contract address in a real app
      // For now we'll send to a dummy address
      const receivingAddress = "0x000000000000000000000000000000000000dEaD";
      
      // Send the transaction
      const hash = await sendTransaction(receivingAddress, VOTE_COST_IN_WEI);
      
      if (hash) {
        setTxHash(hash);
        setShowModal(true);
        
        // Update the vote count
        onVote(leader.id);
        
        toast.success("Vote submitted successfully!");
      }
    } catch (error) {
      toast.error("Failed to submit vote. Please try again.");
      console.error("Voting error:", error);
    } finally {
      setIsVoting(false);
    }
  };
  
  // Get country flag URL
  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
  };

  return (
    <>
      <Card className="crypto-card h-[340px] hover:translate-y-[-5px]">
        <div className="relative w-full pt-[65%]">
          {/* Country flag */}
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center gap-1 bg-background/80 dark:bg-dark-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
              <img 
                src={getFlagUrl(leader.countryCode)} 
                alt={`${leader.country} flag`} 
                className="w-4 h-auto"
              />
              <span className="text-xs font-medium">{leader.country}</span>
            </div>
          </div>
          
          {/* Leader image */}
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <img 
              src={leader.imgSrc} 
              alt={leader.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base mb-1">{leader.name}</h3>
            <div className="flex items-center bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1 text-primary" />
              <span className="text-xs font-semibold">{leader.votes}</span>
            </div>
          </div>
          
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1 text-crypto-yellow dark:text-crypto-yellow" />
              <span className="text-xs text-muted-foreground">Rank #{leader.id}</span>
            </div>
            
            <Button 
              onClick={handleVoteClick}
              disabled={isVoting}
              size="sm"
              className="h-8 text-xs"
            >
              {isVoting ? (
                "Voting..."
              ) : (
                <>Vote ({VOTE_COST_IN_MON} MON)</>
              )}
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Transaction Modal */}
      {txHash && (
        <TransactionModal
          open={showModal}
          onOpenChange={setShowModal}
          txHash={txHash}
          leaderName={leader.name}
        />
      )}
    </>
  );
}
