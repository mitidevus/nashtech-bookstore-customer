import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as EmailValidator from "email-validator";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "store/api/user/userApiSlice";
import { SignUpDto } from "types/auth";
import { showSuccess } from "utils/toast";

type FormType = SignUpDto & {
  confirmPassword: string;
};

export default function Signup() {
  const navigate = useNavigate();

  const [requestSignup, { isLoading: isSubmitting }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors: formError },
    watch,
  } = useForm<FormType>();
  const formValue = watch();

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const { confirmPassword, ...submitData } = data;

    await requestSignup(submitData).unwrap();

    showSuccess("Sign up successfully! Please log in to continue.");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
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
          borderRadius: 2,
          backgroundColor: "white",
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
          Create an account
        </Typography>

        <Typography
          variant="subtitle2"
          sx={{
            color: "gray",
            textAlign: "center",
          }}
        >
          Sign up to get started!
        </Typography>

        <Box
          sx={{
            mt: 2,
          }}
        >
          <Stack direction="column" spacing={2}>
            <FormControl fullWidth error={!!formError.name}>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                {...register("name", {
                  required: "Full name is required!",
                  minLength: {
                    value: 3,
                    message: "Full name must be at least 3 characters!",
                  },
                })}
                id="name"
                placeholder="Enter your name"
                error={!!formError.name}
                aria-describedby="name-helper-text"
                size="small"
                sx={{
                  backgroundColor: "white",
                }}
                disabled={isSubmitting}
              />
              <FormHelperText id="name-helper-text">
                {formError.name?.message}
              </FormHelperText>
            </FormControl>

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
                sx={{
                  backgroundColor: "white",
                }}
                disabled={isSubmitting}
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
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters!",
                  },
                  maxLength: {
                    value: 20,
                    message: "Password must be at most 20 characters!",
                  },
                  validate: {
                    hasNumber: (value) =>
                      /\d/.test(value) || "Password must contain a number!",
                    hasUppercase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must contain an uppercase letter!",
                    hasLowercase: (value) =>
                      /[a-z]/.test(value) ||
                      "Password must contain a lowercase letter!",
                  },
                })}
                id="password"
                type="password"
                placeholder="Enter your password"
                error={!!formError.password}
                aria-describedby="password-helper-text"
                size="small"
                sx={{
                  backgroundColor: "white",
                }}
                disabled={isSubmitting}
              />
              <FormHelperText id="password-helper-text">
                {formError.password?.message}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!formError.confirmPassword}>
              <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
              <TextField
                {...register("confirmPassword", {
                  required: "Confirm password is required!",
                  validate: (value) =>
                    value === formValue.password ||
                    `Password confirmation doesn't match!`,
                })}
                id="confirmPassword"
                type="password"
                placeholder="Enter your confirm password"
                error={!!formError.confirmPassword}
                aria-describedby="confirmPassword-helper-text"
                size="small"
                sx={{
                  backgroundColor: "white",
                }}
                disabled={isSubmitting}
              />
              <FormHelperText id="confirmPassword-helper-text">
                {formError.confirmPassword?.message}
              </FormHelperText>
            </FormControl>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            sx={{ mt: 4, color: "white", width: "100%" }}
          >
            {isSubmitting ? "Loading ..." : "Get started"}
          </Button>

          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              mt: 2,
              textAlign: "center",
              "& a": {
                textDecoration: "none",
                color: (theme) => theme.palette.primary.main,
                "&:hover": {
                  textDecoration: "underline",
                },
              },
            }}
          >
            Already have an account? <Link to="/login">Log in</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
