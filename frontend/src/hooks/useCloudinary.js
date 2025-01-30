import { useMutation, gql } from '@apollo/client';

const GET_SIGNED_UPLOAD_URL = gql`
  mutation GetSignedUploadUrl {
    getSignedUploadUrl {
      signature
      timestamp
      apiKey
    }
  }
`;

export function useCloudinary() {
  const [getSignedUrl] = useMutation(GET_SIGNED_UPLOAD_URL);

  const uploadToCloudinary = async (file) => {
    try {
      // Get signed URL from our backend
      const { data: signedUrlData } = await getSignedUrl();
      const { signature, timestamp, apiKey } = signedUrlData.getSignedUploadUrl;

      // Create form data for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', 'powerpulse/profile-pictures');
      formData.append('transformation', 'c_limit,w_500,h_500,f_auto');

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  };

  return { uploadToCloudinary };
}