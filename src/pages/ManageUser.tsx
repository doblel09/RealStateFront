import {z} from 'zod'
import Input from "@/components/Manage/Input"
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import Submit from '@/components/Submit';
import { useAuth } from '@/hooks/useAuth';
import { userStore } from '@/store/UserStore';
import { useNavigate } from 'react-router-dom';

const ManageUser = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { isLoading, updateUser } = userStore();
  const UserSchema = z.object({
    firstName: z.string().min(1, "First name should be at least 1 character").max(20, "First name should be at most 20 characters"),
    lastName: z.string().min(1, "Last name should be at least 1 character").max(20, "Last name should be at most 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    phoneNumber: z.string().min(10, "Phone number should be at least 10 characters").max(15, "Phone number should be at most 15 characters"),
    cedula: z.string().min(10, "Cedula should be at least 10 characters").max(15, "Cedula should be at most 15 characters"),
    profilePicture: z.any()
    .optional()
    .refine((files) => {
        // Si no hay archivos, es válido
        if (!files || files.length === 0) return true;
        
        // Si hay archivos, verificar que el primero sea un File
        const file = files[0];
        return file instanceof File;
      }, "Must be a valid file")
      .refine((files) => {
        // Si no hay archivos, es válido
        if (!files || files.length === 0) return true;
        
        // Si hay archivos, verificar tamaño
        const file = files[0];
        return file.size <= 5 * 1024 * 1024;
      }, "Max 5MB")
      .refine((files) => {
        // Si no hay archivos, es válido
        if (!files || files.length === 0) return true;
        // Si hay archivos, verificar tipo
        const file = files[0];
        return ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
      }, "PNG or JPG only"),
  }).refine((data) => {
    const hasPassword = typeof data.password === "string" && data.password.length > 0;
    const hasConfirm = typeof data.confirmPassword === "string" && data.confirmPassword.length > 0;

    if (hasPassword && hasConfirm) {
      return data.password === data.confirmPassword;
    }

    if (hasPassword !== hasConfirm) {
      return false;
    }

    return true;
  }, { 
    message: "Both password fields must be filled and match",
    path: ["confirmPassword"]
  });

  useEffect(() => {
    setValue("firstName", auth?.user?.firstName || "");
    setValue("lastName", auth?.user?.lastName || "");
    setValue("email", auth?.user?.email || "");
    setValue("phoneNumber", auth?.user?.phoneNumber || "");
    setValue("cedula", auth?.user?.cedula || "");
  }, [auth?.user]);

  type UserData = z.infer<typeof UserSchema>;

  const {
      register, handleSubmit, setValue,
      formState: {errors},
    } = useForm<UserData>({
      resolver: zodResolver(UserSchema) as Resolver<UserData>
    });

  const onSubmit = (data: UserData) => {
    const formData = new FormData();
    try{
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("cedula", data.cedula);

      if (data.profilePicture && data.profilePicture.length > 0) {
        const file = data.profilePicture[0] as File; // ✅ Obtener el primer archivo del FileList
        formData.append("profilePicture", file, file.name);
      }
      if (data.password) {
        formData.append("password", data.password);
      }
      if (data.confirmPassword) {
        formData.append("confirmPassword", data.confirmPassword);
      }

      updateUser(formData);
      navigate(-1);
    }catch(error){
      console.error("Error preparing form data:", error);
    }
  }

  return (
     <div className='w-full'>        
      <h1 className="text-2xl font-bold">Manage my account</h1>
      <form id="manage-user-form" className='mt-4 flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" id="firstName" placeholder="First Name" register={register("firstName")} error={errors.firstName?.message} />
        <Input type="text" id="lastName" placeholder="Last Name" register={register("lastName")} error={errors.lastName?.message} />
        <Input type="email" id="email" placeholder="Email" register={register("email")} error={errors.email?.message} />
        <Input type="password" id="password" placeholder="New password" register={register("password")} error={errors.password?.message} />
        <Input type="password" id="confirmPassword" placeholder="Confirm new password" register={register("confirmPassword")} error={errors.confirmPassword?.message} />
        <Input type="text" id="phoneNumber" placeholder="Phone" register={register("phoneNumber")} error={errors.phoneNumber?.message} />
        <Input type="text" id="cedula" placeholder="Cedula" register={register("cedula")} error={errors.cedula?.message} />
        
        <label htmlFor="profilePicture" className="block md:inline-block">
          Change profile picture
        </label>
        <input type="file" id="profilePicture" accept="image/*" {...register("profilePicture")} />
        {errors.profilePicture && (
          <span className="text-red-500 text-sm mt-1">
            {typeof errors.profilePicture?.message === "string" ? errors.profilePicture?.message : "Invalid file type"}
          </span>
        )}
        <Submit formId='manage-user-form' submitText='Update' disabled={isLoading} />
        </form>
    </div>
  )
}

export default ManageUser
