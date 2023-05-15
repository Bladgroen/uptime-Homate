--adds add-ons table and links to the monitor table.
BEGIN TRANSACTION;

CREATE TABLE add_ons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT 1, 
    slug VARCHAR(255),
    URL TEXT,
    accepted_statuscodes_json TEXT NOT NULL DEFAULT '["200-299]',
    update_available BOOLEAN NOT NULL,
    icon VARCHAR(255),
    monitor_id INTEGER NOT NULL,
    FOREIGN KEY(monitor_id) REFERENCES monitor(id) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMIT;
