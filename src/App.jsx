import React, { useEffect, useState } from "react";
// schema default
import jsonSchemaDefaults from "json-schema-defaults";
// mui tab
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel, a11yProps } from "./TabPanel";
// schema form
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
// user data
import "./App.css";
import uiSchema from "./uiSchema.json";
import global_config_schema from "./schemas/global.json";
import editor_config_schema from "./schemas/editor.json";

// ---- Util ----
function isDefined(obj) {
    return obj !== null && obj != undefined;
}

function isObject(obj) {
    return typeof obj === typeof {};
}

function toName(string) {
    return string.toLowerCase().split(" ").join("_");
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
            for (const schema of schemas) {
                const schema_name = toName(schema.title);
                var config_values = getConfigWithDefaults(get_config(schema_name), schema);
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

// ---- form ui ----
function SchemaForm({ schema, onSubmit }) {
    const [formData, setFormData] = useState({});

    function handleChange(e) {
        setFormData(e.formData);
    }
    function handleSubmit(e) {
        onSubmit(e.formData);
    }
    return (
        <Form
            formData={formData}
            schema={schema}
            uiSchema={uiSchema}
            validator={validator}
            onSubmit={handleSubmit}
            omitExtraData={true}
            onChange={handleChange}
        />
    );
}

function ConfigForms({ schemas }) {
    const [tabValue, setTabValue] = React.useState(0);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={tabValue}
                    onChange={(event, newValue) => {
                        setTabValue(newValue);
                    }}
                    aria-label="basic tabs example"
                >
                    {schemas.map((schema, index) => {
                        return <Tab label={schema.title} {...a11yProps(index)} key={crypto.randomUUID()} />;
                    })}
                </Tabs>
            </Box>
            {schemas.map((schema, index) => {
                return (
                    <TabPanel value={tabValue} index={index} key={crypto.randomUUID()}>
                        <SchemaForm
                            schema={schema}
                            onSubmit={(formData) => {
                                console.log(formData);
                            }}
                        />
                    </TabPanel>
                );
            })}
        </Box>
    );
}

function App() {
    const schemas = [global_config_schema, editor_config_schema];
    const { config, set_config, set_config_field } = useConfig(schemas);
    const [formData, setFormData] = useState({});
    // return (
    //     <SchemaForm
    //         schema={global_config_schema}
    //         onSubmit={(formData) => {
    //             console.log(formData);
    //         }}
    //     />
    // );
    return <ConfigForms schemas={[global_config_schema, editor_config_schema]} />;
}

export default App;
