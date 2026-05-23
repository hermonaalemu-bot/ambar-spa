import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ikgbugpppkmdmboxnpag.supabase.co'
const SUPABASE_KEY = 'sb_publishable_oE5vvVsT7nJa4H4WhyAkGw_1jsUM6it'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)