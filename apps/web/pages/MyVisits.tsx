import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, TrendingUp, ChefHat, Clock } from "lucide-react";
import { DataService } from "@/lib/data";
import { UserRestaurantStats } from "@fusion/shared/types";
import { formatDistanceToNow } from "date-fns";

export default function MyVisits() {
  const [visitStats, setVisitStats] = useState<UserRestaurantStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null);

  useEffect(() => {
    (async () => {
      const me = await DataService.getCurrentUser();
      setUser(me);
      if (me) {
        await loadVisitStats();
      } else {
        setLoading(false);
      }
    })();
  }, []);

  const loadVisitStats = async () => {
    try {
      const stats = await DataService.getUserVisits();
      setVisitStats(stats);
    } catch (error) {
      console.error("Error loading visit stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalVisits = visitStats.reduce(
    (sum, stat) => sum + stat.visitCount,
    0,
  );
  const uniqueRestaurants = visitStats.length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12 ramen-card">
          <h2 className="text-2xl font-bold mb-2">Sign in to view your visits</h2>
          <p className="text-muted-foreground mb-6">Your ramen journey is saved to your account.</p>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  if (visitStats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No visits yet!</h2>
          <p className="text-muted-foreground mb-6">
            Start your ramen journey by checking in to your first restaurant.
          </p>
          <Button asChild>
            <a href="/">Discover Restaurants</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Ramen Journey</h1>
        <p className="text-muted-foreground">
          Track your visits and discover your favorites
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="ramen-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 rounded-full p-2">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalVisits}</p>
                <p className="text-sm text-muted-foreground">Total Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ramen-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-accent/10 rounded-full p-2">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{uniqueRestaurants}</p>
                <p className="text-sm text-muted-foreground">
                  Restaurants Visited
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="ramen-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 rounded-full p-2">
                <ChefHat className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {visitStats.length > 0 ? visitStats[0].restaurant.name : "-"}
                </p>
                <p className="text-sm text-muted-foreground">Favorite Spot</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visit History */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Visit History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visitStats.map((stat) => (
            <Card
              key={stat.restaurant.id}
              className="ramen-card group hover:shadow-lg transition-shadow"
            >
              <div className="h-40 bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden rounded-t-lg">
                {stat.restaurant.image && (
                  <img
                    src={stat.restaurant.image}
                    alt={stat.restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-primary border-0 font-bold">
                    {stat.visitCount} visits
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg leading-tight">
                    {stat.restaurant.name}
                  </h3>
                  {stat.restaurant.cuisine && (
                    <Badge variant="secondary" className="text-xs ml-2">
                      {stat.restaurant.cuisine}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{stat.restaurant.address}</span>
                </p>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      Last visit:{" "}
                      {formatDistanceToNow(stat.lastVisit, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      First visit:{" "}
                      {formatDistanceToNow(stat.firstVisit, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Visit frequency</span>
                    <span className="text-xs text-muted-foreground">
                      {stat.visitCount}/10
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((stat.visitCount / 10) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
        <h3 className="text-xl font-bold mb-2">
          Ready for your next ramen adventure?
        </h3>
        <p className="text-muted-foreground mb-4">
          Discover new restaurants and continue building your ramen journey.
        </p>
        <Button asChild>
          <a href="/">Explore Restaurants</a>
        </Button>
      </div>
    </div>
  );
}
