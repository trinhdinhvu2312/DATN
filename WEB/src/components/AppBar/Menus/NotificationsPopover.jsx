import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useDispatch, useSelector } from "react-redux";
import { setInvite } from "~/redux/actions/inviteActions";
import UserServices from "~/apis/UserServices";
import BoardServices from "~/apis/BoardServices";
import { fToNow } from "~/utils/formatters";
import { Button, Modal } from "@mui/material";
import InviteService from "~/apis/InviteServices";

import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "~/redux/actions/socketAction";
import { setReminder } from "~/redux/actions/reminderActions";
import ReminderServices from "~/apis/ReminderServices";

function NotificationPopover({ getAllReminder, getAllInvite }) {
  const socket = getSocket();
  const dispatch = useDispatch();
  const invites = useSelector((state) => state.invite.invites);
  const reminders = useSelector((state) => state.reminder.reminders);
  const [notifications, setNotifications] = useState([]);

  const totalUnRead =
    invites?.filter((item) => item._destroy === false).length +
    reminders?.filter((item) => item._destroy === false).length;

  const [open, setOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);

  useEffect(() => {
    dispatch(connectSocket());

    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  const handleNotificationClick = (notification) => {
    if (notification.type === "invite") {
      setSelectedInvite(notification);
    } else if (notification.type === "reminder") {
      setSelectedReminder(notification);
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedInvite(null);
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    dispatch(
      setInvite(
        invites.map((item) => ({
          ...item,
          _destroy: true,
        }))
      )
    );

    dispatch(
      setReminder(
        reminders.map((item) => ({
          ...item,
          _destroy: true,
        }))
      )
    );
  };

  const getUserName = async (id) => {
    try {
      const response = await UserServices.getUserById(id);
      return response.data.username;
    } catch (error) {
      console.error(error);
    }
  };

  const getBoardName = async (id) => {
    try {
      const response = await BoardServices.getBoardDetails(id);
      return response.data.title;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const notificationsData = [];
      for (const invite of invites) {
        const inviterName = await getUserName(invite.inviterId);
        const boardName = await getBoardName(invite.boardInvitation.boardId);
        notificationsData.push({
          type: "invite",
          inviterName,
          boardName,
          item: invite,
        });
      }
      for (const reminder of reminders) {
        notificationsData.push({
          type: "reminder",
          item: reminder,
        });
      }
      setNotifications(notificationsData);
    }
    fetchData();
  }, [invites, reminders]);

  useEffect(() => {
    if (socket) {
      socket.on("getAllInvite", () => {
        getAllInvite(dispatch);
      });

      socket.on("getAllReminder", () => {
        getAllReminder(dispatch);
      });

      socket.on("newInvite", (invite) => {
        dispatch(setInvite([...invites, invite]));
      });

      socket.on("reminder", (reminder) => {
        dispatch(setReminder([...reminders, reminder]));
      });
    }

    return () => {
      if (socket) {
        socket.off("getAllReminder");
      }
    };
  }, [socket, getAllReminder, dispatch, reminders, getAllInvite, invites]);

  const handleConfirmJoin = async () => {
    try {
      if (selectedInvite) {
        if (selectedInvite.type === "invite") {
          await InviteService.acceptInvite(selectedInvite.item._id);
          dispatch(
            setInvite(
              invites.filter((item) => item._id !== selectedInvite.item._id)
            )
          );
        }
        handleModalClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmReminder = async () => {
    try {
      if (selectedReminder) {
        await ReminderServices.acceptReminder(selectedReminder.item._id);
        dispatch(
          setReminder(
            reminders.filter((item) => item._id !== selectedReminder.item._id)
          )
        );
        handleModalClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <IconButton color={open ? "primary" : "default"} onClick={handleOpen}>
        {totalUnRead > 0 ? (
          <Badge color="warning" variant="dot" sx={{ cursor: "pointer" }}>
            <NotificationsNoneIcon sx={{ color: "white" }} />
          </Badge>
        ) : (
          <NotificationsNoneIcon sx={{ color: "white" }} />
        )}
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <List>
          {notifications.map((notification, index) => (
            <Box key={index}>
              {notification.type === "invite" && (
                <ListItemButton
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    mt: "1px",
                    ...(notification.item._destroy && {
                      bgcolor: "action.selected",
                    }),
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "background.neutral" }}></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 0.5,
                          display: "flex",
                          alignItems: "center",
                          color: "text.primary",
                        }}
                      >
                        {notification.inviterName} invited you to join{" "}
                        {notification.boardName}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          display: "flex",
                          alignItems: "center",
                          color: "text.disabled",
                        }}
                      >
                        Created At {fToNow(notification.item.createdAt)}
                      </Typography>
                    }
                  />
                </ListItemButton>
              )}
              {notification.type === "reminder" && (
                <ListItemButton
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    mt: "1px",
                    ...(notification.item.completed && {
                      bgcolor: "action.selected",
                    }),
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "background.neutral" }}></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 0.5,
                          display: "flex",
                          alignItems: "center",
                          color: "text.primary",
                        }}
                      >
                        New Reminder: {notification.item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          display: "flex",
                          alignItems: "center",
                          color: "text.disabled",
                        }}
                      >
                        Created At {fToNow(notification.item.createdAt)} by{" "}
                        {notification.item.createdBy}
                      </Typography>
                    }
                  />
                </ListItemButton>
              )}
            </Box>
          ))}
        </List>
      </Popover>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" component="h2">
            {selectedInvite?.type === "invite"
              ? "Confirm Invitation"
              : "Confirm Reminder"}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {selectedInvite?.type === "invite"
              ? `Do you want to join the board ${selectedInvite?.item?.boardInvitation?.boardName}?`
              : `Do you want to acknowledge the reminder: ${selectedReminder?.item?.title}?`}
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleModalClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={
                selectedInvite?.type === "invite"
                  ? handleConfirmJoin
                  : handleConfirmReminder
              }
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default NotificationPopover;
