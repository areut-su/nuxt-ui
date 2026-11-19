export type PeriodRange = '7d' | '30d' | '90d';

export interface ChartPoint {
  label: string;
  primary: number;
  secondary: number;
}

export const AVATARS = {
  lead: '/src/assets/images/avatar_lead_engineer_1794996578721.jpg',
  director: '/src/assets/images/avatar_product_director_1794996577223.jpg',
  architect: '/src/assets/images/avatar_devops_architect_1794996579269.jpg',
};

export const REVENUE_SERIES: Record<PeriodRange, ChartPoint[]> = {
  '7d': [
    { label: 'Mon', primary: 4280, secondary: 2140 },
    { label: 'Tue', primary: 5120, secondary: 2680 },
    { label: 'Wed', primary: 4890, secondary: 2510 },
    { label: 'Thu', primary: 6430, secondary: 3290 },
    { label: 'Fri', primary: 7190, secondary: 3640 },
    { label: 'Sat', primary: 5840, secondary: 2890 },
    { label: 'Sun', primary: 6720, secondary: 3410 },
  ],
  '30d': [
    { label: 'May 01', primary: 14200, secondary: 8400 },
    { label: 'May 05', primary: 18600, secondary: 10200 },
    { label: 'May 10', primary: 16900, secondary: 9800 },
    { label: 'May 15', primary: 22400, secondary: 12900 },
    { label: 'May 20', primary: 25100, secondary: 14600 },
    { label: 'May 25', primary: 23800, secondary: 13900 },
    { label: 'May 30', primary: 29400, secondary: 16800 },
  ],
  '90d': [
    { label: 'Mar W1', primary: 41200, secondary: 24500 },
    { label: 'Mar W3', primary: 46800, secondary: 27900 },
    { label: 'Apr W1', primary: 44100, secondary: 26100 },
    { label: 'Apr W3', primary: 52900, secondary: 31400 },
    { label: 'May W1', primary: 58400, secondary: 34800 },
    { label: 'May W3', primary: 64200, secondary: 38900 },
    { label: 'Jun W1', primary: 71500, secondary: 42600 },
  ],
};

export interface TransactionRow {
  id: string;
  customer: string;
  email: string;
  plan: 'Enterprise' | 'Growth' | 'Starter';
  status: 'Paid' | 'Pending' | 'Failed';
  amount: number;
  date: string;
  region: string;
}

export const TRANSACTIONS_DATA: TransactionRow[] = [
  {
    id: 'INV-4821',
    customer: 'Olivia Martin',
    email: 'olivia.martin@northstar.io',
    plan: 'Enterprise',
    status: 'Paid',
    amount: 1999,
    date: '2026-05-28',
    region: 'United States',
  },
  {
    id: 'INV-4822',
    customer: 'Jackson Lee',
    email: 'jackson.lee@veloxcloud.dev',
    plan: 'Growth',
    status: 'Paid',
    amount: 490,
    date: '2026-05-28',
    region: 'Canada',
  },
  {
    id: 'INV-4823',
    customer: 'Isabella Nguyen',
    email: 'isabella@meridianhq.com',
    plan: 'Enterprise',
    status: 'Pending',
    amount: 2450,
    date: '2026-05-27',
    region: 'Germany',
  },
  {
    id: 'INV-4824',
    customer: 'William Kim',
    email: 'will@kinetix-ops.org',
    plan: 'Starter',
    status: 'Paid',
    amount: 99,
    date: '2026-05-27',
    region: 'United Kingdom',
  },
  {
    id: 'INV-4825',
    customer: 'Sofia Davis',
    email: 'sofia.davis@linearwave.co',
    plan: 'Growth',
    status: 'Failed',
    amount: 490,
    date: '2026-05-26',
    region: 'France',
  },
  {
    id: 'INV-4826',
    customer: 'Marcus Chen',
    email: 'm.chen@apexpay.net',
    plan: 'Enterprise',
    status: 'Paid',
    amount: 3200,
    date: '2026-05-25',
    region: 'Singapore',
  },
  {
    id: 'INV-4827',
    customer: 'Hannah Lindqvist',
    email: 'hannah@nordicgrid.se',
    plan: 'Growth',
    status: 'Pending',
    amount: 640,
    date: '2026-05-24',
    region: 'Sweden',
  },
];

export interface BlockDocumentRow {
  id: number;
  header: string;
  sectionType: 'Cover page' | 'Table of contents' | 'Narrative' | 'Technical content' | 'Executive summary';
  status: 'Done' | 'In Process' | 'Not Started';
  target: number;
  limit: number;
  reviewer: string;
  tab: 'outline' | 'performance' | 'personnel' | 'documents';
}

export const BLOCK_DOCUMENTS_DATA: BlockDocumentRow[] = [
  {
    id: 1,
    header: 'Cover page & architectural brief',
    sectionType: 'Cover page',
    status: 'In Process',
    target: 18,
    limit: 5,
    reviewer: 'Eddie Lake',
    tab: 'outline',
  },
  {
    id: 2,
    header: 'Table of contents & API index',
    sectionType: 'Table of contents',
    status: 'Done',
    target: 29,
    limit: 24,
    reviewer: 'Eddie Lake',
    tab: 'outline',
  },
  {
    id: 3,
    header: 'Executive summary Q2',
    sectionType: 'Executive summary',
    status: 'Done',
    target: 10,
    limit: 13,
    reviewer: 'Jamik Tashpulatov',
    tab: 'outline',
  },
  {
    id: 4,
    header: 'Technical approach & latency budget',
    sectionType: 'Narrative',
    status: 'Done',
    target: 27,
    limit: 23,
    reviewer: 'Jamik Tashpulatov',
    tab: 'outline',
  },
  {
    id: 5,
    header: 'Design system token specification',
    sectionType: 'Technical content',
    status: 'In Process',
    target: 22,
    limit: 16,
    reviewer: 'Emily Whalen',
    tab: 'outline',
  },
  {
    id: 6,
    header: 'System capabilities & SLA benchmarks',
    sectionType: 'Technical content',
    status: 'Done',
    target: 31,
    limit: 28,
    reviewer: 'Maya Lin',
    tab: 'performance',
  },
  {
    id: 7,
    header: 'Core engineering team allocation',
    sectionType: 'Narrative',
    status: 'In Process',
    target: 14,
    limit: 12,
    reviewer: 'Eddie Lake',
    tab: 'personnel',
  },
  {
    id: 8,
    header: 'Security & SOC2 compliance appendix',
    sectionType: 'Technical content',
    status: 'Done',
    target: 19,
    limit: 15,
    reviewer: 'Jamik Tashpulatov',
    tab: 'documents',
  },
];

export interface AdminOrderRow {
  orderId: string;
  item: string;
  status: 'Shipped' | 'Pending' | 'Delivered' | 'Processing';
  popularity: number[];
  total: number;
}

export const ADMINLTE_ORDERS: AdminOrderRow[] = [
  { orderId: 'OR9842', item: 'Call of Duty IV — Collector Box', status: 'Shipped', popularity: [42, 58, 49, 76, 84, 71, 90], total: 149.0 },
  { orderId: 'OR1848', item: 'Samsung Smart TV 55" OLED', status: 'Pending', popularity: [30, 44, 39, 51, 48, 62, 59], total: 899.0 },
  { orderId: 'OR7429', item: 'iPhone 16 Pro Max — 512GB', status: 'Delivered', popularity: [65, 72, 81, 78, 92, 88, 95], total: 1299.0 },
  { orderId: 'OR7430', item: 'ThinkPad X1 Carbon Gen 12', status: 'Processing', popularity: [50, 46, 54, 62, 58, 70, 68], total: 1849.0 },
  { orderId: 'OR9843', item: 'Keychron Q1 Pro Mechanical', status: 'Delivered', popularity: [28, 35, 42, 38, 49, 55, 61], total: 199.0 },
];

export interface InboxMessage {
  id: string;
  from: string;
  avatar: string;
  role: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
}

export const NUXT_UI_INBOX: InboxMessage[] = [
  {
    id: 'msg-1',
    from: 'Olivia Martin',
    avatar: AVATARS.lead,
    role: 'VP of Engineering · Northstar',
    subject: 'Enterprise SSO & Audit Log rollout',
    preview: 'We finished configuring SAML 2.0 on staging and need approval to switch...',
    body: 'Hi team,\n\nWe finished configuring SAML 2.0 on staging and verified group mapping across 140 seats. Please enable the production audit stream on our tenant when your release window opens.\n\nBest,\nOlivia',
    time: '14:22',
    unread: true,
  },
  {
    id: 'msg-2',
    from: 'Jackson Lee',
    avatar: AVATARS.director,
    role: 'Product Director · Velox',
    subject: 'Q2 Growth Plan seat expansion (+45 seats)',
    preview: 'Could you share the updated pro-rata invoice before Friday?',
    body: 'Hello,\n\nOur product and data science squads are onboarding next Monday. Could you share the updated pro-rata invoice for 45 additional Growth seats before Friday?\n\nThanks,\nJackson',
    time: '11:05',
    unread: true,
  },
  {
    id: 'msg-3',
    from: 'Marcus Chen',
    avatar: AVATARS.architect,
    role: 'Principal Architect · ApexPay',
    subject: 'Webhook retry policy tuning',
    preview: 'Noticed exponential backoff worked cleanly during yesterday’s spike...',
    body: 'Hey,\n\nNoticed exponential backoff worked cleanly during yesterday’s traffic spike (99.98% delivery within 4 seconds). No action needed—just confirming the telemetry looks solid.\n\nCheers,\nMarcus',
    time: 'Yesterday',
    unread: false,
  },
];

export interface GridRecord {
  id: string;
  customer: string;
  company: string;
  email: string;
  plan: 'Enterprise' | 'Growth' | 'Starter';
  status: 'Active' | 'Pending' | 'Past Due';
  region: 'North America' | 'Europe' | 'APAC';
  country: string;
  seats: number;
  mrr: number;
  updatedAt: string;
  avatar?: string;
}

export const EXTENDED_GRID_RECORDS: GridRecord[] = [
  { id: 'ACC-1001', customer: 'Olivia Martin', company: 'Northstar Systems', email: 'olivia@northstar.io', plan: 'Enterprise', status: 'Active', region: 'North America', country: 'United States', seats: 142, mrr: 2840, updatedAt: '2026-05-29', avatar: AVATARS.lead },
  { id: 'ACC-1002', customer: 'Jackson Lee', company: 'Velox Cloud', email: 'jackson@veloxcloud.dev', plan: 'Growth', status: 'Active', region: 'North America', country: 'Canada', seats: 38, mrr: 760, updatedAt: '2026-05-28', avatar: AVATARS.director },
  { id: 'ACC-1003', customer: 'Marcus Chen', company: 'ApexPay Global', email: 'm.chen@apexpay.net', plan: 'Enterprise', status: 'Active', region: 'APAC', country: 'Singapore', seats: 210, mrr: 4200, updatedAt: '2026-05-28', avatar: AVATARS.architect },
  { id: 'ACC-1004', customer: 'Isabella Nguyen', company: 'Meridian HQ', email: 'isabella@meridianhq.com', plan: 'Enterprise', status: 'Pending', region: 'Europe', country: 'Germany', seats: 95, mrr: 1900, updatedAt: '2026-05-27' },
  { id: 'ACC-1005', customer: 'William Kim', company: 'Kinetix Ops', email: 'will@kinetix-ops.org', plan: 'Starter', status: 'Active', region: 'Europe', country: 'United Kingdom', seats: 9, mrr: 180, updatedAt: '2026-05-27' },
  { id: 'ACC-1006', customer: 'Sofia Davis', company: 'LinearWave', email: 'sofia@linearwave.co', plan: 'Growth', status: 'Past Due', region: 'Europe', country: 'France', seats: 24, mrr: 480, updatedAt: '2026-05-26' },
  { id: 'ACC-1007', customer: 'Hannah Lindqvist', company: 'NordicGrid AB', email: 'hannah@nordicgrid.se', plan: 'Growth', status: 'Pending', region: 'Europe', country: 'Sweden', seats: 44, mrr: 880, updatedAt: '2026-05-26' },
  { id: 'ACC-1008', customer: 'Daniel Alvarez', company: 'Solstice AI', email: 'daniel@solstice.ai', plan: 'Enterprise', status: 'Active', region: 'North America', country: 'United States', seats: 180, mrr: 3600, updatedAt: '2026-05-25' },
  { id: 'ACC-1009', customer: 'Kenji Takahashi', company: 'Kuroda Robotics', email: 'kenji@kuroda.jp', plan: 'Enterprise', status: 'Active', region: 'APAC', country: 'Japan', seats: 120, mrr: 2400, updatedAt: '2026-05-24' },
  { id: 'ACC-1010', customer: 'Claire Moreau', company: 'HexaStudio', email: 'claire@hexastudio.fr', plan: 'Starter', status: 'Active', region: 'Europe', country: 'France', seats: 6, mrr: 120, updatedAt: '2026-05-24' },
  { id: 'ACC-1011', customer: 'Noah Patel', company: 'FinBridge Corp', email: 'noah@finbridge.co.uk', plan: 'Growth', status: 'Active', region: 'Europe', country: 'United Kingdom', seats: 52, mrr: 1040, updatedAt: '2026-05-23' },
  { id: 'ACC-1012', customer: 'Mia Sorensen', company: 'Fjord Logistics', email: 'mia@fjordlog.dk', plan: 'Growth', status: 'Pending', region: 'Europe', country: 'Denmark', seats: 31, mrr: 620, updatedAt: '2026-05-22' },
  { id: 'ACC-1013', customer: 'Ethan Brooks', company: 'Cascade Data', email: 'ethan@cascadedata.io', plan: 'Enterprise', status: 'Active', region: 'North America', country: 'United States', seats: 260, mrr: 5200, updatedAt: '2026-05-22' },
  { id: 'ACC-1014', customer: 'Priya Nair', company: 'Verve Health', email: 'priya@vervehealth.sg', plan: 'Growth', status: 'Active', region: 'APAC', country: 'Singapore', seats: 48, mrr: 960, updatedAt: '2026-05-21' },
  { id: 'ACC-1015', customer: 'Lukas Weber', company: 'Rheinwerk Tech', email: 'l.weber@rheinwerk.de', plan: 'Enterprise', status: 'Past Due', region: 'Europe', country: 'Germany', seats: 84, mrr: 1680, updatedAt: '2026-05-20' },
  { id: 'ACC-1016', customer: 'Chloe Bennett', company: 'Harbor Commerce', email: 'chloe@harbor.au', plan: 'Starter', status: 'Active', region: 'APAC', country: 'Australia', seats: 12, mrr: 240, updatedAt: '2026-05-20' },
  { id: 'ACC-1017', customer: 'Mateo Rossi', company: 'Veloce Mobility', email: 'mateo@veloce.it', plan: 'Growth', status: 'Active', region: 'Europe', country: 'Italy', seats: 29, mrr: 580, updatedAt: '2026-05-19' },
  { id: 'ACC-1018', customer: 'Ava Thompson', company: 'Maple Cloud', email: 'ava@maplecloud.ca', plan: 'Starter', status: 'Pending', region: 'North America', country: 'Canada', seats: 7, mrr: 140, updatedAt: '2026-05-18' },
  { id: 'ACC-1019', customer: 'Min-jun Park', company: 'Seoulink Labs', email: 'mjpark@seoulink.kr', plan: 'Enterprise', status: 'Active', region: 'APAC', country: 'South Korea', seats: 155, mrr: 3100, updatedAt: '2026-05-17' },
  { id: 'ACC-1020', customer: 'Nora Van Dijk', company: 'Delta Portals', email: 'nora@deltaportals.nl', plan: 'Growth', status: 'Active', region: 'Europe', country: 'Netherlands', seats: 41, mrr: 820, updatedAt: '2026-05-16' },
  { id: 'ACC-1021', customer: 'Samuel Wright', company: 'Beacon Security', email: 'sam@beaconsec.us', plan: 'Enterprise', status: 'Active', region: 'North America', country: 'United States', seats: 190, mrr: 3800, updatedAt: '2026-05-15' },
  { id: 'ACC-1022', customer: 'Elena Kowalski', company: 'Vistula Dev', email: 'elena@vistula.pl', plan: 'Starter', status: 'Past Due', region: 'Europe', country: 'Poland', seats: 11, mrr: 220, updatedAt: '2026-05-14' },
  { id: 'ACC-1023', customer: 'Liam O’Connor', company: 'Emerald Edge', email: 'liam@emeraldedge.ie', plan: 'Growth', status: 'Active', region: 'Europe', country: 'Ireland', seats: 34, mrr: 680, updatedAt: '2026-05-13' },
  { id: 'ACC-1024', customer: 'Grace Tanaka', company: 'Pacific Telemetry', email: 'grace@pacifictel.jp', plan: 'Starter', status: 'Active', region: 'APAC', country: 'Japan', seats: 15, mrr: 300, updatedAt: '2026-05-12' },
];

