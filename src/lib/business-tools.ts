import type { ToolSchema } from "./groq";

/** Same rows as labs/data/sales.csv */
export const SALES = [
  { month: "2026-01", region: "North", product: "Cloud Suite", units: 120, revenue: 180000, cost: 99000 },
  { month: "2026-01", region: "South", product: "Cloud Suite", units: 95, revenue: 142500, cost: 81700 },
  { month: "2026-01", region: "North", product: "AI Copilot", units: 60, revenue: 150000, cost: 72000 },
  { month: "2026-01", region: "South", product: "AI Copilot", units: 40, revenue: 100000, cost: 51000 },
  { month: "2026-02", region: "North", product: "Cloud Suite", units: 132, revenue: 198000, cost: 105600 },
  { month: "2026-02", region: "South", product: "Cloud Suite", units: 88, revenue: 132000, cost: 79200 },
  { month: "2026-02", region: "North", product: "AI Copilot", units: 75, revenue: 187500, cost: 86250 },
  { month: "2026-02", region: "South", product: "AI Copilot", units: 52, revenue: 130000, cost: 62400 },
  { month: "2026-03", region: "North", product: "Cloud Suite", units: 140, revenue: 210000, cost: 109200 },
  { month: "2026-03", region: "South", product: "Cloud Suite", units: 81, revenue: 121500, cost: 76950 },
  { month: "2026-03", region: "North", product: "AI Copilot", units: 96, revenue: 240000, cost: 105600 },
  { month: "2026-03", region: "South", product: "AI Copilot", units: 70, revenue: 175000, cost: 80500 },
];

const CUSTOMERS: Record<string, { name: string; tier: string; mrr: number; health: string; open_tickets: number }> = {
  C001: { name: "Contoso Retail", tier: "Gold", mrr: 12400, health: "At risk", open_tickets: 7 },
  C002: { name: "Fabrikam Health", tier: "Platinum", mrr: 31800, health: "Healthy", open_tickets: 1 },
  C003: { name: "Northwind Logistics", tier: "Silver", mrr: 5600, health: "Healthy", open_tickets: 2 },
};

// Demo rates — clearly not live market data
const FX: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 84.1, JPY: 151.2 };

type Args = Record<string, unknown>;
const n = (v: unknown) => Number(v ?? 0);
const fmt = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 2 });

export type BusinessTool = {
  name: string;
  emoji: string;
  blurb: string;
  python: string; // signature shown in code generation
  schema: ToolSchema;
  run: (a: Args) => string;
};

export const BUSINESS_TOOLS: BusinessTool[] = [
  {
    name: "profit_margin",
    emoji: "💰",
    blurb: "Profit & margin % from revenue and cost",
    python: "def profit_margin(revenue: float, cost: float) -> str",
    schema: {
      type: "function",
      function: {
        name: "profit_margin",
        description: "Calculate profit and profit margin percentage.",
        parameters: {
          type: "object",
          properties: { revenue: { type: "number", description: "Total revenue" }, cost: { type: "number", description: "Total cost" } },
          required: ["revenue", "cost"],
        },
      },
    },
    run: (a) => {
      const r = n(a.revenue), c = n(a.cost);
      return `profit=${fmt(r - c)}, margin=${r ? (((r - c) / r) * 100).toFixed(1) : 0}%`;
    },
  },
  {
    name: "sales_summary",
    emoji: "📊",
    blurb: "Query the Q1 sales dataset by region / product",
    python: "def sales_summary(region: str | None = None, product: str | None = None) -> str",
    schema: {
      type: "function",
      function: {
        name: "sales_summary",
        description: "Return monthly units, revenue and cost from the company sales dataset (Jan-Mar 2026).",
        parameters: {
          type: "object",
          properties: {
            region: { type: "string", description: "North or South; omit for all" },
            product: { type: "string", description: "Cloud Suite or AI Copilot; omit for all" },
          },
        },
      },
    },
    run: (a) => {
      const rows = SALES.filter(
        (r) =>
          (!a.region || r.region.toLowerCase() === String(a.region).toLowerCase()) &&
          (!a.product || r.product.toLowerCase() === String(a.product).toLowerCase()),
      );
      if (!rows.length) return "No rows match that filter.";
      const by: Record<string, { units: number; revenue: number; cost: number }> = {};
      for (const r of rows) {
        by[r.month] ??= { units: 0, revenue: 0, cost: 0 };
        by[r.month].units += r.units;
        by[r.month].revenue += r.revenue;
        by[r.month].cost += r.cost;
      }
      return Object.entries(by)
        .map(([m, v]) => `${m}: units=${v.units}, revenue=${v.revenue}, cost=${v.cost}`)
        .join("\n");
    },
  },
  {
    name: "growth_rate",
    emoji: "📈",
    blurb: "Percentage growth between two values",
    python: "def growth_rate(start: float, end: float) -> str",
    schema: {
      type: "function",
      function: {
        name: "growth_rate",
        description: "Percentage growth between two values.",
        parameters: {
          type: "object",
          properties: { start: { type: "number" }, end: { type: "number" } },
          required: ["start", "end"],
        },
      },
    },
    run: (a) => (n(a.start) ? `${(((n(a.end) - n(a.start)) / n(a.start)) * 100).toFixed(1)}%` : "ERROR: start must be non-zero"),
  },
  {
    name: "break_even_units",
    emoji: "⚖️",
    blurb: "Units needed to break even",
    python: "def break_even_units(fixed_cost: float, price: float, unit_cost: float) -> str",
    schema: {
      type: "function",
      function: {
        name: "break_even_units",
        description: "Number of units required to cover fixed costs.",
        parameters: {
          type: "object",
          properties: { fixed_cost: { type: "number" }, price: { type: "number" }, unit_cost: { type: "number" } },
          required: ["fixed_cost", "price", "unit_cost"],
        },
      },
    },
    run: (a) => {
      const m = n(a.price) - n(a.unit_cost);
      return m <= 0 ? "ERROR: price must exceed unit cost" : `${Math.ceil(n(a.fixed_cost) / m)} units`;
    },
  },
  {
    name: "discount_price",
    emoji: "🏷️",
    blurb: "Apply a discount (guarded: max 50%)",
    python: "def discount_price(price: float, pct: float) -> str",
    schema: {
      type: "function",
      function: {
        name: "discount_price",
        description: "Apply a percentage discount to a price (0-50%).",
        parameters: {
          type: "object",
          properties: { price: { type: "number" }, pct: { type: "number", description: "Discount percent 0-50" } },
          required: ["price", "pct"],
        },
      },
    },
    run: (a) => (n(a.pct) < 0 || n(a.pct) > 50 ? "ERROR: discount must be between 0 and 50%" : (n(a.price) * (1 - n(a.pct) / 100)).toFixed(2)),
  },
  {
    name: "convert_currency",
    emoji: "💱",
    blurb: "Convert between USD/EUR/GBP/INR/JPY (demo rates)",
    python: "def convert_currency(amount: float, from_ccy: str, to_ccy: str) -> str",
    schema: {
      type: "function",
      function: {
        name: "convert_currency",
        description: "Convert an amount between USD, EUR, GBP, INR and JPY using fixed demo rates.",
        parameters: {
          type: "object",
          properties: { amount: { type: "number" }, from_ccy: { type: "string" }, to_ccy: { type: "string" } },
          required: ["amount", "from_ccy", "to_ccy"],
        },
      },
    },
    run: (a) => {
      const f = FX[String(a.from_ccy).toUpperCase()], t = FX[String(a.to_ccy).toUpperCase()];
      if (!f || !t) return "ERROR: supported currencies are USD, EUR, GBP, INR, JPY";
      return `${fmt((n(a.amount) / f) * t)} ${String(a.to_ccy).toUpperCase()} (demo rate)`;
    },
  },
  {
    name: "get_customer",
    emoji: "🧾",
    blurb: "Look up a CRM record (C001–C003)",
    python: "def get_customer(customer_id: str) -> str",
    schema: {
      type: "function",
      function: {
        name: "get_customer",
        description: "Fetch a customer record from the CRM by id (C001, C002, C003).",
        parameters: { type: "object", properties: { customer_id: { type: "string" } }, required: ["customer_id"] },
      },
    },
    run: (a) => {
      const c = CUSTOMERS[String(a.customer_id).toUpperCase()];
      return c ? JSON.stringify(c) : "Customer not found. Valid ids: C001, C002, C003.";
    },
  },
];

export function runTool(name: string, rawArgs: string): string {
  const t = BUSINESS_TOOLS.find((x) => x.name === name);
  if (!t) return `ERROR: unknown tool ${name}`;
  try {
    return t.run(rawArgs ? JSON.parse(rawArgs) : {});
  } catch (e) {
    return `ERROR: ${(e as Error).message}`;
  }
}
