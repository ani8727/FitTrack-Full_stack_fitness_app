-- Set table owners to neondb_owner in admin_db (public schema)
-- Note: Requires privileges to change ownership (must be current owner or superuser)

ALTER TABLE IF EXISTS public.users OWNER TO neondb_owner;
ALTER TABLE IF EXISTS public.admin_audit_logs OWNER TO neondb_owner;

-- Change owner of identity sequence if present
ALTER SEQUENCE IF EXISTS public.admin_audit_logs_id_seq OWNER TO neondb_owner;
