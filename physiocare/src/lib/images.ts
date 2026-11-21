// Fotos de stock (Unsplash, licencia libre). Se sustituyen por fotos reales de Erik.
const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMG = {
  hero: u("1599058917212-d750089bc07e", 1800),
  heroAlt: u("1581009146145-b5ef050c2e1e", 1400),
  manual: u("1519823551278-64ac92734fb1"),
  manualBw: u("1591343395082-e120087004b4"),
  barbell: u("1517836357463-d25dfeac3438"),
  stretch: u("1571019613454-1cb2f99b2d8b"),
  yoga: u("1544367567-0f2fcb009e0b"),
  runners: u("1552674605-db6ffd4facb5"),
  pullup: u("1526506118085-60ce8714f8c5"),
  pilates: u("1518611012118-696072aa579a"),
  rackWoman: u("1541534741688-6078c6bfb5c5"),
  rope: u("1434596922112-19c563067271"),
  sunrise: u("1594882645126-14020914d58d"),
  care: u("1584515933487-779824d29309"),
  gym: u("1597452485669-2c7bb5fef90d"),
};
