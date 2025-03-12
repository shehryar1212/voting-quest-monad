
import { useMemo } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Trophy, Medal, TrendingUp } from "lucide-react";
import { Leader } from "@/lib/constants";

interface LeaderboardProps {
  leaders: Leader[];
}

export default function Leaderboard({ leaders }: LeaderboardProps) {
  // Sort leaders by votes in descending order
  const sortedLeaders = useMemo(() => {
    return [...leaders].sort((a, b) => b.votes - a.votes);
  }, [leaders]);

  // Take only top 5 for the leaderboard
  const topLeaders = sortedLeaders.slice(0, 5);
  
  // Get country flag URL
  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  // Get medal color based on position
  const getMedalColor = (position: number) => {
    switch (position) {
      case 0:
        return "text-crypto-yellow"; // Gold
      case 1:
        return "text-gray-300"; // Silver
      case 2:
        return "text-amber-600"; // Bronze
      default:
        return "text-gray-400"; // Other positions
    }
  };

  // Get icon based on position
  const getMedalIcon = (position: number) => {
    if (position === 0) {
      return <Trophy className={`h-4 w-4 ${getMedalColor(position)}`} />;
    }
    return <Medal className={`h-4 w-4 ${getMedalColor(position)}`} />;
  };

  return (
    <Card className="glass-effect w-full">
      <CardHeader className="pb-2 p-4">
        <CardTitle className="text-base flex items-center">
          <TrendingUp className="mr-2 h-4 w-4 text-primary" /> 
          Look who's winning...
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {topLeaders.map((leader, index) => (
            <div 
              key={leader.id}
              className="flex items-center justify-between p-2 rounded-lg bg-background/60 dark:bg-dark-highlight/30 backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6">
                  {getMedalIcon(index)}
                </div>
                <div className="ml-2 flex items-center">
                  <img 
                    src={getFlagUrl(leader.countryCode)} 
                    alt={`${leader.country} flag`}
                    className="w-4 h-auto mr-1"
                  />
                  <span className="text-xs font-medium">{leader.name}</span>
                </div>
              </div>
              <div className="flex items-center bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-full">
                <span className="text-xs font-semibold">{leader.votes}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
