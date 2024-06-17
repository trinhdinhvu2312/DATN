import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { capitalizeFirstLetter } from "~/utils/formatters";
import { useEffect, useState } from "react";
import BoardServices from "~/apis/BoardServices";
import { toast } from "react-toastify";
import { useCallback } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  joinBoard,
  leaveBoard,
} from "~/redux/actions/socketAction";
import { useDispatch } from "react-redux";
import { setReminder } from "~/redux/actions/reminderActions";

const MENU_STYLES = {
  color: "white",
  bgcolor: "transparent",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    bgcolor: "primary.50",
  },
};

const MAX_AVATARS_DISPLAYED = 6;

function BoardBar({ board }) {
  const socket = getSocket();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const remainingUsersCount = users.length - MAX_AVATARS_DISPLAYED;
  const [selectedAddUser, setSelectedAddUser] = useState([]);
  const [openBoardMemberModal, setOpenBoardMemberModal] = useState(false);
  const [openReminderModal, setOpenReminderModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    dispatch(connectSocket());

    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  const handleCheckboxChange = (userId) => {
    setSelectedAddUser((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOpenReminderModal = () => {
    setOpenReminderModal(true);
  };

  const handleCloseReminderModal = () => {
    setOpenReminderModal(false);
  };

  const handleOpenBoardMemberModal = () => {
    setOpenBoardMemberModal(true);
  };

  const handleCloseBoardMemberModal = () => {
    setOpenBoardMemberModal(false);
  };

  const fetchUsers = useCallback(async () => {
    try {
      if (board?._id) {
        const response = await BoardServices.getAllUserFromBoard(board?._id);
        if (response?.status === 200) {
          setUsers(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching card members:", error);
    }
  }, [board?._id]);

  const handleSendInvite = async () => {
    try {
      const payload = { email: email };
      const response = await BoardServices.inviteToBoard(board._id, payload);
      if (response.status === 201) {
        toast.success("Send invite successfully!");
        if (socket) {
          socket.emit("newInvite", response.data);
        } else {
          console.error("Socket is not initialized or disconnected.");
        }
        setOpen(false);
      } else {
        toast.error(response.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateReminder = async () => {
    try {
      const now = new Date();
      const validateDate = new Date(dueDate);
      if (validateDate < now) {
        toast.error("You must enter date greater than now");
      }
      const payload = {
        type,
        title,
        description,
        dueDate: new Date(dueDate),
      };

      if (type === "public") {
        payload.boardId = board._id;
      }

      socket.emit("createReminder", payload);
      toast.success("Reminder created successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUserFromBoard = async () => {
    try {
      if (selectedAddUser.length > 0) {
        const usersToDel = { users: selectedAddUser };
        const response = await BoardServices.pullMemberToBoard(
          board._id,
          usersToDel
        );
        if (response.status === 202) {
          toast.success("User add to card successfully");
          setSelectedAddUser([]);
          handleCloseBoardMemberModal();
          fetchUsers();
        } else {
          toast.error(response.response.statusText);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred while removing user(s)");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [board?._id, fetchUsers]);

  const handleSocketEvent = useCallback(
    (data) => {
      const reminderArr = [data];
      dispatch(setReminder(reminderArr));
    },
    [dispatch]
  );

  useEffect(() => {
    if (socket) {
      socket.on("newReminder", handleSocketEvent);
    }
  }, [socket, board?._id, handleSocketEvent]);

  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Invite by Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the email address of the person you want to invite:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmailChange}
          />
        </DialogContent>
        <DialogActions sx={{ marginRight: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSendInvite}
            variant="contained"
            color="primary"
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {board && (
          <Button
            variant="outlined"
            startIcon={<AccessAlarmIcon />}
            onClick={handleOpenReminderModal}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": { borderColor: "white" },
            }}
          >
            Reminder
          </Button>
        )}

        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          onClick={handleClickOpen}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: 16,
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-type": { bgcolor: "#a4b0be" },
            },
          }}
          onClick={handleOpenBoardMemberModal}
        >
          {users.slice(0, MAX_AVATARS_DISPLAYED).map((user, index) => (
            <Tooltip title={user.displayName} key={index}>
              <Avatar alt={user.displayName} src={user.avatar} />
            </Tooltip>
          ))}
          {remainingUsersCount > 0 && (
            <Tooltip title={`+${remainingUsersCount} others`}>
              <Avatar>{`+${remainingUsersCount}`}</Avatar>
            </Tooltip>
          )}
        </AvatarGroup>
      </Box>
      <Modal open={openBoardMemberModal} onClose={handleCloseBoardMemberModal}>
        <Box
          sx={{
            maxHeight: "80vh",
            width: 500,
            position: "absolute",
            top: "50%",
            left: "50%",
            borderRadius: 2,
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 12,
            p: 3,
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="h2">
              Board Members
            </Typography>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={handleDeleteUserFromBoard}
              startIcon={<DeleteIcon />}
            >
              Delete Member
            </Button>
          </Stack>

          <List>
            {users.map((user) => (
              <ListItem key={user.userId} sx={{ my: 1 }} alignItems="center">
                <ListItemAvatar>
                  <Avatar
                    src={user.avatar}
                    alt={user.displayName}
                    sx={{ width: 60, height: 60 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    paddingLeft: 4,
                    "& .MuiListItemText-primary": { fontSize: 18 },
                    "& .MuiListItemText-secondary": { fontSize: 14 },
                  }}
                  primary={user.displayName}
                  secondary={user.email}
                />
                <Checkbox
                  checked={selectedAddUser.includes(user.userId)}
                  onChange={() => handleCheckboxChange(user.userId)}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>

      <Dialog
        open={openReminderModal}
        onClose={handleCloseReminderModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create New Reminder</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              id="outlined-basic"
              style={{ borderRadius: "2%", marginTop: "10px" }}
              name="title"
              label="Tiêu đề"
              variant="outlined"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />

            <TextField
              id="outlined-basic"
              style={{ borderRadius: "2%", marginTop: "10px" }}
              name="description"
              label="Mô tả"
              variant="outlined"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              multiline
              rows={4}
            />

            <TextField
              id="deadline"
              variant="outlined"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              name="deadline"
              sx={{ width: "50%" }}
            />

            <FormControl fullWidth sx={{ mb: 2, width: "50%" }}>
              <InputLabel id="type-select-label">Type</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type"
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box display="flex" justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleCloseReminderModal}
              sx={{ mx: 1 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateReminder}
            >
              Create Reminder
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default BoardBar;
