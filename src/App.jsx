import { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import jsonSchemaDefaults from "json-schema-defaults";
import global_config_schema from "./schemas/global.json";
import editor_config_schema from "./schemas/editor.json";

function useConfig(schemas, config_prefix = "config_") {
    useEffect(() => {
        for (const schema_name in schemas) {
            var config_values = jsonSchemaDefaults(schemas[schema_name]);
            var config_values_local = JSON.parse(localStorage.getItem(config_prefix + schema_name));
            if (config_values_local !== null) {
                for (const field_name in config_values) {
                    if (field_name in config_values_local) {
                        config_values[field_name] = config_values_local[field_name];
                    }
                }
            }
            localStorage.setItem(config_prefix + schema_name, JSON.stringify(config_values));
        }
    }, []);
}

function App() {
    const [count, setCount] = useState(0);
    // console.log(jsonSchemaDefaults(global));
    useConfig({
        global: global_config_schema,
        editor: editor_config_schema,
    });

    return (
        <>
            <Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
        </>
    );
}

export default App;
