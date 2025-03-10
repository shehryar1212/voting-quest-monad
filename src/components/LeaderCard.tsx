
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ThumbsUp } from "lucide-react";
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
      <Card className="flex flex-col overflow-hidden leader-card hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative w-full pt-[100%]">
          {/* Country flag */}
          <div className="absolute top-2 right-2 z-10">
            <img 
              src={getFlagUrl(leader.countryCode)} 
              alt={`${leader.country} flag`} 
              className="w-8 h-auto rounded shadow-sm"
            />
          </div>
          
          {/* Leader image */}
          <div className="absolute inset-0 bg-gray-100 overflow-hidden">
            <img 
              src={leader.imgSrc} 
              alt={leader.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-lg mb-1">{leader.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{leader.country}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center">
              <ThumbsUp className="w-4 h-4 mr-2 text-monad" />
              <span className="font-medium">{leader.votes}</span>
            </div>
            
            <Button 
              onClick={handleVoteClick}
              disabled={isVoting}
              size="sm"
              className="transition-all duration-300 hover:scale-105"
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
