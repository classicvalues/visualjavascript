var async           = require('async');
var path                        = require('path');

let electronApp = false


let nodeModulesPath = process.cwd()
if (process.execPath) {
    let vjsPos = process.execPath.indexOf("vjs")
    if (vjsPos != -1) {
        let vjsLen = process.execPath.length - vjsPos
        nodeModulesPath = process.execPath.substring(0, process.execPath.length - vjsLen);
    }
}




let sqlNodePath = path.join(nodeModulesPath,'node_modules/sqlite3')
//console.log("sqlNodePath: " + sqlNodePath)
var sqlite3                     = null



module.exports = {
    setElectron: function(elVal) {
        electronApp = elVal
        if (electronApp){
            sqlite3                     = require("sqlite3");
        } else {
            sqlite3                     = require(sqlNodePath);
        }
        console.log("d***: " + electronApp)
    }
    ,
    createTables: function(dbsearch, callbackFn) {
    //console.log("--------------- createTables: function(dbsearch, callbackFn) {");
    async.map([

            "CREATE TABLE IF NOT EXISTS system_process_info (yazz_instance_id	TEXT, process	TEXT, process_id	TEXT, callback_index INTEGER, running_since	TEXT, status TEXT , last_driver TEXT, last_event TEXT, running_start_time_ms INTEGER, event_duration_ms INTEGER, job_priority INTEGER, system_code_id TEXT, PRIMARY KEY (yazz_instance_id, process));",

            "CREATE TABLE IF NOT EXISTS system_process_errors (yazz_instance_id	TEXT, id TEXT, timestamp INTEGER, process	TEXT, status TEXT , base_component_id TEXT, event TEXT, system_code_id TEXT, args TEXT, error_message TEXT);",

            "CREATE TABLE IF NOT EXISTS app_dependencies (id TEXT, code_id	TEXT, dependency_type TEXT , dependency_name TEXT, dependency_version TEXT);",
            "CREATE INDEX IF NOT EXISTS app_dependencies_code_id_id_idx ON app_dependencies (code_id);",

            "CREATE TABLE IF NOT EXISTS app_registry (id TEXT, username TEXT , reponame TEXT, version TEXT, code_id	TEXT);",
            "CREATE INDEX IF NOT EXISTS app_registry_code_id_idx ON app_registry (code_id);",
            "CREATE INDEX IF NOT EXISTS app_registry_username_idx ON app_registry (username);",
            "CREATE INDEX IF NOT EXISTS app_registry_reponame_idx ON app_registry (reponame);",
            "CREATE INDEX IF NOT EXISTS app_registry_username_reponame_idx ON app_registry (username,reponame);",
            "CREATE INDEX IF NOT EXISTS app_registry_username_reponame_version_idx ON app_registry (username,reponame,version);",

            "CREATE TABLE IF NOT EXISTS component_properties (component_name TEXT, property_name TEXT);",


            "CREATE TABLE IF NOT EXISTS component_property_types (component_name TEXT, property_name TEXT,  type_name TEXT, type_value TEXT);",
            "CREATE TABLE IF NOT EXISTS component_property_accept_types (component_name TEXT, property_name TEXT,  accept_type_name TEXT,  accept_type_value TEXT);",


            "CREATE TABLE IF NOT EXISTS component_usage (base_component_id TEXT, child_component_id, UNIQUE(base_component_id, child_component_id));",
            "CREATE INDEX IF NOT EXISTS component_usage_base_component_id_idx ON component_usage (base_component_id);",
            "CREATE INDEX IF NOT EXISTS component_usage_child_component_id_idx ON component_usage (child_component_id);",

            "CREATE TABLE IF NOT EXISTS app_allow_co_access (id TEXT, code_id TEXT, give_access_to_code_id TEXT , access_type TEXT);",

            "CREATE TABLE IF NOT EXISTS app_db_latest_ddl_revisions (base_component_id TEXT , latest_revision TEXT);",

            "CREATE TABLE IF NOT EXISTS system_code (id TEXT, on_condition TEXT, component_scope TEXT, base_component_id TEXT,method TEXT, code TEXT, max_processes INTEGER, code_tag TEXT, parent_id TEXT, creation_timestamp INTEGER, display_name TEXT, component_options TEXT, logo_url TEXT, visibility TEXT, interfaces TEXT, use_db TEXT, editors TEXT, read_write_status TEXT, properties TEXT, component_type TEXT, control_sub_type TEXT, edit_file_path TEXT);",
            "CREATE INDEX IF NOT EXISTS system_code_base_component_id_idx ON system_code (base_component_id);",
            "CREATE INDEX IF NOT EXISTS system_code_on_condition_idx      ON system_code (on_condition);",
            "CREATE INDEX IF NOT EXISTS system_code_id_idx                ON system_code (id);",
            "CREATE INDEX IF NOT EXISTS system_code_logo_url_idx          ON system_code (logo_url);",
            "CREATE INDEX IF NOT EXISTS system_code_code_tag_idx          ON system_code (code_tag);",
            "CREATE INDEX IF NOT EXISTS system_code_component_type_idx      ON system_code (component_type);"


                ],

        function(a,b){
            try {
                dbsearch.serialize(function()
                {
                    //console.log(a);
                    dbsearch.run(a);
                });
                return b(null,a);
            } catch(err) {
                console.log(err);
                return b(null,a);
            }
        },

        function(err, results){
            callbackFn.call(this);
        });
        }
    }
