import Input from "@/components/Manage/Input"
import Select from "@/components/Manage/Select";
import Submit from "@/components/Submit";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, type SubmitHandler, type Resolver, type FieldError } from 'react-hook-form';
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { propertyStore } from "@/store/PropertyStore";
import saleTypeStore from "@/store/SaleTypeStore";
import { propertyTypeStore } from "@/store/PropertyTypeStore";
import useImprovementStore from "@/store/ImprovementStore";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type PropertyImage = {
  id: string;
  url: string;
  name: string;
  originalPath?: string; // Para almacenar la ruta original del backend
};

const ManageProperty = () => {
  const {id} = useParams();
  const {property, fetchPropertyById, createProperty, updateProperty} = propertyStore();
  const [currentImages, setCurrentImages] = useState<PropertyImage[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  
  const PropertySchema = z.object({
  id: z.number().optional(),
  description: z.string().min(10, "Description must be at least 10 characters long").max(500, "Description must be at most 500 characters long"),
  bathroomCount: z.number(),
  roomCount: z.number(),
  sizeInSquareMeters: z.number().min(1, "Size must be a positive number"),
  uniqueCode: z.string().optional(),
  price: z.number().min(1, "Price must be a positive number"),
  propertyTypeId: z.string().min(1, "Property type is required"),
  saleTypeId: z.string().min(1, "Sale type is required"),
  images: z
  .array(
    z.instanceof(File)
    .refine((file)=> file.size <= 5 * 1024 * 1024, "Máx 5MB")
    .refine(
          (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
          "Solo PNG o JPG")
    )
    .min(id ? 0 : 1, "Debe subir al menos una imagen")
    .max(5, "Máximo 5 imágenes").default([]),
  deletedImages: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  improvements: z.array(z.number()).default([]),
})

type PropertyData = z.infer<typeof PropertySchema>;

  const {
    register, handleSubmit, setValue, watch,
    formState: {errors},
  } = useForm<PropertyData>({
    resolver: zodResolver(PropertySchema) as Resolver<PropertyData>
  });
  
  const auth = useAuth();
  const navigate = useNavigate();
  const {saleTypes, fetchSaleTypes} = saleTypeStore();
  const {propertyTypes, fetchPropertyTypes} = propertyTypeStore();
  const {improvements, fetchImprovements} = useImprovementStore();
  const [amenities, setAmenities] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>();
  const handleDeleteImage = (imageId: string) => {
    const imageToDelete = currentImages.find(img => img.id === imageId);
    if (imageToDelete?.originalPath) {
      // Agregar la ruta original a deletedImages
      setDeletedImages(prev => [...prev, imageToDelete.originalPath!]);
    }
    // Remover de currentImages
    setCurrentImages(prev => prev.filter(img => img.id !== imageId));
  };

  const watchedAmenities = watch("improvements", amenities);

  const handleAmenityChange = (improvementId: number, isChecked: boolean) => {
    let newAmenities: number[];
    
    if (isChecked) {
      newAmenities = [...amenities, improvementId];
    } else {
      newAmenities = amenities.filter(id => id !== improvementId);
    }
    
    setAmenities(newAmenities);
    setValue("improvements", newAmenities);
  };

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);
  };

  const onSubmit: SubmitHandler<PropertyData> = async (data) => {
    setIsSubmitting(true);
    setBackendError(null);
    console.log('Form data received:', data);

    if (property && property?.images.length == deletedImages.length && newImages.length === 0){
      setBackendError("Debe subir al menos una imagen");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // ✅ Datos básicos de la propiedad
      formData.append('description', data.description);
      formData.append('roomCount', data.roomCount.toString());
      formData.append('bathroomCount', data.bathroomCount.toString());
      formData.append('sizeInSquareMeters', data.sizeInSquareMeters.toString());
      formData.append('price', data.price.toString());
      formData.append('propertyTypeId', data.propertyTypeId);
      formData.append('saleTypeId', data.saleTypeId);
      formData.append('agentId', auth?.user?.id || '');
      formData.append('uniqueCode', data.uniqueCode || '');
      console.log('Basic property data appended');

      // ✅ Amenities desde el estado local (hasta que se integre completamente)
      if (amenities.length > 0) {
        amenities.forEach(amenityId => {
          formData.append('improvements', amenityId.toString());
        });
      }

      // ✅ Nuevas imágenes desde el estado local
      if (newImages.length > 0) {
        newImages.forEach((file, index) => {
          if (file instanceof File) {
            formData.append('images', file, file.name);
            console.log(`Image ${index}:`, file.name, file.type, file.size);
          }
        });
        console.log('New images appended:', newImages.length);
      }

      if (id) {
        // ✅ Editar propiedad existente
        formData.append('id', id);
        formData.append('isAvailable', property?.isAvailable ? 'true' : 'false');
        
        // Imágenes eliminadas
        if (deletedImages.length > 0) {
          deletedImages.forEach(imagePath => {
            formData.append('deletedImages', imagePath);
          });
          console.log('Deleted images appended:', deletedImages);
        }
        
        console.log('Updating property...');
        await updateProperty(formData);
        console.log('Property updated successfully');
      } else {
        // ✅ Crear nueva propiedad
        formData.append('isAvailable', 'true');        
        console.log('Creating property...');
        await createProperty(formData);
        console.log('Property created successfully');
      }
      navigate('/listings');
      
    } catch (error: any) {
      console.error('Error submitting property:', error);
      setBackendError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const roles = auth?.roles;
    if (!roles || !roles.includes("Agent")) {
      navigate("/");
      return;
    }
    
    fetchPropertyTypes();
    fetchSaleTypes();
    fetchImprovements();
    
    if (id) {
      fetchPropertyById(parseInt(id));
    } else {
      propertyStore.setState({ property: null });
    }
  }, [id, auth?.roles, navigate]);

  useEffect(() => {
      setValue("description", property ? property.description : '');
      setValue("roomCount", property ? property.roomCount : 0);
      setValue("bathroomCount", property ? property.bathroomCount : 0);
      setValue("sizeInSquareMeters", property ? property.sizeInSquareMeters : 0);
      setValue("price", property ? property.price : 0);
      setValue("propertyTypeId", property ? property.propertyType?.id.toString() || '' : '');
      setValue("saleTypeId", property ? property.saleType?.id.toString() || '' : '');
      setValue("improvements", property ? property.improvements?.map(improvement => improvement.id) || [] : []);
      setValue("isAvailable", property ? property.isAvailable : false);
      setValue("id", property ? property.id : undefined);
      setValue("uniqueCode", property ? property.uniqueCode || '' : '');

      // Inicializar amenities desde la propiedad
      if (property && id) {
      setAmenities(property.improvements?.map(improvement => improvement.id) || []);

      // Configurar imágenes actuales con rutas originales
      setCurrentImages(property.images?.map((img, index) => ({
        id: (index + 1).toString(),
        url: import.meta.env.VITE_BACKEND_BASE_URL + img,
        name: img.split('/').pop() || `image-${index + 1}`,
        originalPath: img
      })) || []);
    }

  }, [property, id]);

  return (
    <div className="flex flex-col w-full max-w-[480px] gap-6">
      <h1 className="text-2xl font-bold pb-4">
        {id ? "Edit Property" : "List Property"}
      </h1>
      <form id="property-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {backendError && (
          <span className="text-sm text-red-600">{backendError}</span>
        )}
        <Select
          id="property-type"
          placeholder="Property type"
          options={propertyTypes.map(pt => ({ value: pt.id.toString(), label: pt.name}))}
          register={register("propertyTypeId")}
          error={errors.propertyTypeId?.message}
        />
        <Select
          id="sale-type"
          placeholder="Sale type"
          options={saleTypes.map(st => ({ value: st.id.toString(), label: st.name }))}
          register={register("saleTypeId")}
          error={errors.saleTypeId?.message}
        />
        <Input
          id="property-description"
          placeholder="Description"
          type="textarea"
          register={register("description")}
          error={errors.description?.message}
        />
        <Input
          id="property-rooms"
          placeholder="Rooms"
          type="number"
          register={register('roomCount', {valueAsNumber: true})}
          error={errors.roomCount?.message}
        />
        <Input
          id="property-bathrooms"
          placeholder="Bathrooms"
          type="number"
          register={register('bathroomCount', {valueAsNumber: true})}
          error={errors.bathroomCount?.message}
        />
        <Input
          id="property-size"
          placeholder="Size in square meters"
          type="number"
          register={register('sizeInSquareMeters', {valueAsNumber: true})}
          error={errors.sizeInSquareMeters?.message}
        />
        
        <p>Amenities:</p>
        <div className="flex flex-col gap-2">
          {improvements.map((improvement) => (
            <label key={improvement.id} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id={`amenity-${improvement.id}`} 
                value={improvement.id}
                onChange={(e) => handleAmenityChange(improvement.id, e.target.checked)}
                checked={watchedAmenities?.includes(improvement.id) || false}
              />
              <span>{improvement.name}</span>
            </label>
          ))}
        </div>

        <Input
          id="property-price"
          placeholder="Price"
          type="number"
          register={register('price', {valueAsNumber: true})}
          error={errors.price?.message}
        />

        {/* Current Images Section - Only show when editing */}
        {id && currentImages.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Current Images:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {currentImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img 
                    src={image.url} 
                    alt={image.name}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="property-image" className="block text-sm font-medium text-gray-700">
            {id ? "Add More Images:" : "Images:"}
          </label>
          <input 
            type="file" 
            accept="image/png, image/jpeg" 
            id="property-image" 
            multiple 
            onChange={handleNewImagesChange}
            required={!id && currentImages.length === 0}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#EBF2EB] file:text-[#619154] hover:file:bg-[#D6E5D1]"
          />
        </div>
        {errors.images && (<p className="text-sm text-red-600">{(errors.images as FieldError).message}</p>)}
        <Submit
          formId="property-form"
          submitText={isSubmitting ? "Saving..." : (id ? "Update Property" : "List Property")}
          disabled={isSubmitting}
        />
      </form>
    </div>
  )
}

export default ManageProperty