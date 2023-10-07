import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

function FolderPath() {
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
            <Divider />
        </>
    );
}

function FolderContent() {
    return (
        <List>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <InsertDriveFileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                </ListItemButton>
            </ListItem>
        </List>
    );
}

function AddEntry() {
    const actions = [
        { icon: <InsertDriveFileIcon />, name: "new file" },
        { icon: <FolderIcon />, name: "new folder" },
    ];
    return (
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            {actions.map((action) => (
                <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
            ))}
        </SpeedDial>
    );
}

function FolderView() {
    return (
        <>
            <FolderPath />
            <FolderContent />
            <AddEntry />
        </>
    );
}

export default FolderView;
