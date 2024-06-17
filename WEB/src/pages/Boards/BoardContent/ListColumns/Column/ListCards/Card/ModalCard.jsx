import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SendIcon from "@mui/icons-material/Send";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import EditIcon from "@mui/icons-material/Edit";
import { useCallback, useEffect, useState } from "react";
import { fToNow } from "~/utils/formatters";
import CardServices from "~/apis/CardServices";
import { toast } from "react-toastify";
import UploadServices from "~/apis/UploadServices";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogActions, DialogContentText } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  joinCardRoom,
  leaveCardRoom,
} from "~/redux/actions/socketAction";
import { useParams } from "react-router-dom";

function ModalCard({
  open,
  onClose,
  cardId,
  deadline,
  description,
  cover,
  fetchAndProcessBoardData,
}) {
  const socket = getSocket();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [deadlineUpdate, setDeadlineUpdate] = useState(deadline);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCover, setSelectedCover] = useState(null);
  const [filePreviewCover, setFilePreviewCover] = useState(cover);
  const [descriptionUpdate, setDescriptionUpdate] = useState(description);
  const [openCommentDialog, setOpenDeleteComment] = useState(false);
  const [openAttachmentDialog, setOpenDeleteAttachment] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const [attachmentIdToDelete, setAttachmentIdToDelete] = useState(null);
  const { boardId } = useParams();

  useEffect(() => {
    dispatch(connectSocket());

    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  const handleDeleteAttachment = () => {
    setOpenDeleteAttachment(true);
  };

  const handleCloseAttachmentDialog = () => {
    setOpenDeleteAttachment(false);
  };

  const handleDeleteComment = () => {
    setOpenDeleteComment(true);
  };

  const handleCloseCommentDialog = () => {
    setOpenDeleteComment(false);
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const fetchComments = useCallback(async () => {
    try {
      if (cardId) {
        const response = await CardServices.getAllComment(cardId);
        if (response?.status === 200) {
          setComments(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching card comment:", error);
    }
  }, [cardId]);

  const fetchAttachments = useCallback(async () => {
    try {
      if (cardId) {
        const response = await CardServices.getAllAttachment(cardId);
        if (response?.status === 200) {
          setAttachments(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching card attachment:", error);
    }
  }, [cardId]);

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

  const handleFileChangeCover = (event) => {
    const file = event.target.files[0];
    setSelectedCover(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviewCover(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmDeleteComment = async () => {
    try {
      if (commentIdToDelete) {
        const response = await CardServices.deleteComment(commentIdToDelete);
        if (response.status === 202) {
          toast.success("Comment deleted successfully");
          setOpenDeleteComment(false);
          if (socket) {
            socket.emit("deleteComment");
          } else {
            console.error("Socket is not initialized or disconnected.");
          }
          fetchComments();
        } else {
          toast.error(response.response.statusText);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error happen when delete comment");
    }
  };

  const handleConfirmDeleteAttachment = async () => {
    try {
      if (attachmentIdToDelete) {
        const response = await CardServices.deleteAttachment(
          attachmentIdToDelete
        );
        if (response.status === 202) {
          toast.success("Attachment deleted successfully");
          setOpenDeleteAttachment(false);
          fetchAttachments();
        } else {
          toast.error("Failed to delete attachment");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error happen when delete attachment");
    }
  };

  const handleUpdateCard = async () => {
    const formData = new FormData();
    formData.append("file", selectedCover);
    formData.append("description", descriptionUpdate);
    formData.append("deadline", deadlineUpdate);

    setIsLoading(true);
    try {
      const response = await UploadServices.updateCard(cardId, formData);
      if (response?.status === 201) {
        toast.success("Update card successfully");
        setSelectedCover(null);
        setFilePreviewCover(null);
        setOpenEditDialog(false);
        if (socket) {
          socket.emit("newCard", response.data);
        } else {
          console.error("Socket is not initialized or disconnected.");
        }
        fetchAndProcessBoardData(boardId);
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng kiểm tra lại!");
      }
    } catch (error) {
      console.error("Error uploading attachment:", error);
    } finally {
      setIsLoading(false);
      setSelectedCover(null);
      setFilePreviewCover(null);
      setOpenEditDialog(false);
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const commentData = { data: comment };
    try {
      const response = await CardServices.createComment(cardId, commentData);
      if (response.status === 201) {
        toast.success("Comment successfully");
        setComment("");
        if (socket) {
          socket.emit("newComment", response.data);
        } else {
          console.error("Socket is not initialized or disconnected.");
        }
        fetchComments();
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng kiểm tra lại!");
      }
    } catch (error) {
      console.error("Failed to add curriculum:", error);
      toast.error("Đã xảy ra lỗi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAttachment = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsLoading(true);
    try {
      const response = await UploadServices.uploadAttachment(cardId, formData);
      if (response?.status === 201) {
        toast.success("Upload attachment successfully");
        setSelectedFile(null);
        setFilePreview(null);
        if (socket) {
          socket.emit("newAttachment", response.data);
        } else {
          console.error("Socket is not initialized or disconnected.");
        }
        fetchAttachments();
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng kiểm tra lại!");
      }
    } catch (error) {
      console.error("Error uploading attachment:", error);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchAttachments();
  }, [cardId, fetchComments, fetchAttachments]);

  useEffect(() => {
    if (socket) {
      joinCardRoom(cardId);

      socket.on("newCard", () => {
        fetchAndProcessBoardData(boardId);
      });

      socket.on("newComment", () => {
        fetchComments();
      });

      socket.on("newAttachment", () => {
        fetchAttachments();
      });

      socket.on("deleteComment", () => {
        fetchComments();
      });

      socket.on("deleteAttachment", () => {
        fetchAttachments();
      });

      return () => {
        leaveCardRoom(cardId);
        socket.off("newComment");
        socket.off("newAttachment");
        socket.off("deleteComment");
        socket.off("deleteAttachment");
      };
    }
  }, [
    socket,
    cardId,
    fetchComments,
    fetchAttachments,
    boardId,
    fetchAndProcessBoardData,
  ]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            width: 800,
            maxHeight: "80vh",
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
            height={20}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Card Detail
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  fontStyle: "italic",
                  m: 1,
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="body1">
                  Deadline:{" "}
                  {deadlineUpdate ? fToNow(deadlineUpdate) : "No deadline"}
                </Typography>
              </Box>

              <IconButton onClick={handleOpenEditDialog}>
                <EditIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                mt: 3,
                py: 1,
                px: 2,
                bgcolor: "primary.white",
                borderRadius: 1,
                boxShadow: 4,
              }}
            >
              {cover && (
                <CardMedia
                  sx={{ height: 400, borderRadius: 1 }}
                  image={cover}
                />
              )}
              {descriptionUpdate && (
                <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
                  {descriptionUpdate}
                </Typography>
              )}
            </Box>

            <List>
              {comments?.map((comment, index) => (
                <ListItem key={index} alignItems="center">
                  <ListItemAvatar>
                    <Avatar
                      alt={comment.user.displayName}
                      src={comment.user.avatar}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={comment.user.displayName}
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {comment.content}
                      </Typography>
                    }
                  />
                  <Button
                    size="small"
                    color="grey"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setCommentIdToDelete(comment._id);
                      handleDeleteComment();
                    }}
                  ></Button>
                </ListItem>
              ))}
            </List>

            <List>
              {attachments?.map((attachment, index) => (
                <ListItem key={index} alignItems="center">
                  <ListItemAvatar>
                    <Avatar
                      alt={attachment.user.displayName}
                      src={attachment.user.avatar}
                    />
                  </ListItemAvatar>
                  <Stack>
                    <ListItemText primary={attachment.user.displayName} />
                    <CardMedia
                      sx={{ height: 200, width: 200 }}
                      image={attachment.fileURL}
                      alt={attachment.fileName}
                    />
                  </Stack>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    size="small"
                    color="grey"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setAttachmentIdToDelete(attachment._id);
                      handleDeleteAttachment();
                    }}
                  ></Button>
                </ListItem>
              ))}
            </List>

            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 2 }}
              alignItems="center"
            >
              <TextField
                label="Write a comment..."
                variant="outlined"
                fullWidth
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSendComment}>
                        {isLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <SendIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {filePreview && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 100, width: "auto", borderRadius: 1 }}
                    image={filePreview}
                    alt="Selected file preview"
                  />
                </Box>
              )}
              <IconButton component="label">
                <AddPhotoAlternateIcon />
                <input type="file" hidden onChange={handleFileChange} />
              </IconButton>
              <IconButton onClick={handleUploadAttachment}>
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <FileUploadIcon />
                )}
              </IconButton>
            </Stack>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="flex-end">
            <Button onClick={onClose} variant="outlined">
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Update Card</DialogTitle>
        <DialogContent>
          <Stack>
            <TextField
              id="outlined-basic"
              style={{ borderRadius: "2%", marginTop: "10px" }}
              name="description"
              label="Mô tả"
              variant="outlined"
              onChange={(e) => setDescriptionUpdate(e.target.value)}
              value={descriptionUpdate}
              multiline
              rows={4}
            />
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              marginTop={2}
            >
              <TextField
                id="deadline"
                variant="outlined"
                type="datetime-local"
                value={deadlineUpdate}
                onChange={(e) => setDeadlineUpdate(e.target.value)}
                name="deadline"
              />
              {filePreviewCover && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 200, width: "auto", borderRadius: 1 }}
                    image={filePreviewCover}
                    alt="Selected file preview"
                  />
                </Box>
              )}
              <IconButton component="label">
                <AddPhotoAlternateIcon />
                <input type="file" hidden onChange={handleFileChangeCover} />
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
              onClick={handleUpdateCard}
            >
              Update Card
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openCommentDialog}
        onClose={handleCloseCommentDialog}
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
            onClick={handleCloseCommentDialog}
            variant="outlined"
            color="warning"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteComment}
            color="error"
            autoFocus
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAttachmentDialog}
        onClose={handleCloseAttachmentDialog}
        aria-labelledby="alert-dialog-title-attachment"
        aria-describedby="alert-dialog-description-attachment"
      >
        <DialogTitle id="alert-dialog-title-attachment">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description-attachment">
            Are you sure you want to delete this attachment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseAttachmentDialog}
            variant="outlined"
            color="warning"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteAttachment}
            color="error"
            autoFocus
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ModalCard;
