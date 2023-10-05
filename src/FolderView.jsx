import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Button } from "@mui/material";

function BasicBreadcrumbs() {
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Button> hi </Button>
                <Button> there </Button>
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
