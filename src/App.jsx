import { useConfig, ConfigForms } from "./react-localstorage-config";
import "./App.css";
import global_config_schema from "./schemas/global.json";
import editor_config_schema from "./schemas/editor.json";

function App() {
    const schemas = [global_config_schema, editor_config_schema];
    const { config, set_config } = useConfig(schemas);
    console.log(config);
    return <ConfigForms schemas={schemas} config={config} set_config={set_config} />;
}

export default App;
