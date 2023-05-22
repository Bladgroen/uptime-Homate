exports.up = function (knex) {
    return knex.schema
        .createTable("setting", function (table) {
            table.increments("id").primary();
            table.string("key", 200).notNullable().unique();
            table.text("value");
            table.string("type", 20);
        })
        .then(() =>
            knex.schema.createTable("user", function (table) {
                table.increments("id").primary();
                table.string("username", 255).notNullable().unique();
                table.string("password", 255);
                table.boolean("active").notNullable().defaultTo(true);
                table.string("timezone", 150);
                table.string("twofa_secret", 64);
                table.boolean("twofa_status").notNullable().defaultTo(false);
                table.string("twofa_last_token", 6);
                table.integer("role_id").notNullable().defaultTo(1);
            })
        )
        .then(() =>
            knex.schema.createTable("sqlite_sequence", function (table) {
                table.text("name");
                table.integer("seq");
            })
        )
        .then(() =>
            knex.schema.createTable("notification", function (table) {
                table.increments("id").primary();
                table.string("name", 255);
                table.string("config", 255);
                table.boolean("active").notNullable().defaultTo(true);
                table.integer("user_id").unsigned().notNullable();
                table.boolean("is_default").notNullable().defaultTo(false);
                table
                    .foreign("user_id")
                    .references("user.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
            })
        )
        .then(() =>
            knex.schema.createTable("status_page", function (table) {
                table.increments("id").primary();
                table.string("slug", 255).notNullable().unique();
                table.string("title", 255).notNullable();
                table.text("description");
                table.string("icon", 255).notNullable();
                table.string("theme", 30).notNullable();
                table.boolean("published").notNullable().defaultTo(1);
                table.boolean("search_engine_index").notNullable().defaultTo(1);
                table.boolean("show_tags").notNullable().defaultTo(0);
                table.string("password");
                table
                    .datetime("created_date")
                    .notNullable()
                    .defaultTo(knex.fn.now());
                table
                    .datetime("modified_date")
                    .notNullable()
                    .defaultTo(knex.fn.now());
                table.text("footer_text");
                table.text("custom_css");
                table.boolean("show_powered_by").notNullable().defaultTo(1);
                table.string("google_analytics_tag_id");
            })
        )

        .then(() =>
            knex.schema.createTable("monitor", function (table) {
                table.increments("id").primary().unsigned();
                table.string("name", 150);
                table.boolean("active").notNullable().defaultTo(1);
                table.integer("user_id").unsigned();
                table.integer("interval").notNullable().defaultTo(20);
                table.text("url");
                table.string("type", 20);
                table.integer("weight").defaultTo(2000);
                table.string("hostname", 255);
                table.integer("port");
                table
                    .datetime("created_date")
                    .notNullable()
                    .defaultTo(knex.fn.now());
                table.string("keyword", 255);
                table.integer("maxretries").notNullable().defaultTo(0);
                table.boolean("ignore_tls").notNullable().defaultTo(0);
                table.boolean("upside_down").notNullable().defaultTo(0);
                table.integer("maxredirects").notNullable().defaultTo(10);
                table
                    .text("accepted_statuscodes_json")
                    .notNullable()
                    .defaultTo('["200-299"]');
                table.string("dns_resolve_type", 5);
                table.string("dns_resolve_server", 255);
                table.string("dns_last_result", 255);
                table.integer("retry_interval").notNullable().defaultTo(0);
                table.string("push_token", 20).nullable();
                table.text("method").notNullable().defaultTo("GET");
                table.text("body").nullable();
                table.text("headers").nullable();
                table.text("basic_auth_user").nullable();
                table.text("basic_auth_pass").nullable();
                table.integer("docker_host");
                table.string("docker_container", 255);
                table.integer("proxy_id");
                table.boolean("expiry_notification").defaultTo(1);
                table.text("mqtt_topic");
                table.string("mqtt_success_message", 255);
                table.string("mqtt_username", 255);
                table.string("mqtt_password", 255);
                table.string("database_connection_string", 2000);
                table.text("database_query");
                table.string("auth_method", 250);
                table.text("auth_domain");
                table.text("auth_workstation");
                table.string("grpc_url", 255).nullable();
                table.text("grpc_protobuf").nullable();
                table.text("grpc_body").nullable();
                table.text("grpc_metadata").nullable();
                table.string("grpc_method", 255).nullable();
                table.string("grpc_service_name", 255).nullable();
                table.boolean("grpc_enable_tls").notNullable().defaultTo(0);
                table.string("radius_username", 255);
                table.string("radius_password", 255);
                table.string("radius_calling_station_id", 50);
                table.string("radius_called_station_id", 50);
                table.string("radius_secret", 255);
                table.integer("resend_interval").notNullable().defaultTo(0);
                table.integer("packet_size").notNullable().defaultTo(56);
                table.string("game", 255);
                table.string("http_body_encoding", 25);
                table.text("description").nullable();
                table.text("tls_ca").nullable();
                table.text("tls_cert").nullable();
                table.text("tls_key").nullable();
                table
                    .boolean("update_available")
                    .notNullable()
                    .defaultTo(false);

                table
                    .foreign("user_id")
                    .references("user.id")
                    .onDelete("SET NULL")
                    .onUpdate("CASCADE");
                table.index(["id"]);
            })
        )
        .then(() =>
            knex.schema.createTable("maintenance", function (table) {
                table.increments("id").primary().unsigned();
                table.string("title", 150).notNullable();
                table.text("description").notNullable();
                table.integer("user_id").unsigned();
                table.boolean("active").notNullable().defaultTo(1);
                table.string("strategy", 50).notNullable().defaultTo("single");
                table.date("start_date");
                table.date("end_date");
                table.time("start_time");
                table.time("end_time");
                table.string("weekdays", 250).defaultTo("[]");
                table.text("days_of_month").defaultTo("[]");
                table.integer("interval_day");
                table.text("cron");
                table.string("timezone", 255);
                table.integer("duration");

                table
                    .foreign("user_id")
                    .references("user.id")
                    .onDelete("SET NULL")
                    .onUpdate("CASCADE");
            })
        )
        .then(() =>
            knex.schema.createTable(
                "maintenance_status_page",
                function (table) {
                    table.increments("id").primary().unsigned();
                    table.integer("status_page_id").notNullable();
                    table.integer("maintenance_id").notNullable().unsigned();

                    table
                        .foreign("maintenance_id")
                        .references("maintenance.id")
                        .onDelete("CASCADE")
                        .onUpdate("CASCADE");
                }
            )
        )

        .then(() =>
            knex.schema.createTable("status_page_cname", function (table) {
                table.increments("id").primary();
                table.integer("status_page_id").notNullable();
                table.string("domain", 255).notNullable().unique();
            })
        )
        .then(() =>
            knex.schema.createTable("incident", function (table) {
                table.increments("id").primary();
                table.string("title", 255).notNullable();
                table.text("content").notNullable();
                table.string("style", 30).notNullable().defaultTo("warning");
                table
                    .datetime("created_date")
                    .notNullable()
                    .defaultTo(knex.fn.now());
                table.datetime("last_updated_date");
                table.boolean("pin").notNullable().defaultTo(1);
                table.boolean("active").notNullable().defaultTo(1);
                table.integer("status_page_id");
            })
        )
        .then(() =>
            knex.schema.createTable("group", function (table) {
                table.increments("id").primary();
                table.string("name", 255).notNullable();
                table
                    .datetime("created_date")
                    .notNullable()
                    .defaultTo(knex.fn.now());
                table.boolean("public").notNullable().defaultTo(0);
                table.boolean("active").notNullable().defaultTo(1);
                table.boolean("weight").notNullable().defaultTo(1000);
                table.integer("status_page_id");
            })
        )
        .then(() =>
            knex.schema.createTable("tag", function (table) {
                table.increments("id").primary();
                table.string("name", 255).notNullable();
                table.string("color", 255).notNullable();
                table
                    .dateTime("created_date")
                    .notNullable()
                    .defaultTo(knex.fn.now());
            })
        )
        .then(() =>
            knex.schema.createTable("monitor_tls_info", function (table) {
                table.increments("id").primary();
                table.integer("monitor_id").notNullable();
                table.text("info_json");
            })
        )
        .then(() =>
            knex.schema.createTable(
                "notification_sent_history",
                function (table) {
                    table.increments("id").primary();
                    table.string("type", 50).notNullable();
                    table.integer("days").notNullable();

                    table
                        .integer("monitor_id", 10)
                        .unsigned()
                        .notNullable()
                        .references("monitor.id")
                        .onUpdate("CASCADE")
                        .onDelete("CASCADE");
                    table.unique(["type", "monitor_id", "days"]);
                }
            )
        )
        .then(() =>
            knex.schema.createTable("heartbeat", function (table) {
                table.increments("id").primary();
                table.boolean("important").notNullable().defaultTo(0);
                table.integer("monitor_id").notNullable().unsigned();
                table.smallint("status").notNullable();
                table.text("msg");
                table.datetime("time").notNullable();
                table.integer("ping");
                table.integer("duration").notNullable().defaultTo(0);
                table.integer("down_count").notNullable().defaultTo(0);

                table
                    .foreign("monitor_id")
                    .references("monitor.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");

                table.index(["monitor_id", "time"], "monitor_time_index");
                table.index(
                    ["monitor_id", "important", "time"],
                    "monitor_important_time_index"
                );
                table.index(["monitor_id"]);
                table.index(["important"]);
            })
        )
        .then(() =>
            knex.schema.createTable("monitor_notification", function (table) {
                table.increments("id").primary();
                table.integer("monitor_id").notNullable().unsigned();
                table.integer("notification_id").notNullable().unsigned();

                table
                    .foreign("monitor_id")
                    .references("monitor.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
                table
                    .foreign("notification_id")
                    .references("notification.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");

                table.index(["monitor_id", "notification_id"]);
            })
        )
        .then(() =>
            knex.schema.createTable("monitor_group", function (table) {
                table.increments("id").primary();
                table.integer("monitor_id").notNullable().unsigned();
                table.integer("group_id").notNullable().unsigned();
                table.boolean("weight").notNullable().defaultTo(1000);
                table.boolean("send_url").notNullable().defaultTo(0);

                table
                    .foreign("group_id")
                    .references("group.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
                table
                    .foreign("monitor_id")
                    .references("monitor.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");

                table.index(["monitor_id", "group_id"]);
            })
        )
        .then(() =>
            knex.schema.createTable("monitor_tag", function (table) {
                table.increments("id").primary();
                table.integer("monitor_id").notNullable().unsigned();
                table.integer("tag_id").notNullable().unsigned();
                table.text("value");

                table
                    .foreign("tag_id")
                    .references("tag.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
                table
                    .foreign("monitor_id")
                    .references("monitor.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");

                table.index(["monitor_id"]);
                table.index(["tag_id"]);
            })
        )
        .then(() =>
            knex.schema.createTable("monitor_maintenance", function (table) {
                table.increments("id").primary();
                table.integer("monitor_id").notNullable().unsigned();
                table.integer("maintenance_id").notNullable().unsigned();

                table
                    .foreign("maintenance_id")
                    .references("maintenance.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
                table
                    .foreign("monitor_id")
                    .references("monitor.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
            })
        )
        .then(() =>
            knex.schema.createTable("add_ons", function (table) {
                table.increments("id").primary().unsigned();
                table.string("name", 255);
                table.boolean("active").notNullable().defaultTo(1);
                table.string("slug", 255);
                table.text("URL");
                table.boolean("update_available").notNullable();
                table.string("icon", 255);
                table.integer("monitor_id").notNullable().unsigned();

                table
                    .foreign("monitor_id")
                    .references("monitor.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
                table.index(["monitor_id"]);
                table.index(["id"]);
            })
        )

        .then(() =>
            knex.schema.createTable("api_key", function (table) {
                table.increments("id").primary();
                table.string("key", 255).notNullable();
                table.string("name", 255).notNullable();
                table.integer("user_id").notNullable().unsigned();
                table
                    .datetime("created_date")
                    .notNullable()
                    .defaultTo(knex.fn.now());
                table.boolean("active").notNullable().defaultTo(1);
                table.datetime("expires").nullable();

                table
                    .foreign("user_id")
                    .references("user.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
            })
        )
        .then(() =>
            knex.schema.createTable("add_on_heartbeat", function (table) {
                table.increments("id").primary();
                table.integer("monitor_id").notNullable().unsigned();
                table.integer("add_on_id").notNullable().unsigned();
                table.text("msg");
                table.smallint("status").notNullable();
                table.datetime("time").notNullable();

                table
                    .foreign("monitor_id")
                    .references("monitor.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
                table
                    .foreign("add_on_id")
                    .references("add_ons.id")
                    .onDelete("CASCADE")
                    .onUpdate("CASCADE");
                table.index(["add_on_id", "time"], "add_on_time_index");
                table.index(["monitor_id"]);
                table.index(["add_on_id"]);
            })
        )
        .then(() =>
            knex.schema.createTable("token", function (table) {
                table.string("token", 500).primary();
                table.datetime("time").notNullable();
            })
        );
};

exports.down = function (knex) {
    return knex.schema
        .dropTable("add_ons")
        .then(() => knex.schema.dropTable("monitor_tag"))
        .then(() => knex.schema.dropTable("monitor_group"))
        .then(() => knex.schema.dropTable("monitor_notification"))
        .then(() => knex.schema.dropTable("heartbeat"))
        .then(() => knex.schema.dropTable("notification_sent_history"))
        .then(() => knex.schema.dropTable("monitor_tls_info"))
        .then(() => knex.schema.dropTable("tag"))
        .then(() => knex.schema.dropTable("group"))
        .then(() => knex.schema.dropTable("incident"))
        .then(() => knex.schema.dropTable("monitor"))
        .then(() => knex.schema.dropTable("notification"))
        .then(() => knex.schema.dropTable("user"))
        .then(() => knex.schema.dropTable("setting"))
        .then(() => knex.schema.dropTable("api_key"))
        .then(() => knex.schema.dropTable("maintenance"))
        .then(() => knex.schema.dropTable("maintenance_status_page"))
        .then(() => knex.schema.dropTable("sqlite_sequence"))
        .then(() => knex.schema.dropTable("status_page"))
        .then(() => knex.schema.dropTable("status_page_cname"))
        .then(() => knex.schema.dropTable("add_on_heartbeat"))
        .then(() => knex.schema.dropTable("token"));
};
