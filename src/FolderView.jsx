import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Button } from "@mui/material";

function BasicBreadcrumbs() {
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Button
                    onDrop={(event) => {
                        console.log("onDrop");
                        console.log(event);
                        console.log(JSON.parse(event.dataTransfer.getData("data")));
                    }}
                    onDragOver={(event) => {
                        event.preventDefault(); // to allow drop
                    }}
                >
                    hi
                </Button>
                <Button
                    draggable={true}
                    onDragStart={(event) => {
                        event.dataTransfer.setData("data", JSON.stringify({ hi: 1 })); // data has to be string
                    }}
                >
                    {" "}
                    there{" "}
                </Button>
                <Button> what's up </Button>
            </Breadcrumbs>
        </>
    );
}

function FolderView() {
    return (
        <>
            <BasicBreadcrumbs />
        </>
    );
}

export default FolderView;
