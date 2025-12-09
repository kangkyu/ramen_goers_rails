import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  TrendingUp,
  MapPin,
  Crown,
  Medal,
  Award,
  ChefHat,
} from "lucide-react";
import { DataService } from "@/lib/data";
import { RestaurantRanking } from "@fusion/shared/types";

export default function Rankings() {
  const [rankings, setRankings] = useState<RestaurantRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      const rankingData = await DataService.getTopRankings();
      setRankings(rankingData);
    } catch (error) {
      console.error("Error loading rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-amber-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="ramen-gradient text-white rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Top Ramen Rankings
            </h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover the most visited ramen restaurants in our community
          </p>
        </div>

        {rankings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {rankings.reduce((sum, r) => sum + r.totalVisits, 0)} Total
                Visits
              </h3>
              <p className="text-sm text-muted-foreground">
                Across all top restaurants
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">
                {Math.max(...rankings.map((r) => r.uniqueVisitors))} Top
                Visitors
              </h3>
              <p className="text-sm text-muted-foreground">
                At the #1 restaurant
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {rankings[0]?.restaurant.name || "Loading..."}
              </h3>
              <p className="text-sm text-muted-foreground">Current champion</p>
            </div>
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {rankings.length >= 3 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            🏆 Champions Podium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <div className="md:order-1 transform md:translate-y-8">
              <Card className="ramen-card text-center overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 relative">
                  {rankings[1].restaurant.image && (
                    <img
                      src={rankings[1].restaurant.image}
                      alt={rankings[1].restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gray-400 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Medal className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="font-bold text-lg mb-1">
                    {rankings[1].restaurant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {rankings[1].restaurant.cuisine}
                  </p>
                  <div className="text-lg font-bold text-gray-400">
                    {rankings[1].totalVisits} visits
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 1st Place */}
            <div className="md:order-2">
              <Card className="ramen-card text-center overflow-hidden border-2 border-yellow-400 shadow-lg">
                <div className="h-56 bg-gradient-to-r from-yellow-100 to-yellow-200 relative">
                  {rankings[0].restaurant.image && (
                    <img
                      src={rankings[0].restaurant.image}
                      alt={rankings[0].restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-500 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Crown className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-bold text-xl mb-1">
                    {rankings[0].restaurant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rankings[0].restaurant.cuisine}
                  </p>
                  <div className="text-2xl font-bold text-yellow-600">
                    {rankings[0].totalVisits} visits
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 3rd Place */}
            <div className="md:order-3 transform md:translate-y-8">
              <Card className="ramen-card text-center overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-amber-100 to-amber-200 relative">
                  {rankings[2].restaurant.image && (
                    <img
                      src={rankings[2].restaurant.image}
                      alt={rankings[2].restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <h3 className="font-bold text-lg mb-1">
                    {rankings[2].restaurant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {rankings[2].restaurant.cuisine}
                  </p>
                  <div className="text-lg font-bold text-amber-600">
                    {rankings[2].totalVisits} visits
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Complete Rankings List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Complete Rankings</h2>
        <div className="space-y-4">
          {rankings.map((ranking) => (
            <Card key={ranking.restaurant.id} className="ramen-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 flex items-center space-x-3">
                    <Badge
                      className={`text-lg font-bold px-3 py-1 ${getRankBadgeColor(ranking.rank)}`}
                    >
                      #{ranking.rank}
                    </Badge>
                    {getRankIcon(ranking.rank)}
                  </div>

                  {/* Restaurant Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg overflow-hidden">
                      {ranking.restaurant.image && (
                        <img
                          src={ranking.restaurant.image}
                          alt={ranking.restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">
                          {ranking.restaurant.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {ranking.restaurant.address}
                        </p>
                        {ranking.restaurant.cuisine && (
                          <Badge variant="outline" className="mt-2">
                            {ranking.restaurant.cuisine}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 text-right space-y-2">
                    <div className="flex items-center justify-end space-x-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-bold text-lg">
                        {ranking.totalVisits}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        visits
                      </span>
                    </div>
                    <div className="flex items-center justify-end space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {ranking.uniqueVisitors} visitors
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {rankings.length === 0 && !loading && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No rankings yet!</h2>
          <p className="text-muted-foreground mb-6">
            Be the first to check in and start building the community rankings.
          </p>
          <Button asChild>
            <a href="/">Start Checking In</a>
          </Button>
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
        <h3 className="text-xl font-bold mb-2">Help shape the rankings!</h3>
        <p className="text-muted-foreground mb-4">
          Check in to your favorite ramen spots and contribute to the community
          rankings.
        </p>
        <Button asChild>
          <a href="/">Check In Now</a>
        </Button>
      </div>
    </div>
  );
}
