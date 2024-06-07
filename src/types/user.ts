export type User = {
  id: string;
  email: string;
  name: string;
  image: string;
  address: string;
  phone: string;
};

export type EditProfileDto = {
  name?: string;
  phone?: string;
  address?: string;
  image?: File;
};
