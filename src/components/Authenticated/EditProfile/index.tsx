import { PhotoCamera } from "@mui/icons-material";
import { Avatar, Box, Button, Paper, TextField } from "@mui/material";
import axios from "axios";
import { Breadcrumbs } from "components/Common/Breadcrumbs";
import { ACCESS_TOKEN, API_URL } from "constants/app";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store";
import { selectUserInfo, setUserInfo } from "store/slice/userSlice";
import { EditProfileDto } from "types/user";
import { storage } from "utils/storage";
import { showSuccess } from "utils/toast";

export default function EditProfile() {
  const userInfo = useAppSelector(selectUserInfo);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
  } = useForm<EditProfileDto>({
    defaultValues: {
      name: userInfo?.name,
      phone: userInfo?.phone,
      address: userInfo?.address,
    },
  });

  const onSubmit: SubmitHandler<EditProfileDto> = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", data.name || "");
      formData.append("phone", data.phone || "");
      formData.append("address", data.address || "");
      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await axios.patch(`${API_URL}/auth/me`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${storage.getItem(ACCESS_TOKEN)}`,
        },
      });

      dispatch(setUserInfo(res.data));

      navigate("/profile");

      showSuccess("Edit profile successfully");
      return;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [preview, setPreview] = useState<string | null>(
    userInfo?.image || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Breadcrumbs />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            padding: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            minWidth: 400,
            maxWidth: 450,
            p: 4,
          }}
        >
          <Box
            sx={{
              position: "relative",
              "&:hover .avatar-overlay": {
                opacity: 1,
              },
            }}
          >
            <Avatar
              alt="avatar"
              src={preview || userInfo?.image}
              sx={{
                width: 120,
                height: 120,
              }}
            />
            <Box
              className="avatar-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                opacity: 0,
                transition: "opacity 0.3s",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("image-input")?.click()}
            >
              <PhotoCamera sx={{ color: "white" }} />
            </Box>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Box>

          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              width: "100%",
            }}
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="name"
              control={control}
              disabled={isLoading}
              rules={{
                required: "Name is required",
                maxLength: {
                  value: 20,
                  message: "Name should not exceed 20 characters",
                },
                minLength: {
                  value: 3,
                  message: "Name should be at least 3 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="name"
                  label="Name"
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              disabled={isLoading}
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Invalid phone number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  variant="outlined"
                  size="small"
                  error={!!errors.phone}
                  helperText={errors.phone ? errors.phone.message : ""}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              disabled={isLoading}
              rules={{
                required: "Address is required",
                maxLength: {
                  value: 100,
                  message: "Address should not exceed 100 characters",
                },
                minLength: {
                  value: 10,
                  message: "Address should be at least 10 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="address"
                  label="Address"
                  variant="outlined"
                  size="small"
                  error={!!errors.address}
                  helperText={errors.address ? errors.address.message : ""}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={isLoading || !isDirty}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
