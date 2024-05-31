import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import * as EmailValidator from "email-validator";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useLoginMutation } from "store/api/user/userApiSlice";
import { LoginDto } from "types/auth";

export default function Login() {
  const theme = useTheme();

  const [requestLogin, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors: formError },
  } = useForm<LoginDto>();

  const onSubmit: SubmitHandler<LoginDto> = async (data) => {
    requestLogin(data).unwrap();
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: `calc(100dvh - ${theme.layout.headerHeight})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        sx={{
          position: "absolute",
          width: "100vw",
          height: "100%",
          filter: "brightness(0.6)",
        }}
        src="https://assets-mainlinetoday-com.s3.amazonaws.com/2023/12/bookstore.jpg"
        alt="login"
      />

      <Box
        component="form"
        autoComplete="off"
        sx={{
          position: "relative",
          minWidth: 400,
          maxWidth: 450,
          px: 6,
          py: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Welcome back!
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            color: "gray",
            textAlign: "center",
          }}
        >
          Log in to access your account
        </Typography>

        <Box
          sx={{
            mt: 4,
          }}
        >
          <Stack direction="column" spacing={2}>
            <FormControl fullWidth error={!!formError.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                {...register("email", {
                  required: "Email is required!",
                  validate: (value) =>
                    EmailValidator.validate(value) || "Invalid email address!",
                })}
                id="email"
                placeholder="Enter your email"
                error={!!formError.email}
                aria-describedby="email-helper-text"
                size="small"
                disabled={isLoading}
              />
              <FormHelperText id="email-helper-text">
                {formError.email?.message}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!formError.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                {...register("password", {
                  required: "Password is required!",
                })}
                id="password"
                type="password"
                placeholder="Enter your password"
                error={!!formError.password}
                aria-describedby="password-helper-text"
                size="small"
                disabled={isLoading}
              />
              <FormHelperText id="password-helper-text">
                {formError.password?.message}
              </FormHelperText>
            </FormControl>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            sx={{ mt: 4, color: "white", width: "100%" }}
          >
            {isLoading ? "Loading ..." : "Login"}
          </Button>

          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              mt: 2,
              textAlign: "center",
              "& a": {
                textDecoration: "none",
                color: "primary.main",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
            }}
          >
            Don’t have an account yet? <Link to="/signup">Sign up</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
