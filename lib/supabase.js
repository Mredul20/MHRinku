import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let client;

function getSupabaseAdmin() {
	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
	}

	client ??= createClient(supabaseUrl, serviceRoleKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	});

	return client;
}

// Server-only client. Do not import this in client components.
export const supabaseAdmin = new Proxy({}, {
	get(_target, property) {
		const configuredClient = getSupabaseAdmin();
		const value = configuredClient[property];
		return typeof value === "function" ? value.bind(configuredClient) : value;
	},
});
