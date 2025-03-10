
import { useMemo } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
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
        return "text-yellow-400"; // Gold
      case 1:
        return "text-gray-400"; // Silver
      case 2:
        return "text-amber-700"; // Bronze
      default:
        return "text-gray-300"; // Other positions
    }
  };

  // Get icon based on position
  const getMedalIcon = (position: number) => {
    if (position === 0) {
      return <Trophy className={`h-5 w-5 ${getMedalColor(position)}`} />;
    }
    return <Medal className={`h-5 w-5 ${getMedalColor(position)}`} />;
  };

  return (
    <Card className="glass-effect w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> 
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topLeaders.map((leader, index) => (
            <div 
              key={leader.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/60 backdrop-blur-sm animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6">
                  {getMedalIcon(index)}
                </div>
                <div className="ml-3 flex items-center">
                  <img 
                    src={getFlagUrl(leader.countryCode)} 
                    alt={`${leader.country} flag`}
                    className="w-5 h-auto mr-2"
                  />
                  <span className="font-medium">{leader.name}</span>
                </div>
              </div>
              <div className="flex items-center bg-monad/10 px-2 py-1 rounded-full">
                <span className="text-sm font-semibold">{leader.votes}</span>
                <span className="text-xs ml-1 text-muted-foreground">votes</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
