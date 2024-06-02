IF NOT EXISTS (
    SELECT
    FROM   pg_catalog.pg_database
    WHERE  datname = 'racket'
) THEN
    PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE racket');
END IF;