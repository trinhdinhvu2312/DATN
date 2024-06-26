import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ModeSelect from "~/components/ModeSelect/ModeSelect";
import AppsIcon from "@mui/icons-material/Apps";
import { ReactComponent as TrelloIcon } from "~/assets/trello.svg";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import Workspaces from "./Menus/Workspaces";
import Profiles from "./Menus/Profiles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import BoardServices from "~/apis/BoardServices";
import { useDispatch, useSelector } from "react-redux";
import { createBoard, setBoard } from "~/redux/actions/boardActions";
import Link from "../Link";
import InviteService from "~/apis/InviteServices";
import NotificationPopover from "./Menus/NotificationsPopover";
import { setInvite } from "~/redux/actions/inviteActions";
import UserServices from "~/apis/UserServices";
import ReminderServices from "~/apis/ReminderServices";
import { setReminder } from "~/redux/actions/reminderActions";

function AppBar() {
  const dispatch = useDispatch();
  const invites = useSelector((state) => state.invite.invites);
  const [searchValue, setSearchValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("public");
  const [user, setUser] = useState({});

  const handleCreateClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const validateRegisterForm = (title, description) => {
    if (!title || !description) {
      return { isValid: false, message: "All fields are required." };
    }
    return { isValid: true };
  };

  const resetModalCreate = () => {
    setTitle("");
    setDescription("");
    setType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = validateRegisterForm(title, description);
    if (validationResult.isValid) {
      const response = await BoardServices.createBoard({
        title,
        description,
        type,
      });
      const boardData = await BoardServices.getAllBoard();
      if (response.status === 201) {
        const boardId = response.data._id;
        dispatch(createBoard(boardId));
        dispatch(setBoard(boardData));
        setModalOpen(false);
        resetModalCreate;
        toast.success("Create new board successfully");
      }
    } else {
      toast.error(validationResult.message);
    }
  };

  const getAllReminder = async (dispatch) => {
    try {
      const response = await ReminderServices.getAllReminder();
      if (response?.status === 200) {
        dispatch(setReminder(response.data));
      } else {
        console.error("API error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllInvite = async (dispatch) => {
    try {
      const response = await InviteService.getAllInvite();
      if (response?.status === 200) {
        dispatch(setInvite(response.data));
      } else {
        console.error("API error");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUserDetail = async () => {
    try {
      const response = await UserServices.getUser();
      if (response?.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserDetail();
  }, []);

  useEffect(() => {
    getAllInvite(dispatch);
    getAllReminder(dispatch);
  }, [dispatch]);

  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AppsIcon sx={{ color: "white" }} />
        <Link href={`/board`}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SvgIcon
              component={TrelloIcon}
              fontSize="small"
              inheritViewBox
              sx={{ color: "white" }}
            />

            <Typography
              variant="span"
              sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}
            >
              Trello
            </Typography>
          </Box>
        </Link>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Workspaces />
          <Button
            sx={{
              color: "white",
              border: "none",
              "&:hover": { border: "none" },
            }}
            variant="outlined"
            onClick={handleCreateClick}
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search..."
          type="text"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: searchValue ? "white" : "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setSearchValue("")}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: "120px",
            maxWidth: "180px",
            "& label": { color: "white" },
            "& input": { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "white" },
              "&.Mui-focused fieldset": { borderColor: "white" },
            },
          }}
        />

        <ModeSelect />

        <NotificationPopover getAllReminder={getAllReminder} />

        <Profiles user={user} fetchUserDetail={fetchUserDetail} />
      </Box>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            minWidth: 300,
            maxWidth: 400,
            borderRadius: 4,
            outline: "none",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Create New Board
          </Typography>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
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
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleCloseModal} color="error">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} variant="contained">
              Create
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

export default AppBar;
