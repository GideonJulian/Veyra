import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Bell, Star, ChevronDown } from "lucide-react-native";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

interface ReviewSummary {
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const ReviewsScreen = ({ navigation, route }: any) => {
  const productId = route?.params?.productId || "1";

  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchReviewsData();
  }, [productId]);

  const fetchReviewsData = async () => {
    try {
      setLoading(true);
      // API ENDPOINT PLACEHOLDER:
      // const res = await fetch(`https://api.yourdomain.com/products/${productId}/reviews`);
      // const data = await res.json();

      // Mocked Response matching image design
      const mockSummary: ReviewSummary = {
        averageRating: 4.0,
        totalRatings: 1034,
        totalReviews: 45,
        ratingDistribution: {
          5: 65,
          4: 40,
          3: 20,
          2: 12,
          1: 5,
        },
      };

      const mockReviews: ReviewItem[] = [
        {
          id: "r1",
          rating: 5,
          comment:
            "The item is very good, my son likes it very much and plays every day.",
          author: "Wade Warren",
          date: "6 days ago",
        },
        {
          id: "r2",
          rating: 4,
          comment:
            "The seller is very fast in sending packet, I just bought it and the item arrived in just 1 day!",
          author: "Guy Hawkins",
          date: "1 week ago",
        },
        {
          id: "r3",
          rating: 4,
          comment:
            "I just bought it and the stuff is really good! I highly recommend it!",
          author: "Robert Fox",
          date: "2 weeks ago",
        },
      ];

      setSummary(mockSummary);
      setReviews(mockReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, max: number = 5) => {
    return (
      <View style={styles.starsRow}>
        {Array.from({ length: max }).map((_, idx) => (
          <Star
            key={idx}
            size={16}
            color={idx < rating ? "#F59E0B" : "#E5E7EB"}
            fill={idx < rating ? "#F59E0B" : "#E5E7EB"}
          />
        ))}
      </View>
    );
  };

  if (loading || !summary) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation?.goBack()}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Rating Overview Section */}
        <View style={styles.ratingOverviewRow}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {summary.averageRating.toFixed(1)}
            </Text>
            {renderStars(Math.round(summary.averageRating))}
            <Text style={styles.totalRatingsText}>
              {summary.totalRatings} Ratings
            </Text>
          </View>

          {/* Breakdown Bars */}
          <View style={styles.breakdownContainer}>
            {[5, 4, 3, 2, 1].map((starKey) => {
              const count =
                summary.ratingDistribution[
                  starKey as keyof typeof summary.ratingDistribution
                ] || 0;
              const percentage = Math.min((count / 80) * 100, 100);

              return (
                <View key={starKey} style={styles.barRow}>
                  <View style={styles.miniStars}>
                    {renderStars(starKey)}
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[styles.barFill, { width: `${percentage}%` }]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Filter / Sort Bar */}
        <View style={styles.reviewsHeaderRow}>
          <Text style={styles.reviewsCountTitle}>
            {summary.totalReviews} Reviews
          </Text>
          <TouchableOpacity style={styles.sortSelector} activeOpacity={0.7}>
            <Text style={styles.sortText}>Most Relevant</Text>
            <ChevronDown size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Reviews List */}
        {reviews.map((item) => (
          <View key={item.id} style={styles.reviewCard}>
            {renderStars(item.rating)}
            <Text style={styles.commentText}>{item.comment}</Text>
            <Text style={styles.metaText}>
              <Text style={styles.authorText}>{item.author}</Text> • {item.date}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  iconButton: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  ratingOverviewRow: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 20,
    gap: 16,
  },
  scoreContainer: {
    alignItems: "flex-start",
  },
  scoreText: {
    fontSize: 48,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 52,
  },
  totalRatingsText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 6,
  },
  starsRow: {
    flexDirection: "row",
    gap: 3,
  },
  breakdownContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniStars: {
    width: 90,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },
  reviewsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  reviewsCountTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  sortSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  reviewCard: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 10,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#9CA3AF",
  },
  metaText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  authorText: {
    fontWeight: "700",
    color: "#111827",
  },
});

export default ReviewsScreen;