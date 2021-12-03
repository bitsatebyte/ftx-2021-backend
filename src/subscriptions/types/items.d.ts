export type Item = {
  name: string;
  quantity: number;
};

export type Items = {
  restaurant: string;
  list: Record<number, Item>;
  total: number;
};
