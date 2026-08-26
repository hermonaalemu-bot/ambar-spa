import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ikgbugpppkmdmboxnpag.supabase.co'
const SUPABASE_KEY = 'sb_publishable_oE5vvVsT7nJa4H4WhyAkGw_1jsUM6it'

// Session storage is scoped to sessionStorage (per browser tab), not the default
// localStorage (shared across every tab of the same browser). A shared front-desk
// computer may reasonably have more than one staff member's tab open at once — logging
// into a second account in a new tab should not silently switch every other open tab
// to that same account, and cross-tab session-sync events are also what caused the
// entire app to reload twice on every tab switch.
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { storage: window.sessionStorage },
})