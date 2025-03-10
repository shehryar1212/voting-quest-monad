
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { VOTE_COST_IN_MON } from "@/lib/constants";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  txHash: string;
  leaderName: string;
}

export default function TransactionModal({ 
  open, 
  onOpenChange, 
  txHash, 
  leaderName 
}: TransactionModalProps) {
  const truncateTxHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto my-2 bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-center">Vote Confirmed!</DialogTitle>
          <DialogDescription className="text-center">
            You successfully voted for {leaderName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col space-y-1 items-center justify-center text-center">
            <span className="text-sm text-muted-foreground">Amount</span>
            <div className="text-2xl font-bold">{VOTE_COST_IN_MON} MON</div>
          </div>
          
          <div className="flex flex-col space-y-1 items-center justify-center text-center">
            <span className="text-sm text-muted-foreground">Transaction ID</span>
            <div className="bg-secondary/60 px-3 py-1 rounded text-sm font-mono">
              {truncateTxHash(txHash)}
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground px-6">
            Your vote has been recorded on the Monad blockchain. Thank you for participating!
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
