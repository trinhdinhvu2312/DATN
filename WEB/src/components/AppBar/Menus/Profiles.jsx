import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { logout } from "~/redux/actions/authActions";
import { clearLocalStorage } from "~/apis/agent";
import {
  Button,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { toast } from "react-toastify";
import UploadServices from "~/apis/UploadServices";

function Profiles({ user, fetchUserDetail }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [filePreview, setFilePreview] = useState();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [username, setUserName] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setFilePreview(user.avatar);
    setUserName(user.username);
  }, [user]);

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleLogout = () => {
    clearLocalStorage();
    dispatch(logout(navigate));
  };
  const handleUpdateUser = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("username", username);
    try {
      const response = await UploadServices.updateUser(formData);
      if (response?.status === 201) {
        toast.success("Update user successfully");
        setSelectedFile(null);
        setFilePreview(null);
        setOpenEditDialog(false);
        fetchUserDetail();
      } else {
        toast.error("Have something error. Please check!");
      }
    } catch (error) {
      console.error("Error uploading attachment:", error);
    } finally {
      setSelectedFile(null);
      setFilePreview(null);
      setOpenEditDialog(false);
    }
  };
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? "basic-menu-profiles" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt={user.displayName}
            src={user.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button-profiles",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: 170,
          },
        }}
      >
        <MenuItem>
          <Avatar
            sx={{ width: 28, height: 28, mr: 2 }}
            alt={user.displayName}
            src={user.avatar}
          />{" "}
          {user.displayName}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenEditDialog}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <Stack>
            <TextField
              id="outlined-basic"
              style={{ borderRadius: "2%", marginTop: "10px" }}
              name="username"
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
              Avatar
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {filePreview && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 200, width: "auto", borderRadius: 1 }}
                    image={filePreview}
                    alt="Selected file preview"
                  />
                </Box>
              )}
              <IconButton component="label">
                <AddPhotoAlternateIcon />
                <input type="file" hidden onChange={handleFileChange} />
              </IconButton>
            </Stack>
          </Stack>

          <Box display="flex" justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleCloseEditDialog}
              sx={{ mx: 1 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateUser}
            >
              Update User
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Profiles;
