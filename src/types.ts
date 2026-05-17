export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;  // matches Supabase column name (first image, backward compat)
  image_urls?: string[]; // multiple images
  stock: number;
  redeem_discount_percent: number | null;
  redeem_coins_required: number | null;
  max_redeemable_points?: number | null;
}

export interface Submission {
  id: string;
  userId: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}
