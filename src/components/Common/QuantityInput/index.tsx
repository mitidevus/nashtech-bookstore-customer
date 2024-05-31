import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, IconButton, TextField } from "@mui/material";

const QuantityInput = ({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: (value: number) => void;
}) => {
  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(Math.max(quantity - 1, 1));
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setQuantity(Number(value));
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton onClick={handleDecrease} aria-label="decrease">
        <RemoveIcon />
      </IconButton>

      <TextField
        type="text"
        size="small"
        value={quantity}
        onChange={handleChange}
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
          style: { textAlign: "center", width: "3rem" },
        }}
      />

      <IconButton onClick={handleIncrease} aria-label="increase">
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default QuantityInput;
