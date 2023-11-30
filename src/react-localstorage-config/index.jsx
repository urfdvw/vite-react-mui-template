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
import uiSchema from "./uiSchema.json";

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
function getLocalStorageObjects() {
    `Convert localStorage into an object.
    
    If anything unexpected happens,
    clear the storage and return empty object.`;
    // https://codereview.stackexchange.com/a/273991
    try {
        return Object.keys(localStorage).reduce((obj, k) => ({ ...obj, [k]: JSON.parse(localStorage.getItem(k)) }), {});
    } catch {
        console.warn("LocalStorage contents cannot be converted to objects. bleached.");
        localStorage.clear();
        return {};
    }
}

function useLocalStorage(section) {
    const [localStorageState, _setLocalStorageState] = useState({});
    function initLocalStorageState() {
        getLocalStorageObjects(); // if anything wrong with localStorage, bleach it
        if (!isDefined(localStorage.getItem(section))) {
            localStorage.setItem(section, JSON.stringify({}));
        }
        _setLocalStorageState(getLocalStorageObjects()[section]);
    }

    function setLocalStorageState(name, value) {
        localStorage.setItem(
            section,
            JSON.stringify({
                ...JSON.parse(localStorage.getItem(section)),
                [name]: value,
            })
        );
        _setLocalStorageState(getLocalStorageObjects()[section]);
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

export function useConfig(schemas) {
    const { localStorageState, setLocalStorageState, initLocalStorageState } = useLocalStorage("config");
    const [initStep, setInitStep] = useState(0);

    useEffect(() => {
        if (initStep === 0) {
            console.log("init step 0: initialize localStorageState");
            initLocalStorageState();
            setInitStep(1);
        }
        if (initStep === 1) {
            console.log("init step 1: update localStorageState by schema defaults");
            for (const schema of schemas) {
                const schema_name = toName(schema.title);
                var config_values = getConfigWithDefaults(get_config(schema_name), schema);
                set_config(schema_name, config_values);
            }
        }
    }, [initStep]);

    function get_config(schema_name) {
        const config = localStorageState[schema_name];
        return isDefined(config) ? config : null;
    }

    function set_config(schema_name, config_values) {
        setLocalStorageState(schema_name, config_values);
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
function SchemaForm({ initFormData, schema, onSubmit }) {
    const [formData, setFormData] = useState();
    useEffect(() => {
        setFormData(initFormData);
    }, [initFormData]);

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

export function ConfigForms({ schemas, config, set_config }) {
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
                            initFormData={config[toName(schema.title)]}
                            schema={schema}
                            onSubmit={(formData) => {
                                set_config(toName(schema.title), formData);
                            }}
                        />
                    </TabPanel>
                );
            })}
        </Box>
    );
}
