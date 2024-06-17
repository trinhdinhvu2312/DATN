import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card as MuiCard,
  Stack,
} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CardServices from "~/apis/CardServices";
import MemberModal from "./MemberModal";
import ModalCard from "./ModalCard";
import { useParams } from "react-router-dom";

function Card({ card, fetchAndProcessBoardData }) {
  const { boardId } = useParams();
  const [isCompleted, setIsCompleted] = useState(card?.completed || false);
  const [checkCompleted, setCheckCompleted] = useState(null);
  const [isModalMemberOpen, setIsModalMemberOpen] = useState(false);
  const [isModalCardOpen, setIsModalCardOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModalCard = () => {
    setIsModalCardOpen(true);
  };

  const handleCloseModalCard = () => {
    setIsModalCardOpen(false);
  };

  const handleOpenModalMember = () => {
    setIsModalMemberOpen(true);
  };

  const handleCloseModalMember = () => {
    setIsModalMemberOpen(false);
  };

  const handleChange = (event) => {
    setIsCompleted(event.target.checked);
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: { ...card },
  });
  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #2ecc71" : undefined,
  };

  const shouldShowCardActions = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    );
  };

  const handleConfirmDelete = async () => {
    try {
      if (card._id) {
        const response = await CardServices.deleteCard(card._id);
        if (response.status === 200) {
          toast.success("Card deleted successfully");
          fetchAndProcessBoardData(boardId);
          setOpen(false);
        } else {
          toast.error("Failed to delete card");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Some error happen when delete card");
    }
  };

  useEffect(() => {
    async function updateCardStatus() {
      try {
        const completeStatus = {
          completed: isCompleted,
        };
        const response = await CardServices.updateCardCompletedStatus(
          card._id,
          completeStatus
        );
        if (response) {
          setCheckCompleted(response.completed);
        }
      } catch (error) {
        console.error("Error updating card status:", error);
        toast.error("Failed to update task status");
      }
    }

    if (isCompleted !== checkCompleted) {
      updateCardStatus();
    }
  }, [isCompleted, card._id, checkCompleted]);

  return (
    <>
      <MuiCard
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        sx={{
          cursor: "pointer",
          boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
          overflow: "unset",
          display: card?.FE_PlaceholderCard ? "none" : "block",
          border: "1px solid transparent",
          "&:hover": { borderColor: (theme) => theme.palette.primary.main },
        }}
      >
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}
        <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                ...(isCompleted && {
                  textDecoration: "line-through",
                  color: "text.disabled",
                }),
              }}
              onClick={handleOpenModalCard}
            >
              {card?.title}
            </Typography>
            <Checkbox checked={isCompleted} onChange={handleChange} />
          </Stack>
        </CardContent>
        {shouldShowCardActions() && (
          <CardActions
            sx={{
              p: "0 4px 8px 4px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {!!card?.memberIds?.length && (
              <Button
                size="small"
                startIcon={<GroupIcon />}
                onClick={handleOpenModalMember}
              >
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button
                size="small"
                startIcon={<CommentIcon />}
                onClick={handleOpenModalCard}
              >
                {card?.comments?.length}
              </Button>
            )}
            {!!card?.attachments?.length && (
              <Button
                size="small"
                startIcon={<AttachmentIcon />}
                onClick={handleOpenModalCard}
              >
                {card?.attachments?.length}
              </Button>
            )}

            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            ></Button>
          </CardActions>
        )}
      </MuiCard>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this card?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="warning">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <MemberModal
        open={isModalMemberOpen}
        onClose={handleCloseModalMember}
        cardId={card?._id}
        fetchAndProcessBoardData={fetchAndProcessBoardData}
      />
      <ModalCard
        open={isModalCardOpen}
        onClose={handleCloseModalCard}
        cardId={card?._id}
        deadline={card?.deadline}
        description={card?.description}
        comments={card?.comments}
        attachments={card?.attachments}
        cover={card?.cover}
        fetchAndProcessBoardData={fetchAndProcessBoardData}
      />
    </>
  );
}

export default Card;
