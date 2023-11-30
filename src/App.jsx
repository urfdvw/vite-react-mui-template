import { useConfig, ConfigForms } from "./react-localstorage-config";
import "./App.css";
import global_config_schema from "./schemas/global.json";
import editor_config_schema from "./schemas/editor.json";
import DarkTheme from "react-lazy-dark-theme";

function App() {
    const schemas = [global_config_schema, editor_config_schema];
    const { config, set_config } = useConfig(schemas);

    console.log(config);
    var dark = null;
    try {
        if (config.global.theme === "system") {
            dark = null;
        } else if (config.global.theme === "dark") {
            dark = true;
        }
    } catch {}
    return (
        <>
            <DarkTheme dark={dark} />
            <ConfigForms schemas={schemas} config={config} set_config={set_config} />
        </>
    );
}

export default App;
