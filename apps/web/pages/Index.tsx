import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  MapPin,
  Clock,
  ChefHat,
  TrendingUp,
  Users,
  CheckCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { DataService } from "@/lib/data";
import { Restaurant, RestaurantRanking } from "@fusion/shared/types";
import { toast } from "sonner";

export default function Index() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [topRankings, setTopRankings] = useState<RestaurantRanking[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [checkInNotes, setCheckInNotes] = useState("");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [restaurantData, rankingData] = await Promise.all([
        DataService.getRestaurants(),
        DataService.getTopRankings(),
      ]);
      setRestaurants(restaurantData);
      setTopRankings(rankingData.slice(0, 3)); // Show top 3 on homepage
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedRestaurant) return;

    setIsCheckingIn(true);
    try {
      await DataService.checkInToRestaurant(
        selectedRestaurant.id,
        checkInNotes,
        checkInDate,
      );
      toast.success(`Successfully checked in to ${selectedRestaurant.name}!`);
      setDialogOpen(false);
      setCheckInNotes("");
      setSelectedRestaurant(null);
      setCheckInDate(new Date());
      // Reload rankings to show updated data
      loadData();
    } catch (error) {
      toast.error("Failed to check in. Please try again.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="ramen-gradient text-white rounded-2xl p-8 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Track Your Ramen Journey
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Discover amazing ramen restaurants, check in to your favorites, and
            see what's trending in the ramen community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Check In</h3>
            <p className="text-sm text-muted-foreground">
              Record your visits to track your ramen journey
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Track Stats</h3>
            <p className="text-sm text-muted-foreground">
              See your visit counts and favorite spots
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-muted-foreground">
              Discover the most popular ramen spots
            </p>
          </div>
        </div>
      </div>

      {/* Top Ramen Spots Preview */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">🏆 Top Ramen Spots</h2>
            <p className="text-muted-foreground">
              Most visited restaurants this month
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/rankings">View All Rankings</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRankings.map((ranking, index) => (
            <Card
              key={ranking.restaurant.id}
              className="ramen-card relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 z-10">
                <Badge
                  className={`text-white ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                        ? "bg-gray-400"
                        : "bg-amber-600"
                  }`}
                >
                  #{ranking.rank}
                </Badge>
              </div>
              <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20 relative">
                {ranking.restaurant.image && (
                  <img
                    src={ranking.restaurant.image}
                    alt={ranking.restaurant.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">
                  {ranking.restaurant.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {ranking.restaurant.address}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {ranking.totalVisits} visits
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    {ranking.uniqueVisitors} users
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Check In Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">🍜 Check In to a Restaurant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="ramen-card group cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="h-48 bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden rounded-t-lg">
                {restaurant.image && (
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  {restaurant.cuisine && (
                    <Badge variant="secondary" className="text-xs">
                      {restaurant.cuisine}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {restaurant.address}
                </p>

                <Dialog
                  open={dialogOpen && selectedRestaurant?.id === restaurant.id}
                  onOpenChange={setDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      onClick={() => setSelectedRestaurant(restaurant)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check In
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-primary" />
                        Check in to {restaurant.name}
                      </DialogTitle>
                      <DialogDescription>
                        Record your visit and add any notes about your
                        experience.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="ramen-card p-4">
                        <h4 className="font-semibold">{restaurant.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {restaurant.address}
                        </p>
                        {restaurant.cuisine && (
                          <Badge variant="outline" className="mt-2">
                            {restaurant.cuisine}
                          </Badge>
                        )}
                      </div>
                      <div className="grid gap-4">
                        <div className="grid gap-1">
                          <label className="text-sm font-medium">
                            Visit date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkInDate
                                  ? format(checkInDate, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={checkInDate}
                                onSelect={setCheckInDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Notes (optional)
                          </label>
                          <Textarea
                            placeholder="How was the ramen? Any recommendations?"
                            value={checkInNotes}
                            onChange={(e) => setCheckInNotes(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCheckIn}
                          disabled={isCheckingIn}
                          className="flex-1"
                        >
                          {isCheckingIn ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Checking In...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Check In
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setDialogOpen(false);
                            setCheckInNotes("");
                            setSelectedRestaurant(null);
                            setCheckInDate(new Date());
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
