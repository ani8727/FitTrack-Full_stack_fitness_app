-- Set table owners to neondb_owner in user_db (public schema)
-- Note: Requires privileges to change ownership (must be current owner or superuser)

ALTER TABLE IF EXISTS public.users OWNER TO neondb_owner;
ALTER TABLE IF EXISTS public.contact_messages OWNER TO neondb_owner;

-- If any sequences exist, include them as well (UUID columns typically do not use sequences)
ALTER SEQUENCE IF EXISTS public.users_id_seq OWNER TO neondb_owner;
ALTER SEQUENCE IF EXISTS public.contact_messages_id_seq OWNER TO neondb_owner;
