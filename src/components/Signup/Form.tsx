import Input from "../Input"
import Submit from "../Submit"
import { axiosInstance } from "@/lib/axios";
import { useForm, type Resolver} from 'react-hook-form';
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"

const ACCEPTED_IMAGE_TYPES = [
 'image/jpeg',
 'image/jpg',
 'image/png',
 'image/webp',
]

const Form = ({ userType }: { userType: string }) => {
const [success, setSuccess] = useState(false);
const [isLoading, setIsLoading] = useState(false);
  const UserSchema = z.object({
    cedula: z.string().min(8, "Cedula must be at least 8 characters long").max(20, "Cedula must be at most 20 characters long"),
    firstName: z.string().min(1, "First name must be at least 1 character long").max(50, "First name must be at most 50 characters long"),
    lastName: z.string().min(1, "Last name must be at least 1 character long").max(50, "Last name must be at most 50 characters long"),
    username: z.string().min(5, "Username must be at least 5 characters long").max(50, "Username must be at most 50 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 characters long").max(15, "Phone number must be at most 15 characters long"),
    email: z.string().min(5, "Email must be at least 5 characters long").max(100, "Email must be at most 100 characters long").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(30, "Password must be at most 30 characters long"),
    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long").max(30, "Confirm Password must be at most 30 characters long"),
    profilePicture: z.any()
  .refine((files) => files?.length >= 1, { message: 'Image is required.' })
  .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
    message: '.jpg, .jpeg, .png and .webp files are accepted.',
   })
  .refine((files) => files?.[0]?.size <= 5000000, {
    message: `Max file size is 5MB.`,
   }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

  type UserData = z.infer<typeof UserSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<UserData>({
    resolver: zodResolver(UserSchema) as Resolver<UserData>
  });

  const onSubmit = async (data: UserData) => {
    setIsLoading(true);
    const apiUrl = userType === 'agent' ? '/account/register-agent-user' : '/account/register-customer-user';

    const formData = new FormData();
    formData.append("cedula", data.cedula);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("username", data.username);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    
    const fileList = data.profilePicture as FileList;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        formData.append("profilePicture", file, file.name);
        console.log('File appended:', file.name, file.type, file.size);
      }
      try{
        await axiosInstance.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess(true);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsLoading(false);
      }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 w-full max-w-[480px] text-center">
        {/* ✅ Icono de éxito */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* ✅ Mensaje de éxito */}
        <h2 className="text-2xl font-bold text-green-800 mb-3">
          Registration Successful! 🎉
        </h2>
        <p className="text-green-700 mb-6 leading-relaxed">
          Your account has been created successfully. You can now log in.
        </p>

        {/* ✅ Acciones */}
        <div className="flex flex-col gap-3 w-full">
          <a 
            href="/login" 
            className="bg-[#668A5C] hover:bg-[#557A49] text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4 p-4 w-full md:w-full max-w-[480px]" onSubmit={handleSubmit(onSubmit)} id="signup-form">
        <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1">
              <Input id="firstname" type="text" placeholder="First Name" register={register("firstName")} error={errors.firstName?.message} />
            </div>
            <div className="flex-1">
                <Input id="lastname" type="text" placeholder="Last Name" register={register("lastName")} error={errors.lastName?.message} />
            </div>
        </div>

        <Input id="cedula" type="text" placeholder="Cedula" register={register("cedula")} error={errors.cedula?.message} />
        <Input id="phone" type="text" placeholder="Phone" register={register("phone")} error={errors.phone?.message} />
        <Input id="username" type="text" placeholder="Username" register={register("username")} error={errors.username?.message} />
        <Input id="email" type="email" placeholder="Email" register={register("email")} error={errors.email?.message} />
        <Input id="password" type="password" placeholder="Password" register={register("password")} error={errors.password?.message} />
        <Input id="confirm-password" type="password" placeholder="Confirm Password" register={register("confirmPassword")} error={errors.confirmPassword?.message} />
        <input type="file" accept="image/*" id="profile-image" {...register("profilePicture")} />
        {errors.profilePicture && <span className="text-red-500 text-sm mt-1">{typeof errors.profilePicture === 'string' ? errors.profilePicture : (errors.profilePicture as any)?.message}</span>}
        <Submit formId="signup-form" submitText="Sign Up" disabled={isLoading} />
        <a href="/login" className="text-center text-[#668A5C]">Already have an account? Log in</a>
      </form>
  )
}

export default Form
