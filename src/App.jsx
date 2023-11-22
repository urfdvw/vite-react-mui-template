import { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import jsonSchemaDefaults from "json-schema-defaults";
import global_config_schema from "./schemas/global.json";
import editor_config_schema from "./schemas/editor.json";

function useConfig(schemas, config_prefix = "config_") {
    const [config_changed, set_config_changed] = useState(false);
    useEffect(() => {
        for (const schema_name in schemas) {
            var config_values = jsonSchemaDefaults(schemas[schema_name]);
            var config_values_local = get_config(schema_name);
            console.log(config_values, config_values_local);
            if (config_values_local !== null && typeof config_values_local === typeof {}) {
                for (const field_name in config_values) {
                    if (field_name in config_values_local) {
                        config_values[field_name] = config_values_local[field_name];
                    }
                }
            }
            set_config(schema_name, config_values);
            localStorage.setItem(config_prefix + schema_name, JSON.stringify(config_values));
        }
    }, []);

    function get_config(schema_name) {
        return JSON.parse(localStorage.getItem(config_prefix + schema_name));
    }

    function set_config(schema_name, config_values) {
        localStorage.setItem(config_prefix + schema_name, JSON.stringify(config_values));
        set_config_changed(true);
    }

    function get_config_field(schema_name, field_name) {
        const config = get_config(schema_name);
        if (field_name in config) {
            return config[config];
        } else {
            console.error("no field called " + field_name + " in config schema " + schema_name);
        }
    }

    function set_config_field(schema_name, field_name, field_value) {
        const config = get_config(schema_name);
        if (field_name in config) {
            if (typeof field_value !== typeof config[field_name]) {
                console.error(
                    "given value " +
                        field_value +
                        " has a different type from config schema. Given: " +
                        typeof field_value +
                        ", required: " +
                        typeof config[field_name]
                );
            } else {
                set_config(schema_name, { ...config, [field_name]: field_value });
            }
        } else {
            console.error("no field called " + field_name + " in config schema " + schema_name);
        }
    }

    return { set_config, get_config, set_config_field, get_config_field };
}

function App() {
    const { set_config, get_config, set_config_field, get_config_field } = useConfig({
        global: global_config_schema,
        editor: editor_config_schema,
    });

    return (
        <>
            <p>{JSON.stringify(get_config("editor"))}</p>
            <p>{JSON.stringify(get_config("global"))}</p>
            <button
                onClick={() => {
                    set_config_field("editor", "font", 10);
                }}
            >
                set font 10
            </button>
            <button
                onClick={() => {
                    set_config_field("editor", "font", 14);
                }}
            >
                set font 14
            </button>
        </>
    );
}

export default App;
