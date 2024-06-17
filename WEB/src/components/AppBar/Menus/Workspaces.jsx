import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useSelector } from "react-redux";
import Link from "~/components/Link";
import { Stack } from "@mui/material";

function Workspaces() {
  const boards = useSelector((state) => state.board.boards);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        sx={{ color: "white" }}
        id="basic-button-workspaces"
        aria-controls={open ? "basic-menu-workspaces" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Workspaces
      </Button>

      <Menu
        id="basic-menu-workspaces"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button-workspaces",
        }}
      >
        {boards.map((board) => (
          <MenuItem key={board._id}>
            <Link href={`/board/${board._id}`}>
              <Stack direction="row">
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{board.title}</ListItemText>
              </Stack>
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default Workspaces;
