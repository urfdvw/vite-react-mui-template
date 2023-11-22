# packages
- `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material`
- `npm install vite-plugin-singlefile`
- `npm install gh-pages`

# design
- local storage is the golden truth
- on start (process)
    - get default settings from the schemas, and store in a variable
    - check each field in the variable
        - if the field exists in the local storage, use that value in the variable
    - write back the variable to local storage
- on getting config
    - get the value from local storage
- SL
    - save: local storage to CircuitPy
    - load: CircuitPy to storage
    - name unchangable in the UI, but as a parameter in the function
- structure
    - each section of the config is a separated schema
        - this makes it easier to add new
- UI
    - buttons
        - if file system provided
            - save
            - load
        - else
            - export
            - import
        - defaults
    - each section is a tab

# Research

## how to get/set data from/to local storage
- `localStorage.setItem("myCat", "Tom");`
- `const cat = localStorage.getItem("myCat");`
- `localStorage.removeItem("myCat");`
    - (might not be used)
- example: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#examples

## how to get all defaults from schema
- ref: https://www.npmjs.com/package/json-schema-defaults

# Structure

- use_config
    - getConfield(
        section,
        field
    )
    - loadConfig(
        section,

    )

# issues

screen not refreshing when localstorage changed