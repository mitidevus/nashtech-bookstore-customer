export type RatingReview = {
  id: number;
  star: number;
  title: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
};

export type RatingCount = {
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
};
