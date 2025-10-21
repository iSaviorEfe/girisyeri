import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Client-Info", "Apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-ec5ebf11/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/make-server-ec5ebf11/invoices", async (c) => {
  try {
    const invoices = await kv.getByPrefix("invoice:");
    return c.json({ invoices: invoices || [] });
  } catch (error) {
    console.log("Error fetching invoices:", error);
    return c.json({ error: "Failed to fetch invoices" }, 500);
  }
});

app.post("/make-server-ec5ebf11/invoices", async (c) => {
  try {
    const invoice = await c.req.json();
    const invoiceId = `invoice:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const invoiceData = {
      ...invoice,
      id: invoiceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await kv.set(invoiceId, invoiceData);
    return c.json({ invoice: invoiceData });
  } catch (error) {
    console.log("Error creating invoice:", error);
    return c.json({ error: "Failed to create invoice" }, 500);
  }
});

app.put("/make-server-ec5ebf11/invoices/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    const existing = await kv.get(id);
    if (!existing) {
      return c.json({ error: "Invoice not found" }, 404);
    }
    const updatedInvoice = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(id, updatedInvoice);
    return c.json({ invoice: updatedInvoice });
  } catch (error) {
    console.log("Error updating invoice:", error);
    return c.json({ error: "Failed to update invoice" }, 500);
  }
});

app.delete("/make-server-ec5ebf11/invoices/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting invoice:", error);
    return c.json({ error: "Failed to delete invoice" }, 500);
  }
});

Deno.serve(app.fetch);