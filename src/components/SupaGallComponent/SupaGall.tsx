import { useState, useEffect } from "react";
import { supabase } from "../../store/SupabaseStore";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import ImageCard from "./ImageCard";

export default function SupaGall() {
  const [images, setImages] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getImages();
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erreur de déconnexion:', error.message);
    } else {
      navigate('/signin');
    }
  }

  async function getImages() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .storage
        .from('Images')
        .list(`${user.id}/`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" }
        });

      if (data !== null) {
        setImages(data.map(file => ({
            ...file,
            name: `${user.id}/${file.name}`  // Assurez-vous que le chemin complet est stocké
          })));
      } else {
        console.log('error when loading', error);
      }
    }
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const filePath = `${user.id}/${uuidv4()}-${file.name}`;
        const { data, error } = await supabase
          .storage
          .from('Images')
          .upload(filePath, file, {
            upsert: false,
            contentType: file.type
          });
        
        if (error) {
          console.log('Error uploading image:', error);
        } else if (data) {
          getImages();
          console.log('Image uploaded successfully:', data.path);
        }
      }
    }
  }

  async function deleteImage(imagePath: string) {
    const { error } = await supabase
      .storage
      .from('Images')
      .remove([imagePath]);

    if (error) {
      console.log('Error deleting image:', error);
    } else {
      getImages();
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">SupaGall</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Se déconnecter
        </Button>
      </div>
      
      <div className="mb-8">
        <Label htmlFor="picture" className="mb-2 block">Ajouter une image</Label>
        <Input 
          id="picture" 
          type="file" 
          accept="image/png, image/jpeg, image/jpg" 
          onChange={uploadImage}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            imagePath={image.name}
            fileName={(image.name.split('/').pop() || '').split('-').pop().replace(/\.[^/.]+$/, "") || ''}
            onDelete={() => deleteImage(image.name)}
          />
        ))}
      </div>
    </div>
  );
}