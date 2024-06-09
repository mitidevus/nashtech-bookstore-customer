import toast from "react-hot-toast";

export function showSuccess(message: string, duration = 3000) {
  toast.success(message, {
    duration,
  });
}

export function showError(message: string) {
  toast.error(message);
}

export function showInfo(message: string) {
  toast(message);
}
