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
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

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
            <Divider />
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
            {/* <List dense={dense}>
                {generate(
                    <ListItem>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary="Single-line item" secondary={secondary ? "Secondary text" : null} />
                    </ListItem>
                )}
            </List> */}
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
