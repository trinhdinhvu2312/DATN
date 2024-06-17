import Container from "@mui/material/Container";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BoardServices from "~/apis/BoardServices";
import { useEffect, useState } from "react";
import Link from "~/components/Link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import EditIcon from "@mui/icons-material/Edit";
import { setBoard } from "~/redux/actions/boardActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { connectSocket } from "~/redux/actions/socketAction";

function Boards() {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.board.boards);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [openBoardDialog, setOpenBoard] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openDeleteBoard, setOpenDeleteBoard] = useState(false);
  const [boardIdToDel, setBoardIdToDel] = useState(null);

  const handleOpenBoardDialog = () => {
    setOpenBoard(true);
  };

  const handleCloseBoardDialog = () => {
    setOpenBoard(false);
  };

  const handleOpenDeleteBoard = (boardId) => {
    setBoardIdToDel(boardId);
    setOpenDeleteBoard(true);
  };

  const handleCloseDeleteBoard = () => {
    setOpenDeleteBoard(false);
  };

  const handleEditBoard = async () => {
    try {
      const data = {
        title,
        description,
      };
      if (selectedBoard) {
        const response = await BoardServices.updateContent(selectedBoard, data);
        if (response.status === 201) {
          getAllBoard(dispatch);
          toast.success("Board edit successfully");
          setOpenBoard(false);
        } else {
          toast.error("Failed to edit board");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error happen when edit board");
    }
  };

  const getAllBoard = async (dispatch) => {
    try {
      const response = await BoardServices.getAllBoard();
      dispatch(setBoard(response));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      if (boardIdToDel) {
        const response = await BoardServices.deleteBoard(boardIdToDel);
        if (response.status === 200) {
          toast.success("Board deleted successfully");
          setOpenDeleteBoard(false);
          getAllBoard(dispatch);
        } else {
          toast.error(response.response.statusText);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error happen when delete board");
    }
  };

  useEffect(() => {
    dispatch(connectSocket());
  }, [dispatch]);

  useEffect(() => {
    getAllBoard(dispatch);
  }, [dispatch]);

  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar />
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <Stack direction="row" spacing={2} marginLeft={2} marginTop={1}>
          {boards.map((board) => (
            <Card key={board._id} sx={{ width: 250 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom={2}
                >
                  <Link href={`/board/${board._id}`}>
                    <Typography variant="h5" component="div">
                      {board.title}
                    </Typography>
                  </Link>
                  <Tooltip title="More options">
                    <ExpandMoreIcon
                      sx={{ color: "text.primary", cursor: "pointer" }}
                      id="basic-column-dropdown"
                      aria-controls={
                        open ? "basic-menu-column-dropdown" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    />
                  </Tooltip>
                  <Menu
                    id="basic-menu-column-dropdown"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-column-dropdown",
                    }}
                  >
                    <MenuItem
                      sx={{
                        "&:hover": {
                          color: "success.light",
                          "& .add-card-icon": { color: "success.light" },
                        },
                      }}
                      onClick={() => {
                        setSelectedBoard(board._id);
                        handleOpenBoardDialog();
                      }}
                    >
                      <ListItemIcon>
                        <EditIcon className="add-card-icon" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Edit this board</ListItemText>
                    </MenuItem>
                    <MenuItem
                      sx={{
                        "&:hover": {
                          color: "warning.dark",
                          "& .delete-forever-icon": { color: "warning.dark" },
                        },
                      }}
                      onClick={() => handleOpenDeleteBoard(board._id)}
                    >
                      <ListItemIcon>
                        <DeleteForeverIcon
                          className="delete-forever-icon"
                          fontSize="small"
                        />
                      </ListItemIcon>
                      <ListItemText>Delete this board</ListItemText>
                    </MenuItem>
                  </Menu>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {board.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
      <Dialog
        open={openBoardDialog}
        onClose={handleCloseBoardDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Update Board</DialogTitle>
        <DialogContent>
          <Stack>
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
          </Stack>

          <Box display="flex" justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleCloseBoardDialog}
              sx={{ mx: 1 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditBoard}
            >
              Update Board
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDeleteBoard}
        onClose={handleCloseDeleteBoard}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this board?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteBoard} color="warning">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteBoard}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
export default Boards;
