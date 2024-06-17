import {
  Box,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CardServices from "~/apis/CardServices";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import BoardServices from "~/apis/BoardServices";
import { useParams } from "react-router-dom";

function MemberModal({ open, onClose, cardId, fetchAndProcessBoardData }) {
  const { boardId } = useParams();
  const [users, setUsers] = useState([]);
  const [userIdsToDelete, setUserIdsToDelete] = useState([]);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openBoardMemberModal, setOpenBoardMemberModal] = useState(false);
  const [usersInBoard, setUsersInBoard] = useState([]);
  const [selectedAddUser, setSelectedAddUser] = useState([]);

  const handleUserDeletion = (userId) => {
    setUserIdsToDelete((prevUserIds) => {
      if (prevUserIds.includes(userId)) {
        return prevUserIds.filter((id) => id !== userId);
      } else {
        return [...prevUserIds, userId];
      }
    });
    handleDeleteUser();
  };

  const handleCheckboxChange = (userId) => {
    setSelectedAddUser((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleDeleteUser = () => {
    setOpenAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
  };

  const handleOpenBoardMemberModal = () => {
    setOpenBoardMemberModal(true);
  };

  const handleCloseBoardMemberModal = () => {
    setOpenBoardMemberModal(false);
  };

  const fetchUsers = useCallback(async () => {
    try {
      if (cardId) {
        const response = await CardServices.getAllUserFromCard(cardId);
        if (response?.status === 200) {
          setUsers(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching card members:", error);
    }
  }, [cardId]);

  const fetchUsersInBoard = useCallback(async () => {
    try {
      if (boardId) {
        const response = await BoardServices.getAllUserFromBoard(boardId);
        if (response?.status === 200) {
          const filteredUsersInBoard = response.data.filter(
            (userInBoard) =>
              !users.find((user) => user.userId === userInBoard.userId)
          );
          setUsersInBoard(filteredUsersInBoard);
        }
      }
    } catch (error) {
      console.error("Error fetching card members:", error);
    }
  }, [boardId, users]);

  const handleAddUserToCard = async () => {
    try {
      if (selectedAddUser.length > 0) {
        const usersToAdd = { users: selectedAddUser };
        const response = await CardServices.pushMemberToCard(
          cardId,
          usersToAdd
        );
        if (response.status === 202) {
          toast.success("User add to card successfully");
          setOpenAddUserDialog(false);
          setSelectedAddUser([]);
          handleCloseBoardMemberModal();
          fetchUsers();
          fetchAndProcessBoardData(boardId);
        } else {
          toast.error(response.response.statusText);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred while add user(s)");
    }
  };

  const handleConfirmDeleteUser = async () => {
    try {
      if (userIdsToDelete.length > 0) {
        const usersToDelete = { users: userIdsToDelete };
        const response = await CardServices.pullMemberToCard(
          cardId,
          usersToDelete
        );
        if (response.status === 202) {
          toast.success("User removed from card successfully");
          setOpenAddUserDialog(false);
          setUserIdsToDelete([]);
          fetchUsers();
          fetchAndProcessBoardData(boardId);
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
    fetchUsersInBoard();
  }, [boardId, fetchUsersInBoard]);

  useEffect(() => {
    fetchUsers();
  }, [cardId, fetchUsers]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
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
              Card Members
            </Typography>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={handleOpenBoardMemberModal}
              startIcon={<AddIcon />}
            >
              Add Member
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
                <IconButton
                  onClick={() => {
                    handleUserDeletion(user.userId);
                    handleDeleteUser();
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>

      <Dialog
        open={openAddUserDialog}
        onClose={handleCloseAddUserDialog}
        aria-labelledby="alert-dialog-title-comment"
        aria-describedby="alert-dialog-description-comment"
      >
        <DialogTitle id="alert-dialog-title-comment">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description-comment">
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseAddUserDialog}
            variant="outlined"
            color="warning"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteUser}
            color="error"
            autoFocus
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
              color="primary"
              variant="contained"
              onClick={handleAddUserToCard}
              startIcon={<AddIcon />}
            >
              Add Member
            </Button>
          </Stack>

          <List>
            {usersInBoard.map((user) => (
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
    </>
  );
}

export default MemberModal;
