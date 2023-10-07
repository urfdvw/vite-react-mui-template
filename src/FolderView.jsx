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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function ApplyContextMenu({ children, items }) {
    const [contextMenu, setContextMenu] = React.useState(null);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX,
                      mouseY: event.clientY,
                  }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                  null
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    return (
        <>
            <div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
                {children}
                <Menu
                    open={contextMenu !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
                    }
                >
                    {items.map((item) => {
                        return (
                            <MenuItem
                                key={crypto.randomUUID()}
                                onClick={() => {
                                    handleClose();
                                    item.handler();
                                }}
                            >
                                {item.name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </div>
        </>
    );
}

function ContentFolderEntry() {
    const items = [
        {
            name: "rename",
            handler: () => {
                console.log("rename handler called");
            },
        },
        {
            name: "duplicate",
            handler: () => {
                console.log("duplicate handler called");
            },
        },
        {
            name: "remove",
            handler: () => {
                console.log("remove handler called");
            },
        },
    ];
    return (
        <ApplyContextMenu items={items}>
            <ListItem
                disablePadding
                draggable={true}
                onDragStart={(event) => {
                    event.dataTransfer.setData("data", JSON.stringify({ hi: 1 })); // data has to be string
                }}
            >
                <ListItemButton>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                </ListItemButton>
            </ListItem>
        </ApplyContextMenu>
    );
}

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
                    there
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
            <ContentFolderEntry />
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
