import React from 'react';
import { supabase } from "../../store/SupabaseStore";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImageCardProps {
  imagePath: string;
  fileName: string;
  onDelete: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ imagePath, fileName, onDelete }) => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSignedUrl = async () => {
      const { data, error } = await supabase
        .storage
        .from('Images')
        .createSignedUrl(imagePath, 3600); // URL valide pendant 1 heure

      if (error) {
        console.error('Error creating signed URL:', error);
      } else if (data) {
        setImageUrl(data.signedUrl);
      }
    };

    fetchSignedUrl();
  }, [imagePath]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {imageUrl && (
          <img 
            className="w-full h-48 object-cover" 
            src={imageUrl} 
            alt={fileName} 
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <p className="font-medium text-sm truncate w-full">{fileName}</p>
        <Button variant="destructive" onClick={onDelete} className="w-full">
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;