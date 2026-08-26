-- Phase 3: cleanup. Run this LAST, only after Phase 2 is live and you've confirmed
-- every staff member can log in through the new app. This permanently deletes the
-- plaintext password column — there is no going back to the old login after this.
alter table staff drop column if exists password;
