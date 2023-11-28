import { useEffect, useState } from "react";
import "./App.css";
import jsonSchemaDefaults from "json-schema-defaults";
import global_config_schema from "./schemas/global.json";
import editor_config_schema from "./schemas/editor.json";

// ---- Util ----
function isDefined(obj) {
    return obj !== null && obj != undefined;
}

function isObject(obj) {
    return typeof obj === typeof {};
}

// ---- localStorage interface
function dumpLocalStorage() {
    // https://codereview.stackexchange.com/a/273991
    return Object.keys(localStorage).reduce((obj, k) => ({ ...obj, [k]: JSON.parse(localStorage.getItem(k)) }), {});
}

function useLocalStorage() {
    const [localStorageState, _setLocalStorageState] = useState({});
    function initLocalStorageState() {
        _setLocalStorageState(dumpLocalStorage());
    }

    function setLocalStorageState(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
        _setLocalStorageState(dumpLocalStorage());
    }

    return { localStorageState, setLocalStorageState, initLocalStorageState };
}

// ---- config interface ----
function getConfigWithDefaults(current_config, schema) {
    var config = jsonSchemaDefaults(schema);
    if (isDefined(current_config) && isObject(current_config)) {
        for (const field_name in config) {
            if (field_name in current_config) {
                config[field_name] = current_config[field_name];
            }
        }
    }
    return config;
}

function useConfig(schemas, config_prefix = "config_") {
    const { localStorageState, setLocalStorageState, initLocalStorageState } = useLocalStorage();
    const [initStep, setInitStep] = useState(0);

    useEffect(() => {
        if (initStep === 0) {
            console.log("init step 0");
            initLocalStorageState();
            setInitStep(1);
        }
        if (initStep === 1) {
            console.log("init step 1");
            for (const schema_name in schemas) {
                var config_values = getConfigWithDefaults(get_config(schema_name), schemas[schema_name]);
                set_config(schema_name, config_values);
            }
        }
    }, [initStep]);

    function get_config(schema_name) {
        const config = localStorageState[config_prefix + schema_name];
        return isDefined(config) ? config : null;
    }

    function set_config(schema_name, config_values) {
        setLocalStorageState(config_prefix + schema_name, config_values);
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

    return { config: localStorageState, set_config, set_config_field };
}

function App() {
    const { config, set_config, set_config_field } = useConfig({
        global: global_config_schema,
        editor: editor_config_schema,
    });

    return (
        <>
            <p>{JSON.stringify(config)}</p>
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
            <br />
            <button
                onClick={() => {
                    set_config_field("editor", "nonsense", 10);
                }}
            >
                set nonsense 10
            </button>
            <button
                onClick={() => {
                    localStorage.setItem("config_editor", "10");
                    console.log(localStorage);
                }}
            >
                set nonsense 10 manual
            </button>
            <br />
            <button
                onClick={() => {
                    localStorage.clear();
                }}
            >
                clear
            </button>
            <button
                onClick={() => {
                    console.log(localStorage);
                }}
            >
                log localStorage
            </button>
        </>
    );
}

export default App;
